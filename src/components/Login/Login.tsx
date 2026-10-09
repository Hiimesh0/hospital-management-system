import React, { useState } from 'react';
import { Eye, EyeOff, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

 // Simulate small network delay for premium feel
 setTimeout(() => {
 if (username === 'admin' && password === 'pass123') {
 onLogin();
 navigate('/patient-registration');
 } else {
 setError('Invalid username or password');
 setIsLoading(false);
 }
 }, 600);
 };

 return (
 <div className={styles.pageContainer}>
 <div className={styles.loginCard}>
 
 <div className={styles.header}>
 <div className={styles.logoBox}>
 <Activity size={28} />
 </div>
 <h1 className={styles.title}>Hospital Management System</h1>
 <p className={styles.subtitle}>Secure access to your hospital administration portal</p>
 </div>

 <form className={styles.form} onSubmit={handleLogin}>
 
 {error && <div className={styles.errorMessage}>{error}</div>}

 <div className={styles.fieldGroup}>
 <label className={styles.label}>Username</label>
 <div className={styles.inputWrapper}>
 <input
 type="text"
 className={`${styles.input} ${error ? styles.error : ''}`}
 
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 required
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
 onChange={(e) => setPassword(e.target.value)}
 required
 />
 <button
 type="button"
 className={styles.passwordToggle}
 onClick={() => setShowPassword(!showPassword)}
 aria-label={showPassword ? "Hide password" : "Show password"}
>
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>
 </div>

 <div className={styles.optionsRow}>
 <label className={styles.rememberMe}>
 <input type="checkbox" /> Remember me
 </label>
 <a href="#" className={styles.forgotPassword} onClick={(e) => e.preventDefault()}>
 Forgot Password?
 </a>
 </div>

 <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
 {isLoading ? 'Signing In...' : 'Sign In'}
 </button>

 </form>

 <div className={styles.demoInfo}>
 <p>Demo Access</p>
 <div>Username: <code>admin</code></div>
 <div style={{marginTop: '4px'}}>Password: <code>pass123</code></div>
 </div>

 </div>
 </div>
 );
};

export default Login;
