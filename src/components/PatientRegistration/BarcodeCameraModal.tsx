import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  AlertCircle,
  ScanLine,
  StopCircle,
  RefreshCw,
  Upload,
  RotateCcw,
  ShieldAlert,
  Info,
  Terminal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import styles from './BarcodeCameraModal.module.css';

interface BarcodeCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedValue: string) => void;
}

// Global interface for Native BarcodeDetector
interface NativeBarcodeDetector {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string; format: string }>>;
}

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats: string[] }): NativeBarcodeDetector;
      getSupportedFormats?: () => Promise<string[]>;
    };
  }
}

export const BarcodeCameraModal: React.FC<BarcodeCameraModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  // Device Selection & Permissions
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('environment');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorTip, setErrorTip] = useState<string | null>(null);
  const [hasPermissionDenied, setHasPermissionDenied] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string | null>(null);
  const [isInsecureContext, setIsInsecureContext] = useState<boolean>(false);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  // Diagnostics State (Phase 2 Requirement)
  const [diagnostics, setDiagnostics] = useState({
    protocol: typeof window !== 'undefined' ? window.location.protocol : '',
    isSecure: false,
    hasMediaDevices: false,
    permissionState: 'unknown',
    detectedCamerasCount: 0,
    activeCameraLabel: 'None',
    cameraStatus: 'Idle',
    videoPlayback: 'Not Ready',
    videoDimensions: '0 x 0',
    clientDimensions: '0 x 0',
    selectedFormat: 'Code 128 (Primary)',
    activeEngine: 'Pending...',
    framesScanned: 0,
    lastCameraError: 'None',
    lastDecodeError: 'None',
    patientLookupStatus: 'Idle'
  });

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const nativeDetectorRef = useRef<NativeBarcodeDetector | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Sound feedback for successful barcode scan
  const playScanBeep = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz A5 beep
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      }
    } catch {
      // AudioContext not permitted or supported; silent fallback
    }
  };

  // Stop scanning interval loop
  const stopScanLoop = () => {
    if (scanIntervalRef.current !== null) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // Safely stop all active media tracks, decoding loops, and video playback
  const stopCameraStream = useCallback(() => {
    stopScanLoop();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // Ignore track stop error
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch {
        // Ignore pause error
      }
    }

    if (zxingReaderRef.current) {
      try {
        zxingReaderRef.current.reset();
      } catch {
        // Ignore reset error
      }
      zxingReaderRef.current = null;
    }

    nativeDetectorRef.current = null;

    if (isMountedRef.current) {
      setIsStreaming(false);
      setIsInitializing(false);
      setActiveCameraLabel(null);
      setDiagnostics(prev => ({
        ...prev,
        cameraStatus: 'Idle',
        videoPlayback: 'Stopped',
        activeCameraLabel: 'None'
      }));
    }
  }, []);

  // Enumerate cameras (called without requesting permission on mount)
  const enumerateCameras = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.enumerateDevices
    ) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      if (isMountedRef.current) {
        setVideoDevices(videoInputs);
        setDiagnostics(prev => ({
          ...prev,
          detectedCamerasCount: videoInputs.length
        }));
      }
    } catch (err: unknown) {
      console.warn('Could not enumerate cameras:', err);
    }
  }, []);

  // Check Secure Context and permission status on modal open
  useEffect(() => {
    isMountedRef.current = true;

    if (isOpen) {
      setErrorMsg(null);
      setErrorTip(null);
      setHasPermissionDenied(false);
      isProcessingRef.current = false;
      setIsResolving(false);

      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === '[::1]');
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isContextSecure =
        typeof window !== 'undefined' && (window.isSecureContext || isLocal || isHttps);

      setIsInsecureContext(!isContextSecure);

      // Check permission state via Permissions API if available
      let permState = 'unknown';
      if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'camera' as PermissionName })
          .then(status => {
            if (isMountedRef.current) {
              setDiagnostics(prev => ({ ...prev, permissionState: status.state }));
            }
          })
          .catch(() => {});
      }

      setDiagnostics(prev => ({
        ...prev,
        protocol: typeof window !== 'undefined' ? window.location.protocol : '',
        isSecure: isContextSecure,
        hasMediaDevices: Boolean(
          typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia
        ),
        permissionState: permState,
        cameraStatus: 'Idle',
        lastCameraError: 'None',
        lastDecodeError: 'None',
        patientLookupStatus: 'Idle',
        framesScanned: 0
      }));

      enumerateCameras();
    } else {
      stopCameraStream();
    }

    return () => {
      isMountedRef.current = false;
      stopCameraStream();
    };
  }, [isOpen, enumerateCameras, stopCameraStream]);

  // Build constraints ladder for progressive fallback
  const getConstraintsLadder = (targetId: string): MediaStreamConstraints[] => {
    if (targetId === 'environment') {
      return [
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        {
          video: {
            facingMode: { ideal: 'environment' }
          }
        },
        {
          video: {
            facingMode: 'environment'
          }
        },
        { video: true }
      ];
    }

    if (targetId === 'user') {
      return [
        {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        {
          video: { facingMode: 'user' }
        },
        { video: true }
      ];
    }

    return [
      {
        video: {
          deviceId: { exact: targetId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      },
      {
        video: {
          deviceId: { exact: targetId }
        }
      },
      {
        video: {
          deviceId: targetId
        }
      },
      {
        video: {
          facingMode: { ideal: 'environment' }
        }
      },
      { video: true }
    ];
  };

  // Handle successful barcode detection
  const handleSuccessfulScan = (scannedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    stopScanLoop();
    playScanBeep();
    stopCameraStream();
    setIsResolving(true);
    setDiagnostics(prev => ({
      ...prev,
      cameraStatus: 'Barcode Detected',
      patientLookupStatus: `Sending UHID: ${scannedText} to Backend API...`
    }));
    onScanSuccess(scannedText);
  };

  // Start continuous active frame scanning loop (Dual Engine: Native BarcodeDetector + ZXing Fallback)
  const startScanLoop = (video: HTMLVideoElement) => {
    stopScanLoop();

    // 1. Try Hardware-Accelerated Native BarcodeDetector (Available on Android Chrome & modern iOS)
    let nativeDetector: NativeBarcodeDetector | null = null;
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window && window.BarcodeDetector) {
      try {
        nativeDetector = new window.BarcodeDetector({
          formats: ['code_128', 'code_39', 'qr_code', 'ean_13']
        });
        nativeDetectorRef.current = nativeDetector;
        console.log('[Scanner] Initialized Hardware-Accelerated Native BarcodeDetector (Code 128)');
        setDiagnostics(prev => ({
          ...prev,
          activeEngine: 'Native BarcodeDetector (Hardware GPU)'
        }));
      } catch (err) {
        console.warn('[Scanner] Native BarcodeDetector failed to construct, falling back to ZXing:', err);
        nativeDetector = null;
      }
    }

    // 2. Initialize @zxing/library MultiFormatReader (Universal software fallback)
    const hints = new Map<DecodeHintType, unknown>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.QR_CODE
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const zxingReader = new BrowserMultiFormatReader(hints);
    zxingReaderRef.current = zxingReader;

    if (!nativeDetector) {
      console.log('[Scanner] Using Pure JavaScript @zxing/library MultiFormatReader (Code 128)');
      setDiagnostics(prev => ({
        ...prev,
        activeEngine: '@zxing/library MultiFormatReader (Software)'
      }));
    }

    let frameCount = 0;

    // Scan loop running every 120ms (~8 FPS) — optimal for mobile CPU & battery
    scanIntervalRef.current = window.setInterval(async () => {
      if (
        !video ||
        video.paused ||
        video.ended ||
        video.readyState < 2 ||
        isProcessingRef.current
      ) {
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw === 0 || vh === 0) {
        return;
      }

      frameCount++;
      if (frameCount % 8 === 0 && isMountedRef.current) {
        setDiagnostics(prev => ({
          ...prev,
          framesScanned: frameCount,
          cameraStatus: 'Scanning',
          videoDimensions: `${vw} x ${vh}`,
          clientDimensions: `${video.clientWidth} x ${video.clientHeight}`
        }));
      }

      // Engine 1: Native BarcodeDetector (Fastest & Most Accurate on Android Chrome)
      if (nativeDetectorRef.current) {
        try {
          const barcodes = await nativeDetectorRef.current.detect(video);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue?.trim();
            if (rawValue) {
              console.log('[Scanner] Native BarcodeDetector found barcode:', rawValue, barcodes[0].format);
              handleSuccessfulScan(rawValue);
              return;
            }
          }
        } catch {
          // If native detector encounters a transient error, fall through to ZXing
        }
      }

      // Engine 2: @zxing/library direct frame decode (Universal Fallback)
      if (zxingReaderRef.current) {
        try {
          const result = zxingReaderRef.current.decode(video);
          if (result) {
            const rawText = result.getText()?.trim();
            if (rawText) {
              console.log('[Scanner] ZXing found barcode:', rawText, result.getBarcodeFormat());
              handleSuccessfulScan(rawText);
              return;
            }
          }
        } catch (err: unknown) {
          const decodeErr = err as Error;
          // NotFoundException is normal when no barcode is in the current frame
          if (decodeErr.name !== 'NotFoundException') {
            if (isMountedRef.current) {
              setDiagnostics(prev => ({
                ...prev,
                lastDecodeError: decodeErr.message || String(decodeErr)
              }));
            }
          }
        }
      }
    }, 120);
  };

  // Start scanning with a specific device ID
  const startScanningWithDevice = async (deviceIdToUse: string) => {
    if (isStreaming || isInitializing) {
      stopCameraStream();
    }

    setErrorMsg(null);
    setErrorTip(null);
    setHasPermissionDenied(false);
    setIsInitializing(true);
    isProcessingRef.current = false;
    setDiagnostics(prev => ({
      ...prev,
      cameraStatus: 'Requesting permission & starting camera...',
      lastCameraError: 'None',
      lastDecodeError: 'None'
    }));

    // Check mediaDevices support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setIsInitializing(false);
      setDiagnostics(prev => ({
        ...prev,
        cameraStatus: 'Camera API Unavailable',
        lastCameraError: 'getUserMedia not supported in this context'
      }));
      if (isInsecureContext) {
        setErrorMsg('Camera access is blocked by mobile browsers over unencrypted HTTP (http://192.168.x.x).');
        setErrorTip('Please use the live HTTPS deployment on Vercel or GitHub Pages, or use the Image Upload option below.');
      } else {
        setErrorMsg('Your browser does not support the modern camera API. Please use Chrome, Safari, or Edge.');
      }
      return;
    }

    try {
      const constraintsLadder = getConstraintsLadder(deviceIdToUse);
      let stream: MediaStream | null = null;
      let lastError: unknown = null;

      // Try constraints from most specific to universal fallback
      for (const constraint of constraintsLadder) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          if (stream) break;
        } catch (err: unknown) {
          lastError = err;
        }
      }

      if (!stream) {
        throw lastError || new Error('Unable to obtain camera stream from any constraint.');
      }

      streamRef.current = stream;

      // Extract active track info
      const activeTrack = stream.getVideoTracks()[0];
      let trackLabel = 'Active Camera';
      if (activeTrack) {
        const settings = activeTrack.getSettings ? activeTrack.getSettings() : {};
        trackLabel = activeTrack.label || (settings.facingMode === 'environment' ? 'Rear Camera' : 'Webcam');
        setActiveCameraLabel(trackLabel);

        // Continuous autofocus and auto-exposure for Android Chrome
        if (typeof activeTrack.getCapabilities === 'function') {
          try {
            const caps = activeTrack.getCapabilities() as { focusMode?: string[]; exposureMode?: string[] };
            const advanced: Record<string, string> = {};
            if (caps?.focusMode && Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
              advanced.focusMode = 'continuous';
            }
            if (caps?.exposureMode && Array.isArray(caps.exposureMode) && caps.exposureMode.includes('continuous')) {
              advanced.exposureMode = 'continuous';
            }
            if (Object.keys(advanced).length > 0 && typeof activeTrack.applyConstraints === 'function') {
              await activeTrack.applyConstraints({ advanced: [advanced] }).catch(() => {});
            }
          } catch {
            // Ignore capability errors on older device drivers
          }
        }
      }

      // Attach stream to video element
      const video = videoRef.current;
      if (!video) {
        throw new Error('Video preview element is not ready.');
      }

      // Display video element in layout immediately so dimensions are computed
      setIsStreaming(true);

      // Explicitly set WebKit and iOS inline autoplay attributes
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('muted', 'true');
      video.muted = true;
      video.autoplay = true;
      video.srcObject = stream;

      // Play video with graceful catch
      try {
        await video.play();
        setDiagnostics(prev => ({ ...prev, videoPlayback: 'Playing' }));
      } catch (playErr) {
        console.warn('Initial video.play() waiting on user gesture:', playErr);
      }

      // Wait for non-zero dimensions to ensure frames are being decoded
      await new Promise<void>(resolve => {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          resolve();
          return;
        }
        const onReady = () => {
          if (video.videoWidth > 0) {
            video.removeEventListener('loadeddata', onReady);
            video.removeEventListener('playing', onReady);
            resolve();
          }
        };
        video.addEventListener('loadeddata', onReady, { once: true });
        video.addEventListener('playing', onReady, { once: true });
        setTimeout(resolve, 1500); // 1.5s fallback timeout
      });

      if (!isMountedRef.current) return;

      setIsInitializing(false);
      setDiagnostics(prev => ({
        ...prev,
        cameraStatus: 'Active & Scanning',
        activeCameraLabel: trackLabel,
        videoDimensions: `${video.videoWidth} x ${video.videoHeight}`,
        clientDimensions: `${video.clientWidth} x ${video.clientHeight}`
      }));

      // Re-enumerate devices now that permission is granted to get real camera labels
      enumerateCameras();

      // Start continuous active scanning loop
      startScanLoop(video);
    } catch (err: unknown) {
      stopCameraStream();
      setIsInitializing(false);
      const error = err as Error;

      setDiagnostics(prev => ({
        ...prev,
        cameraStatus: 'Error',
        lastCameraError: `${error.name}: ${error.message}`
      }));

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setHasPermissionDenied(true);
        setErrorMsg('Camera access was denied by your browser.');
        setErrorTip(
          'On mobile: Tap the lock / settings icon beside the URL in your browser bar, select "Permissions" / "Camera", and change it to "Allow".'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera hardware was detected on this device.');
        setErrorTip('Please verify your webcam or mobile camera is functioning.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setErrorMsg('The camera is currently locked or in use by another application.');
        setErrorTip('Close apps like WhatsApp, Zoom, or other browser tabs that may be using your camera, then tap Retry.');
      } else if (error.name === 'OverconstrainedError') {
        setErrorMsg('Requested camera format is not supported by your lens.');
        setErrorTip('Falling back to default camera lens...');
      } else {
        setErrorMsg(`Failed to initialize camera: ${error.message || 'Unknown camera error'}`);
        setErrorTip('Ensure you are visiting over HTTPS or localhost, then tap Retry.');
      }
    }
  };

  // User taps "Start Scanning"
  const startScanning = () => {
    startScanningWithDevice(selectedDeviceId);
  };

  // Flip / Switch Camera
  const toggleFlipCamera = () => {
    const nextDevice = selectedDeviceId === 'environment' ? 'user' : 'environment';
    setSelectedDeviceId(nextDevice);
    if (isStreaming) {
      stopCameraStream();
      setTimeout(() => {
        startScanningWithDevice(nextDevice);
      }, 150);
    }
  };

  // User selects device from dropdown
  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    if (isStreaming) {
      stopCameraStream();
      setTimeout(() => {
        startScanningWithDevice(newDeviceId);
      }, 150);
    }
  };

  // Safe Fallback: Image Upload / Test Sticker Scan Fallback (Phase 7 Requirement)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setErrorTip(null);
    setIsResolving(true);
    setDiagnostics(prev => ({
      ...prev,
      patientLookupStatus: 'Decoding uploaded image...'
    }));

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = async () => {
            try {
              let detectedText: string | null = null;

              // 1. Try Native BarcodeDetector on image if supported
              if (
                typeof window !== 'undefined' &&
                'BarcodeDetector' in window &&
                window.BarcodeDetector
              ) {
                try {
                  const detector = new window.BarcodeDetector({
                    formats: ['code_128', 'code_39', 'qr_code']
                  });
                  const barcodes = await detector.detect(img);
                  if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                    detectedText = barcodes[0].rawValue.trim();
                  }
                } catch {
                  // Fallback to ZXing
                }
              }

              // 2. Fallback to ZXing on Image Element
              if (!detectedText) {
                const hints = new Map<DecodeHintType, unknown>();
                hints.set(DecodeHintType.POSSIBLE_FORMATS, [
                  BarcodeFormat.CODE_128,
                  BarcodeFormat.CODE_39,
                  BarcodeFormat.QR_CODE
                ]);
                const zxingReader = new BrowserMultiFormatReader(hints);
                const result = await zxingReader.decodeFromImageElement(img);
                detectedText = result?.getText()?.trim() || null;
              }

              if (detectedText) {
                playScanBeep();
                stopCameraStream();
                onScanSuccess(detectedText);
              } else {
                setErrorMsg('No readable Code 128 barcode found in the uploaded image.');
                setErrorTip('Ensure the patient sticker barcode is sharp, in focus, and well-lit.');
                setIsResolving(false);
              }
            } catch {
              setErrorMsg('Could not decode barcode from this image.');
              setErrorTip('Please ensure the patient sticker barcode is clearly visible without glare.');
              setIsResolving(false);
            }
          };
        } catch {
          setErrorMsg('Failed to process the uploaded image.');
          setIsResolving(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('Failed to read image file.');
      setIsResolving(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={() => {
        stopCameraStream();
        onClose();
      }}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.titleIcon}>
              <ScanLine size={22} />
            </div>
            <div>
              <h2 className={styles.title}>Scan Patient Barcode</h2>
              <span className={styles.badge} style={{ background: 'rgba(52, 168, 83, 0.12)', color: '#15803d' }}>
                Code 128 • Mobile Ready
              </span>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            aria-label="Close scanner modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {/* Insecure Context Notice (if accessed via http://192.168.x.x on mobile) */}
          {isInsecureContext && (
            <div className={styles.insecureBanner} role="alert">
              <div className={styles.insecureBannerTitle}>
                <ShieldAlert size={18} />
                <span>Insecure Connection Warning (HTTP)</span>
              </div>
              <p style={{ margin: '0 0 0.4rem 0' }}>
                Mobile browsers (Android Chrome and iPhone Safari) strictly block camera hardware over unencrypted local IP HTTP (e.g. <code>http://192.168.x.x</code>).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem' }}>
                <div>
                  • To scan with your phone camera, use the secure HTTPS deployment:{' '}
                  <a
                    href="https://frontend-six-ivory-wl8d092rfw.vercel.app/#/patient-registration"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.insecureLink}
                  >
                    Open Live Vercel App
                  </a>
                </div>
                <div>• Or snap a photo directly using the <strong>Upload Barcode Image</strong> fallback below.</div>
              </div>
            </div>
          )}

          {/* Camera Selection Controls */}
          <div className={styles.controlGroup}>
            <label className={styles.label} htmlFor="camera-select">
              <Camera size={14} /> Select Camera Lens
            </label>
            <select
              id="camera-select"
              className={styles.select}
              value={selectedDeviceId}
              onChange={e => handleDeviceChange(e.target.value)}
            >
              <option value="environment">Rear / Back Camera (Recommended for Mobile)</option>
              <option value="user">Front / User Webcam</option>
              {videoDevices
                .filter(d => Boolean(d.label))
                .map((device, index) => (
                  <option key={device.deviceId || index} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
            </select>
            <p className={styles.helpText}>
              Tap <strong>Start Scanning</strong> below. The rear camera on mobile provides macro barcode focus.
            </p>
          </div>

          {/* Unified Camera Viewport with 4:3 Aspect Ratio (Block Layout) */}
          <div className={styles.previewContainer}>
            {/* Live Video Preview (display: block, 100% width/height, object-fit: cover) */}
            <video
              ref={videoRef}
              className={styles.videoElement}
              playsInline
              muted
              autoPlay
              style={{
                display: isStreaming ? 'block' : 'none'
              }}
            />

            {/* Live Camera Controls & Viewfinder (when streaming) */}
            {isStreaming && (
              <>
                {/* Floating Top Controls (Active Track Name & Flip Camera) */}
                <div className={styles.previewHeader}>
                  <div className={styles.activeTrackBadge}>
                    <Camera size={12} />
                    <span>{activeCameraLabel || 'Live Camera'}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.switchCameraBtn}
                    onClick={toggleFlipCamera}
                    title="Switch between front and rear cameras"
                  >
                    <RotateCcw size={12} />
                    <span>Flip Lens</span>
                  </button>
                </div>

                {/* Reticle / Viewfinder Overlay with GPU-Safe SVG Mask Cutout */}
                <div className={styles.reticleOverlay}>
                  <svg className={styles.maskSvg} preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <mask id="scannerCutoutMask">
                        <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                        <rect x="12" y="21" width="76" height="58" rx="3" fill="#000000" />
                      </mask>
                    </defs>
                    <rect x="0" y="0" width="100" height="100" fill="rgba(0, 0, 0, 0.4)" mask="url(#scannerCutoutMask)" />
                  </svg>
                  <div className={styles.targetFrame}>
                    <div className={styles.laserLine} />
                  </div>
                  <div className={styles.frameCaption}>
                    Align patient sticker Code 128 barcode inside frame
                  </div>
                </div>
              </>
            )}

            {/* Idle State Overlay (when camera is not streaming) */}
            {!isStreaming && (
              <div className={styles.idleOverlay}>
                <div className={styles.idleIcon}>
                  <Camera size={44} strokeWidth={1.5} />
                </div>
                <p className={styles.idleTitle}>Camera is currently idle</p>
                <p className={styles.idleSubtitle}>
                  Tap <strong>Start Scanning</strong> below. The browser will request camera permission and activate live scanning.
                </p>
              </div>
            )}
          </div>

          {/* Resolving / Loading State */}
          {isResolving && (
            <div className={styles.resolvingState}>
              <div className={styles.spinner} />
              <span>Decoding barcode and looking up patient record...</span>
            </div>
          )}

          {/* Error Banner with Troubleshooting Details */}
          {errorMsg && (
            <div className={styles.alertError} role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div><strong>Camera Notice:</strong> {errorMsg}</div>
                {errorTip && (
                  <div style={{ marginTop: '4px', fontSize: '0.8rem', color: '#7f1d1d' }}>
                    <Info size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                    {errorTip}
                  </div>
                )}
                {hasPermissionDenied && (
                  <div style={{ marginTop: '6px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.7)', padding: '6px 8px', borderRadius: '4px' }}>
                    <strong>How to grant permission:</strong>
                    <br />
                    • <strong>Android Chrome:</strong> Tap the lock/info icon in URL bar → Permissions → Camera → Allow.
                    <br />
                    • <strong>iPhone Safari:</strong> Tap the &quot;AA&quot; button in address bar → Website Settings → Camera → Allow.
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    className={styles.retryBtn}
                    onClick={startScanning}
                  >
                    <RefreshCw size={12} /> Retry Camera
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Live Diagnostic Panel (Dev & Mobile Troubleshooting) */}
          <div className={styles.diagnosticSection}>
            <div
              className={styles.diagnosticHeader}
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              <div className={styles.diagnosticTitle}>
                <Terminal size={14} />
                <span>Scanner Diagnostics & State Monitor</span>
              </div>
              <button
                type="button"
                className={styles.diagnosticToggleBtn}
                onClick={e => {
                  e.stopPropagation();
                  setShowDiagnostics(!showDiagnostics);
                }}
              >
                {showDiagnostics ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                <span style={{ marginLeft: '4px' }}>{showDiagnostics ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            {/* Always visible quick status bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', fontSize: '0.72rem' }}>
              <span>
                Status:{' '}
                <strong className={diagnostics.cameraStatus === 'Scanning' ? styles.badgeOk : styles.badgeWarn}>
                  {diagnostics.cameraStatus}
                </strong>
              </span>
              <span>•</span>
              <span>
                Engine: <strong style={{ color: '#38bdf8' }}>{diagnostics.activeEngine}</strong>
              </span>
              <span>•</span>
              <span>
                Frames: <strong style={{ color: '#a78bfa' }}>{diagnostics.framesScanned}</strong>
              </span>
            </div>

            {/* Detailed diagnostic metrics grid when expanded */}
            {showDiagnostics && (
              <div className={styles.diagnosticGrid}>
                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Context Security</span>
                  <span className={styles.diagnosticValue}>
                    {diagnostics.protocol}{' '}
                    {diagnostics.isSecure ? (
                      <span className={styles.badgeOk}>(Secure)</span>
                    ) : (
                      <span className={styles.badgeErr}>(Insecure)</span>
                    )}
                  </span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Camera API</span>
                  <span className={styles.diagnosticValue}>
                    {diagnostics.hasMediaDevices ? (
                      <span className={styles.badgeOk}>Available</span>
                    ) : (
                      <span className={styles.badgeErr}>Unavailable</span>
                    )}
                  </span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Permission</span>
                  <span className={styles.diagnosticValue}>{diagnostics.permissionState}</span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Cameras Detected</span>
                  <span className={styles.diagnosticValue}>{diagnostics.detectedCamerasCount} devices</span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Active Camera</span>
                  <span className={styles.diagnosticValue}>{diagnostics.activeCameraLabel}</span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Video Dimensions</span>
                  <span className={styles.diagnosticValue}>
                    {diagnostics.videoDimensions} (Client: {diagnostics.clientDimensions})
                  </span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Barcode Symbology</span>
                  <span className={styles.diagnosticValue}>{diagnostics.selectedFormat}</span>
                </div>

                <div className={styles.diagnosticItem}>
                  <span className={styles.diagnosticKey}>Patient Lookup</span>
                  <span className={styles.diagnosticValue}>{diagnostics.patientLookupStatus}</span>
                </div>

                <div className={styles.diagnosticItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.diagnosticKey}>Last Camera Error</span>
                  <span className={diagnostics.lastCameraError === 'None' ? styles.diagnosticValue : styles.badgeErr}>
                    {diagnostics.lastCameraError}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Safe Fallback: Upload Barcode Image (Phase 7 Requirement) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem', borderTop: '1px dashed var(--border, #e2e8f0)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Without live webcam, snap or upload sticker:
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isResolving}
            >
              <Upload size={13} /> Upload Barcode Image
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          {isStreaming ? (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={stopCameraStream}
              >
                Pause Camera
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnStop}`}
                onClick={() => {
                  stopCameraStream();
                  onClose();
                }}
              >
                <StopCircle size={15} /> Stop & Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  stopCameraStream();
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={startScanning}
                disabled={isInitializing || isResolving}
              >
                {isInitializing ? (
                  <>
                    <RefreshCw size={15} className={styles.spinner} />
                    <span>Connecting Camera...</span>
                  </>
                ) : (
                  <>
                    <Camera size={15} />
                    <span>Start Scanning</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
