import React from 'react';
import './Countdown.css';

function Countdown({ seconds, large = false }) {
  return (
    <div className={`countdown ${large ? 'countdown-large' : ''}`}>
      <div className="countdown-number">{seconds}</div>
      {large && <div className="countdown-label">秒後開始</div>}
    </div>
  );
}

export default Countdown;

