import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import GachaResult from '../components/GachaResult';
import Countdown from '../components/Countdown';
import './SinglePlay.css';

function SinglePlay() {
  const navigate = useNavigate();
  const socket = getSocket();
  const { 
    playerName, 
    eggs, 
    drawHistory, 
    addDrawHistory,
    isOnCooldown,
    cooldownRemaining,
    setIsOnCooldown,
    setCooldownRemaining
  } = useGameStore();

  const [selectedEgg, setSelectedEgg] = useState('');
  const [drawCount, setDrawCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [pendingRecord, setPendingRecord] = useState(null);

  useEffect(() => {
    if (!playerName) {
      navigate('/');
      return;
    }

    if (!socket) return;

    // 監聽抽卡結果
    socket.on('single-result', (data) => {
      setIsDrawing(false);
      setLastResult(data);
      // 延後加入歷史，等待結果顯示動畫完成
      setPendingRecord({
        eggType: selectedEgg,
        draws: data.draws,
        total: data.total
      });

      // 檢查冷卻狀態
      if (data.isOnCooldown) {
        setIsOnCooldown(true);
        setCooldownRemaining(data.cooldownTime);
        startCooldownTimer(data.cooldownTime);
      }
    });

    // 監聽冷卻通知
    socket.on('single-cooldown', (data) => {
      setIsDrawing(false);
      alert(data.message);
      
      if (data.remainingTime) {
        setIsOnCooldown(true);
        setCooldownRemaining(data.remainingTime);
        startCooldownTimer(data.remainingTime);
      }
    });

    // 監聽錯誤
    socket.on('single-error', (data) => {
      setIsDrawing(false);
      alert('錯誤: ' + data.message);
    });

    // 查詢冷卻狀態
    socket.emit('check-cooldown');
    socket.on('cooldown-status', (data) => {
      if (data.isOnCooldown) {
        setIsOnCooldown(true);
        setCooldownRemaining(data.remainingTime);
        startCooldownTimer(data.remainingTime);
      }
    });

    return () => {
      socket.off('single-result');
      socket.off('single-cooldown');
      socket.off('single-error');
      socket.off('cooldown-status');
    };
  }, [socket, playerName, navigate]);

  const startCooldownTimer = (seconds) => {
    let remaining = seconds;
    const timer = setInterval(() => {
      remaining--;
      setCooldownRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        setIsOnCooldown(false);
        setCooldownRemaining(0);
      }
    }, 1000);
  };

  const handleDraw = () => {
    if (!selectedEgg) {
      alert('請選擇扭蛋類型');
      return;
    }

    if (isOnCooldown) {
      alert(`冷卻中，請等待 ${cooldownRemaining} 秒`);
      return;
    }

    setIsDrawing(true);
    setLastResult(null);

    socket.emit('single-draw', {
      playerName,
      eggType: selectedEgg,
      drawCount: parseInt(drawCount)
    });
  };

  const calculateHistoryTotal = () => {
    return drawHistory.reduce((sum, record) => sum + record.total, 0);
  };

  return (
    <div className="single-play-page">
      <div className="container">
        <div className="header">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← 返回首頁
          </button>
          <h1>🎲 單人抽蛋模式</h1>
          <div className="player-info">玩家：{playerName}</div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            <div className="card control-panel">
              <h2>抽蛋控制</h2>
              
              {isOnCooldown && (
                <div className="cooldown-notice">
                  <h3>⏰ 你抽太多了！</h3>
                  <Countdown seconds={cooldownRemaining} />
                </div>
              )}

              <div className="input-group">
                <label>選擇扭蛋</label>
                <select
                  className="input"
                  value={selectedEgg}
                  onChange={(e) => setSelectedEgg(e.target.value)}
                  disabled={isDrawing || isOnCooldown}
                >
                  <option value="">請選擇...</option>
                  {eggs.map(egg => (
                    <option key={egg.id} value={egg.id}>
                      {egg.name} - ${egg.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>抽取數量</label>
                <select
                  className="input"
                  value={drawCount}
                  onChange={(e) => setDrawCount(e.target.value)}
                  disabled={isDrawing || isOnCooldown}
                >
                  <option value="1">1 抽</option>
                  <option value="5">5 抽</option>
                  <option value="10">10 抽</option>
                </select>
              </div>

              <button
                className="btn btn-primary btn-draw"
                onClick={handleDraw}
                disabled={isDrawing || isOnCooldown || !selectedEgg}
              >
                {isDrawing ? '抽取中...' : isOnCooldown ? `冷卻中 (${cooldownRemaining}s)` : '開始抽蛋'}
              </button>
            </div>

            {lastResult && (
              <div className="card result-panel">
                <h2>本次結果</h2>
                    <GachaResult
                      draws={lastResult.draws}
                      total={lastResult.total}
                      onFinish={() => {
                        if (pendingRecord) {
                          addDrawHistory(pendingRecord);
                          setPendingRecord(null);
                        }
                      }}
                    />
              </div>
            )}
          </div>

          <div className="right-panel">
            <div className="card history-panel">
              <h2>抽蛋紀錄</h2>
              <div className="history-summary">
                <div className="summary-item">
                  <span>總抽數：</span>
                  <strong>{drawHistory.reduce((sum, r) => sum + r.draws.length, 0)}</strong>
                </div>
                <div className="summary-item">
                  <span>總價值：</span>
                  <strong>${calculateHistoryTotal()}</strong>
                </div>
              </div>

              <div className="history-list">
                {drawHistory.length === 0 ? (
                  <p className="empty-text">尚無抽卡紀錄</p>
                ) : (
                  drawHistory.slice().reverse().map((record, index) => (
                    <div key={index} className="history-item">
                      <div className="history-header">
                        <span className="history-egg">
                          {eggs.find(e => e.id === record.eggType)?.name || record.eggType}
                        </span>
                        <span className="history-total">${record.total}</span>
                      </div>
                      <div className="history-items">
                        {record.draws.map((item, i) => (
                          <span 
                            key={i} 
                            className={`history-item-badge ${item.isJackpot ? 'jackpot' : ''}`}
                          >
                            {item.name} (${item.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePlay;

