import React, { useState, useEffect } from 'react';
import './PoolViewer.css';

function PoolViewer({ eggs }) {
  const [selectedEgg, setSelectedEgg] = useState(null);
  const [poolData, setPoolData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedEgg && isOpen) {
      fetchPoolData(selectedEgg);
    }
  }, [selectedEgg, isOpen]);

  const fetchPoolData = async (eggId) => {
    try {
      const apiUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/pool/${eggId}`);
      const data = await response.json();
      if (data.success) {
        setPoolData(data.data);
      }
    } catch (error) {
      console.error('獲取獎池資料失敗:', error);
    }
  };

  const handleOpenPool = (egg) => {
    setSelectedEgg(egg.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPoolData(null);
  };

  const sortItemsByProb = (items) => {
    if (!items) return [];
    // 按機率由高到低排序
    return [...items].sort((a, b) => b.prob - a.prob);
  };

  if (!eggs || eggs.length === 0) return null;

  return (
    <div className="pool-viewer">
      <h3 className="pool-viewer-title">📊 查看獎池</h3>
      <div className="egg-selector">
        {eggs.map(egg => (
          <button
            key={egg.id}
            className="egg-select-btn"
            onClick={() => handleOpenPool(egg)}
          >
            {egg.name}
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="pool-modal-overlay" onClick={handleClose}>
          <div className="pool-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pool-modal-header">
              <h2>
                {eggs.find(e => e.id === selectedEgg)?.name || '獎池'}
              </h2>
              <button className="pool-close-btn" onClick={handleClose}>✕</button>
            </div>

            <div className="pool-modal-content">
              {poolData ? (
                <div className="items-list">
                  {sortItemsByProb(poolData).map((item, index) => (
                    <div key={index} className="pool-item">
                      <div className="pool-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="pool-item-placeholder">🎁</div>
                        )}
                      </div>
                      
                      <div className="pool-item-name">{item.name}</div>
                      
                      <div className="pool-item-value">
                        💰 ${item.price}
                      </div>
                      
                      <div className="pool-item-prob">
                        📊 {(item.prob * 100).toFixed(2)}%
                      </div>

                      {item.isJackpot && (
                        <div className="jackpot-indicator">大獎</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pool-loading">載入中...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoolViewer;

