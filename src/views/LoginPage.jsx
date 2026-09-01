import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ShieldCheck, Zap, Database, Mail, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { signIn, signUp } from '../lib/auth-client';

const FEATURES = [
  {
    icon: <Lock size={14} />,
    label: 'Encryption-Based Saving',
    detail: 'Fully encrypted, zero-knowledge privacy & trusted storage',
    highlight: '#60A5FA',
  },
  {
    icon: <Zap size={14} />,
    label: 'Keystroke-First Capture',
    detail: 'Links, notes & tasks saved in 2 keystrokes',
    highlight: '#34D399',
  },
  {
    icon: <ShieldCheck size={14} />,
    label: 'Neon DB & Trusted Auth',
    detail: 'SSL encrypted sync with Google OAuth & Better Auth',
    highlight: '#A78BFA',
  },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showEmailAuth, setShowEmailAuth] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const callbackURL = typeof window !== 'undefined' ? `${window.location.origin}/app` : '/app';
      await signIn.social({
        provider: 'google',
        callbackURL,
      });
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: err } = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
        });
        if (err) throw new Error(err.message || 'Sign up failed');
      } else {
        const { error: err } = await signIn.email({ email, password });
        if (err) throw new Error(err.message || 'Sign in failed');
      }
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    height: '46px',
    fontSize: '15px',
    border: `1.5px solid ${focusedField === field ? 'var(--primary)' : 'var(--border)'}`,
    outline: 'none',
    padding: '0 14px',
    background: focusedField === field ? '#F8FBFF' : '#fff',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(5,98,239,0.1)' : 'none',
    borderRadius: 0,
  });

  const labelHighlight = (field) => ({
    display: 'block',
    marginBottom: '7px',
    letterSpacing: '0.07em',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    color: focusedField === field ? 'var(--primary)' : 'var(--text-muted)',
    transition: 'color 0.15s',
  });

  return (
    <div
      className="mobile-flex-col"
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg)',
        fontFamily: 'var(--font-sans)',
        overflowY: 'auto',
      }}
    >
      {/* ── Left — Brand Panel ─────────────────────────────── */}
      <div
        className="mobile-p-4"
        style={{
          flex: '0 0 42%',
          background: 'var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Re
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', color: '#fff' }}>
            Remor
          </span>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '52px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            Your personal<br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              memory
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255,255,255,0.35)',
                }}
              />
            </span>
            {' '}layer.
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.65,
              maxWidth: '320px',
              marginBottom: '36px',
            }}
          >
            Capture links, notes, and tasks. Rediscover them when it matters most.
          </p>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderLeft: `3px solid ${f.highlight}`,
                }}
              >
                <span style={{ color: f.highlight, display: 'flex', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '1px' }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
                    {f.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.08em',
          }}
        >
          BACKED BY NEON POSTGRESQL · GOOGLE OAUTH
        </div>
      </div>

      {/* ── Right — Form Panel ─────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mode badge */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                background: 'var(--primary-subtle)',
                border: '1px solid var(--primary-subtle-hover)',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--primary)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span className="font-mono font-600 text-blue" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                AUTHENTICATION
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '34px',
                fontWeight: 700,
                letterSpacing: '-1px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                lineHeight: 1.1,
              }}
            >
              Welcome to{' '}
              <span
                style={{
                  background: 'var(--primary-subtle)',
                  borderBottom: '2px solid var(--primary)',
                  padding: '0 6px 1px',
                  color: 'var(--primary)',
                }}
              >
                Remor
              </span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Sign in with your Google account to access your workspace.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px 14px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderLeft: '3px solid #DC2626',
                color: '#DC2626',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontWeight: 700 }}>!</span> {error}
            </div>
          )}

          {/* ── Main Action: Primary Google Sign-In Button ───────────────── */}
          <button
            id="google-auth-submit"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              width: '100%',
              height: '52px',
              fontSize: '15px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: '#FFFFFF',
              color: '#1F2937',
              border: '2px solid #E5E7EB',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.01em',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.borderColor = '#4285F4';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(66,133,244,0.15)';
                e.currentTarget.style.background = '#F8FAFC';
              }
            }}
            onMouseLeave={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)';
                e.currentTarget.style.background = '#FFFFFF';
              }
            }}
          >
            {googleLoading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Connecting to Google...
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
                <ArrowRight size={16} style={{ color: '#9CA3AF', marginLeft: 'auto' }} />
              </>
            )}
          </button>

          {/* ── Secondary Option: Email / Password Collapsible ────────── */}
          <div style={{ margin: '28px 0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                OR USE EMAIL
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEmailAuth(!showEmailAuth)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: showEmailAuth ? 'var(--primary-subtle)' : '#fff',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: showEmailAuth ? '18px' : '0',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} color="var(--primary)" />
              <span>{mode === 'signup' ? 'Sign up with Email' : 'Sign in with Email'}</span>
            </div>
            {showEmailAuth ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showEmailAuth && (
            <div style={{ background: '#FAFBFD', border: '1px solid var(--border)', padding: '20px', marginBottom: '20px' }}>
              {/* Mode Toggle Header */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    background: mode === 'signin' ? 'var(--primary)' : 'transparent',
                    color: mode === 'signin' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                    color: mode === 'signup' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mode === 'signup' && (
                  <div>
                    <label style={labelHighlight('name')}>NAME</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle('name')}
                    />
                  </div>
                )}

                <div>
                  <label style={labelHighlight('email')}>EMAIL</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={inputStyle('email')}
                  />
                </div>

                <div>
                  <label style={labelHighlight('password')}>PASSWORD</label>
                  <input
                    id="password"
                    type="password"
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={8}
                    style={inputStyle('password')}
                  />
                </div>

                <button
                  id="auth-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    height: '44px',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: loading ? 'var(--primary-subtle-hover)' : 'var(--primary)',
                    color: loading ? 'var(--primary)' : '#fff',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'background 0.15s',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signup' ? 'Create account' : 'Sign in with email'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer note */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            Your data is stored securely in Neon PostgreSQL.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
