import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  AlertCircle,
  ScanLine,
  StopCircle,
  RefreshCw,
  Upload
} from 'lucide-react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import styles from './BarcodeCameraModal.module.css';

interface BarcodeCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedValue: string) => void;
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
  const [hasPermissionDenied, setHasPermissionDenied] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sound feedback for successful barcode scan
  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz A5 beep
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // AudioContext not allowed or not supported; silent fallback
    }
  };

  // Safely stop all active media tracks and reader decoding
  const stopCameraStream = useCallback(() => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch {
        // Ignore reset error
      }
      codeReaderRef.current = null;
    }

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
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setIsInitializing(false);
  }, []);

  // Enumerate cameras (called without requesting permission on mount)
  const enumerateCameras = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setErrorMsg('Camera access is not supported by this browser.');
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoInputs);

      // If user hasn't selected a specific camera yet, prefer back/environment camera
      if (videoInputs.length > 0 && selectedDeviceId === 'environment') {
        const backCamera = videoInputs.find(d =>
          d.label.toLowerCase().includes('back') ||
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        );
        if (backCamera && backCamera.deviceId) {
          setSelectedDeviceId(backCamera.deviceId);
        } else if (videoInputs[0].deviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      }
    } catch (err: unknown) {
      console.warn('Could not enumerate cameras:', err);
    }
  }, [selectedDeviceId]);

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setHasPermissionDenied(false);
      isProcessingRef.current = false;
      setIsResolving(false);
      enumerateCameras();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, enumerateCameras, stopCameraStream]);

  // Start live scanning when user clicks "Start Scanning"
  const startScanning = async () => {
    if (isStreaming || isInitializing) return;

    setErrorMsg(null);
    setHasPermissionDenied(false);
    setIsInitializing(true);
    isProcessingRef.current = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Camera API is not supported in this browser. Please use HTTPS or localhost.');
      setIsInitializing(false);
      return;
    }

    try {
      // Configure camera constraints
      let constraints: MediaStreamConstraints;
      if (selectedDeviceId === 'environment') {
        constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      } else if (selectedDeviceId === 'user') {
        constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      } else {
        constraints = {
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      }

      // Request camera stream through browser permission prompt
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsStreaming(true);
      setIsInitializing(false);

      // Re-enumerate devices now that permission is granted to get real camera labels
      enumerateCameras();

      // Configure ZXing multi-format reader with Code 128 primary
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE,
        BarcodeFormat.EAN_13
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const codeReader = new BrowserMultiFormatReader(hints);
      codeReaderRef.current = codeReader;

      // Start continuous frame decoding
      if (videoRef.current) {
        codeReader.decodeFromVideoElementContinuously(videoRef.current, (result, decodeErr) => {
          if (result && !isProcessingRef.current) {
            const rawText = result.getText()?.trim();
            if (rawText) {
              isProcessingRef.current = true;
              playScanBeep();
              stopCameraStream();
              setIsResolving(true);
              onScanSuccess(rawText);
            }
          }
          if (decodeErr && !(decodeErr.name === 'NotFoundException')) {
            // Log non-routine decode error
          }
        });
      }
    } catch (err: unknown) {
      stopCameraStream();
      setIsInitializing(false);
      const error = err as Error;

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setHasPermissionDenied(true);
        setErrorMsg('Camera access was denied. Please allow camera permissions in your browser address bar to scan patient barcodes.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera device was detected on your system. Please connect a webcam.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setErrorMsg('The selected camera is already in use by another application.');
      } else {
        setErrorMsg(`Failed to start camera: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Image Upload / Test Sticker Scan Fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsResolving(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = async () => {
            try {
              const hints = new Map();
              hints.set(DecodeHintType.POSSIBLE_FORMATS, [
                BarcodeFormat.CODE_128,
                BarcodeFormat.CODE_39,
                BarcodeFormat.QR_CODE
              ]);
              const zxingReader = new BrowserMultiFormatReader(hints);
              const result = await zxingReader.decodeFromImageElement(img);
              const text = result?.getText()?.trim();
              if (text) {
                playScanBeep();
                stopCameraStream();
                onScanSuccess(text);
              } else {
                setErrorMsg('No readable Code 128 barcode found in the uploaded image.');
                setIsResolving(false);
              }
            } catch {
              setErrorMsg('Could not decode barcode from this image. Please ensure the Code 128 barcode is clearly visible.');
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
                Code 128 Support
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
          {/* Camera Selection Controls */}
          <div className={styles.controlGroup}>
            <label className={styles.label} htmlFor="camera-select">
              <Camera size={14} /> Select Camera Device
            </label>
            <select
              id="camera-select"
              className={styles.select}
              value={selectedDeviceId}
              disabled={isStreaming}
              onChange={e => setSelectedDeviceId(e.target.value)}
            >
              <option value="environment">Rear / Back Camera (Recommended for Mobile)</option>
              <option value="user">Front / User Webcam</option>
              {videoDevices.map((device, index) => (
                <option key={device.deviceId || index} value={device.deviceId}>
                  {device.label || `Camera ${index + 1} (${device.deviceId.substring(0, 8)}...)`}
                </option>
              ))}
            </select>
            <p className={styles.helpText}>
              Select your preferred camera or rear lens. The camera will only activate when you click <strong>Start Scanning</strong>.
            </p>
          </div>

          {/* Camera Viewport / Live Stream */}
          {isStreaming ? (
            <div className={styles.previewContainer}>
              <video
                ref={videoRef}
                className={styles.videoElement}
                playsInline
                muted
                autoPlay
              />
              <div className={styles.reticleOverlay}>
                <div className={styles.targetFrame}>
                  <div className={styles.laserLine} />
                </div>
                <div className={styles.frameCaption}>
                  Align patient sticker Code 128 barcode inside frame
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.idleContainer}>
              <div className={styles.idleIcon}>
                <Camera size={44} strokeWidth={1.5} />
              </div>
              <p className={styles.idleTitle}>Camera is currently idle</p>
              <p className={styles.idleSubtitle}>
                Click <strong>Start Scanning</strong> below to activate your webcam and read patient stickers.
              </p>
            </div>
          )}

          {/* Resolving / Loading State */}
          {isResolving && (
            <div className={styles.resolvingState}>
              <div className={styles.spinner} />
              <span>Decoding barcode and looking up patient record...</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className={styles.alertError} role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Scanner Notice:</strong> {errorMsg}
                {hasPermissionDenied && (
                  <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                    Tip: Look for the camera icon in your browser URL bar to change permission to &quot;Allow&quot;.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image Upload Fallback (for testing / without physical webcam) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No webcam? You can also upload a sticker image:
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
              <Upload size={13} /> Select Image
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
