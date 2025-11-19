import React, { useState, useEffect } from 'react';
import './GachaResult.css';

function GachaResult({ draws, total, showTotal = true }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTotalValue, setShowTotalValue] = useState(false);

  useEffect(() => {
    // 重置動畫
    setVisibleCount(0);
    setShowTotalValue(false);

    if (!draws || draws.length === 0) return;

    // 逐個顯示獎品
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setVisibleCount(currentIndex);

      // 全部顯示完後，顯示總價值
      if (currentIndex >= draws.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowTotalValue(true);
        }, 300);
      }
    }, 200); // 每個獎品間隔 200ms

    return () => clearInterval(interval);
  }, [draws]);

  if (!draws || draws.length === 0) {
    return <div className="gacha-result-empty">暫無結果</div>;
  }

  return (
    <div className="gacha-result">
      <div className="draws-grid">
        {draws.slice(0, visibleCount).map((item, index) => (
          <div 
            key={index} 
            className={`draw-item ${item.isJackpot ? 'jackpot' : ''} draw-item-animate`}
            style={{ animationDelay: `${index * 0.05}s` }}
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
      
      {showTotal && showTotalValue && (
        <div className="result-total result-total-animate">
          <span>總價值：</span>
          <strong>${total}</strong>
        </div>
      )}
    </div>
  );
}

export default GachaResult;

