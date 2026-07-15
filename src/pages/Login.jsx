import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Sparkles, Mail, Lock, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

export default function Login({ setActiveView }) {
  const { login, users, addNotification } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default password for simplicity
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot password flow states
  const [resetStep, setResetStep] = useState(0); // 0 = none, 1 = enter email, 2 = enter code, 3 = reset password, 4 = success
  const [resetEmail, setResetEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = login(email, password);
    if (result.success) {
      if (result.user.role === 'Admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('employee-dashboard');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('password123');
    const result = login(quickEmail, 'password123');
    if (result.success) {
      if (result.user.role === 'Admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('employee-dashboard');
      }
    }
  };

  // Forgot password steps handling
  const handleRequestCode = (e) => {
    e.preventDefault();
    setResetError('');
    const userExist = users.find(u => u.email === resetEmail);
    if (!userExist) {
      setResetError('No account matching this email address was found in our system.');
      return;
    }
    
    // Simulate email code sending
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    addNotification('Password Reset', `Simulated email sent to ${resetEmail} with verification code: ${code}`);
    alert(`[Simulated Email] Verification code sent to ${resetEmail}: ${code}`);
    setResetStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setResetError('');
    if (verifyCode === simulatedCode) {
      setResetStep(3);
    } else {
      setResetError('Invalid verification code. Please check your simulated code.');
    }
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    setResetError('');
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    // Simulate updating password in the user profile
    addNotification('Password Changed', `Password for ${resetEmail} changed successfully.`);
    setResetStep(4);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0f172a 0%, #030712 100%)',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to Nexus</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI-Powered Software Onboarding Advisor</p>
        </div>

        {/* Regular Login Form */}
        {resetStep === 0 && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {errorMsg && (
              <div style={{
                background: 'var(--danger-glow)',
                border: '1px solid var(--danger)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label>ENTERPRISE EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. intern@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <label>PASSWORD</label>
                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-hover)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', marginTop: '0.5rem' }}>
              Sign In to Workspace
            </button>

            {/* Quick Login Testing Links */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase' }}>Quick Login Presets (Testing)</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('intern@company.com')}
                  style={{
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#c084fc',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'}
                >
                  <strong>Intern</strong><br/>Liam
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('senior@company.com')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'}
                >
                  <strong>Senior</strong><br/>Sophia
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@company.com')}
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    color: '#fbbf24',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)'}
                >
                  <strong>Manager</strong><br/>Marcus
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Forgot Password Flow */}
        {resetStep > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Reset Workspace Password</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step {resetStep} of 4</p>
            </div>

            {resetError && (
              <div style={{
                background: 'var(--danger-glow)',
                border: '1px solid var(--danger)',
                color: '#fca5a5',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem'
              }}>
                {resetError}
              </div>
            )}

            {/* Step 1: Email Request */}
            {resetStep === 1 && (
              <form onSubmit={handleRequestCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your registered enterprise email address. We will verify it and simulate sending a security code.</p>
                <div className="form-group">
                  <label>ACCOUNT EMAIL</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="e.g. intern@company.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setResetStep(0)} style={{ flex: 1 }}>Back to Login</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Find Account</button>
                </div>
                <div style={{ marginTop: '0.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Need assistance? Mail to <a href="mailto:support@company.com" style={{ color: 'var(--primary-hover)' }}>support@company.com</a></span>
                </div>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter the 6-digit verification code sent to your email. (Check browser prompt or notification drawer).</p>
                <div className="form-group">
                  <label>VERIFICATION CODE</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    maxLength="6"
                    placeholder="e.g. 123456"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value)}
                    style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem', fontWeight: 700 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setResetStep(1)} style={{ flex: 1 }}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Verify Code</button>
                </div>
              </form>
            )}

            {/* Step 3: Add New Password */}
            {resetStep === 3 && (
              <form onSubmit={handleSaveNewPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter a new strong password for your workspace account.</p>
                <div className="form-group">
                  <label>NEW PASSWORD</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setResetStep(2)} style={{ flex: 1 }}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Change Password</button>
                </div>
              </form>
            )}

            {/* Step 4: Success Message */}
            {resetStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle size={48} style={{ color: 'var(--success)' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Password Changed Successfully!</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your workspace credentials have been updated. You can now log in with your new password.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setResetStep(0);
                    setEmail(resetEmail);
                    setPassword('');
                  }}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
