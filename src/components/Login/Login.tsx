import React, { useState } from 'react';
import { Eye, EyeOff, Activity, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import mixuLogoClean from '../../assets/mixu-logo-clean.png';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate small network delay for smooth authentication experience
    setTimeout(() => {
      if (username === 'admin' && password === 'pass123') {
        onLogin();
        navigate('/patient-registration');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className={styles.splitPageContainer}>
      <div className={styles.splitWrapper}>
        {/* Left 40% Branding Panel */}
        <div className={styles.brandingPanel}>
          <div className={styles.brandDecorativeAccent}>
            <span style={{ backgroundColor: '#4285F4' }} />
            <span style={{ backgroundColor: '#EA4335' }} />
            <span style={{ backgroundColor: '#FBBC05' }} />
            <span style={{ backgroundColor: '#34A853' }} />
          </div>

          <div className={styles.brandContent}>
            <div className={styles.brandLogoBox}>
              <img
                src={mixuLogoClean}
                alt="Mixu Infosystem Logo"
                className={styles.brandLogoImg}
              />
            </div>

            <div className={styles.brandTagline}>
              Next-Generation Healthcare Information Management System
            </div>

            <p className={styles.brandDescription}>
              Comprehensive Hospital & EMR platform delivering intelligent patient registration, encounter tracking, OPD billing, clinical records, and diagnostic reporting with real-time operational precision.
            </p>

            <div className={styles.brandFeatures}>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="#34A853" />
                <span>Fast Barcode & UHID Identification</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="#4285F4" />
                <span>Real-time Encounter & Visit History</span>
              </div>
              <div className={styles.featureItem}>
                <CheckCircle2 size={15} color="#EA4335" />
                <span>Dynamic Billing & A4 PDF Printing</span>
              </div>
            </div>
          </div>

          <div className={styles.brandFooter}>
            <span>Powered by <strong>Mixu Infosystem</strong></span>
          </div>
        </div>

        {/* Right 60% Login Panel */}
        <div className={styles.formPanel}>
          <div className={styles.loginCard}>
            <div className={styles.header}>
              <div className={styles.hospitalEmblemBox}>
                <Activity size={26} color="var(--primary)" />
              </div>
              <h1 className={styles.title}>{HOSPITAL_CONFIG.name}</h1>
              <p className={styles.subtitle}>
                Sign in to access your administrative and clinical portal
              </p>
            </div>

            <form className={styles.form} onSubmit={handleLogin} noValidate>
              {error && (
                <div className={styles.errorMessage} role="alert">
                  {error}
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.optionsRow}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <a href="#" className={styles.forgotPassword} onClick={e => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                <Lock size={15} style={{ marginRight: '6px' }} />
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className={styles.demoInfo}>
              <p>Demo Login Credentials</p>
              <div>Username: <code>admin</code></div>
              <div style={{ marginTop: '4px' }}>Password: <code>pass123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
