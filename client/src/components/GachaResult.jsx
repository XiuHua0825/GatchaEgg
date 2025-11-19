import React from 'react';
import './GachaResult.css';

function GachaResult({ draws, total, showTotal = true }) {
  if (!draws || draws.length === 0) {
    return <div className="gacha-result-empty">暫無結果</div>;
  }

  return (
    <div className="gacha-result">
      <div className="draws-grid">
        {draws.map((item, index) => (
          <div 
            key={index} 
            className={`draw-item ${item.isJackpot ? 'jackpot' : ''}`}
          >
            <div className="draw-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="draw-placeholder">🎁</div>
              )}
            </div>
            <div className="draw-name">{item.name}</div>
            <div className="draw-price">${item.price}</div>
            {item.isJackpot && (
              <div className="jackpot-badge">🌟 大獎</div>
            )}
          </div>
        ))}
      </div>
      
      {showTotal && (
        <div className="result-total">
          <span>總價值：</span>
          <strong>${total}</strong>
        </div>
      )}
    </div>
  );
}

export default GachaResult;

