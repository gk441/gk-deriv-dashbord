import React, { useState, useRef, useEffect } from 'react';

export default function Login({ onConnect }) {
  const [appId, setAppId] = useState('1089');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Not connected');
  const wsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  function connect() {
    if (!token.trim()) {
      setStatus('Please paste your Deriv API token');
      return;
    }
    setStatus('Connecting...');
    try {
      const url = `wss://ws.derivws.com/websockets/v3?app_id=${encodeURIComponent(appId)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('Authorizing...');
        ws.send(JSON.stringify({ authorize: token.trim() }));
      };

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.error) {
            setStatus('Auth error: ' + (msg.error.message || JSON.stringify(msg.error)));
            ws.close();
            return;
          }
          if (msg.msg_type === 'authorize' && msg.authorize && msg.authorize.is_authenticated) {
            setStatus('Connected ✔');
            onConnect(ws, token.trim(), appId);
          }
        } catch (e) {
          console.warn('Invalid message', e);
        }
      };

      ws.onerror = () => setStatus('WebSocket error');
      ws.onclose = () => setStatus('Disconnected');
    } catch (e) {
      setStatus('Connection failed: ' + e.message);
    }
  }

  return (
    <div className="card center">
      <h2>GK — Deriv Login</h2>

      <label>App ID</label>
      <input value={appId} onChange={(e) => setAppId(e.target.value)} className="input" />

      <label>Deriv API Token (paste here)</label>
      <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={3} className="input" />

      <button className="btn" onClick={connect}>Connect</button>

      <div className="small">Status: {status}</div>
      <div className="note">Do not paste your token on public/shared devices. You can revoke tokens anytime from your Deriv account.</div>
    </div>
  );
}