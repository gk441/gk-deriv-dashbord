import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
  const [session, setSession] = useState(null);

  function handleConnect(ws, token, appId) {
    // ws is an open WebSocket connected & authorized
    setSession({ ws, token, appId });
  }

  return (
    <div className="app">
      {!session ? (
        <Login onConnect={handleConnect} />
      ) : (
        <Dashboard session={session} />
      )}
    </div>
  );
}