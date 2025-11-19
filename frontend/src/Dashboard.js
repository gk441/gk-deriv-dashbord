import React, { useState } from 'react';

export default function Dashboard({ session }) {
  const { ws } = session;
  const [amount, setAmount] = useState(1);
  const [contractType, setContractType] = useState('CALL');
  const [status, setStatus] = useState('Idle');

  function trade() {
    setStatus('Requesting proposal...');
    // For many Deriv flows you request a proposal then buy; here we send a simple buy request.
    // NOTE: some Deriv accounts require correct contract params; test on demo.
    const buyPayload = {
      buy: 1,
      price: amount,
      parameters: {
        amount: Number(amount),
        basis: 'stake',
        contract_type: contractType,
        symbol: 'R_100',
        duration: 1,
        duration_unit: 't',
      },
    };

    try {
      ws.send(JSON.stringify(buyPayload));
      setStatus('Sent buy — waiting reply...');
      // listen once for a buy response
      const handler = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.msg_type === 'buy' || msg.buy) {
            setStatus('Trade response received');
          } else if (msg.error) {
            setStatus('Error: ' + (msg.error.message || JSON.stringify(msg.error)));
          }
        } catch (e) {
          console.warn(e);
        }
      };
      ws.addEventListener('message', handler, { once: true });
    } catch (e) {
      setStatus('Send failed: ' + e.message);
    }
  }

  return (
    <div className="card center">
      <h2>GK — Dashboard</h2>

      <label>Amount (stake)</label>
      <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

      <label>Contract Type</label>
      <select className="input" value={contractType} onChange={(e) => setContractType(e.target.value)}>
        <option value="CALL">Rise (CALL)</option>
        <option value="PUT">Fall (PUT)</option>
        <option value="DIGITODD">Odd</option>
        <option value="DIGITEVEN">Even</option>
        <option value="DIGITMATCH">Matches</option>
        <option value="DIGITDIFF">Differs</option>
        <option value="DIGITOVER">Over</option>
        <option value="DIGITUNDER">Under</option>
      </select>

      <button className="btn" onClick={trade}>Trade</button>

      <div className="small">Status: {status}</div>
      <div className="note">Test on a Deriv demo account first.</div>
    </div>
  );
}