import React, { useState } from 'react';

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (mode === 'register') {
        setMode('login');
        setError('Account created — please log in');
      } else {
        localStorage.setItem('fg_token', data.token);
        localStorage.setItem('fg_user', data.username);
        onLogin(data.token, data.username);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f1117'
    }}>
      <div style={{
        background: '#1a1d2e', border: '1px solid #2d3148',
        borderRadius: '16px', padding: '40px', width: '360px'
      }}>
        <h1 style={{ color: '#7c6af7', fontSize: '24px', marginBottom: '4px' }}>⚡ FlowGuard</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '32px' }}>
          Compliance-Safe Workflow Automation
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            Username
          </label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '10px 12px',
              background: '#0f1117', border: '1px solid #2d3148',
              borderRadius: '8px', color: '#e2e8f0', fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '10px 12px',
              background: '#0f1117', border: '1px solid #2d3148',
              borderRadius: '8px', color: '#e2e8f0', fontSize: '14px'
            }}
          />
        </div>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '10px', borderRadius: '8px',
            background: '#1e1b2e', border: '1px solid #7c6af7',
            color: '#a78bfa', fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: '#7c6af7', border: 'none',
            borderRadius: '8px', color: 'white',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ color: '#7c6af7', cursor: 'pointer' }}
          >
            {mode === 'login' ? 'Register' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;