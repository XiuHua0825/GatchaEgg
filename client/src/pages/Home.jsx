import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useSocket } from '../hooks/useSocket';
import PoolViewer from '../components/PoolViewer';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { playerName, setPlayerName, setGameMode } = useGameStore();
  const [name, setName] = useState(playerName || '');
  const [eggs, setEggs] = useState([]);

  useEffect(() => {
    // 取得蛋的資料
    const apiUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/api/eggs`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEggs(data.data);
          useGameStore.getState().setEggs(data.data);
        }
      })
      .catch(err => console.error('取得蛋資料失敗:', err));
  }, []);

  const handleStartSingle = () => {
    if (!name.trim()) {
      alert('請輸入玩家名稱');
      return;
    }
    if (!isConnected) {
      alert('伺服器連線中，請稍候...');
      return;
    }
    setPlayerName(name.trim());
    setGameMode('single');
    navigate('/single');
  };

  const handleStartBattle = () => {
    if (!name.trim()) {
      alert('請輸入玩家名稱');
      return;
    }
    if (!isConnected) {
      alert('伺服器連線中，請稍候...');
      return;
    }
    setPlayerName(name.trim());
    setGameMode('battle');
    navigate('/battle');
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="home-card card">
          <h1 className="home-title">🎰 多人抽蛋對戰遊戲</h1>
          
          <div className="connection-status">
            {isConnected ? (
              <span className="status-connected">✅ 已連線</span>
            ) : (
              <span className="status-disconnected">⏳ 連線中...</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="playerName">玩家名稱</label>
            <input
              id="playerName"
              type="text"
              className="input"
              placeholder="請輸入你的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="mode-selection">
            <h2>選擇遊戲模式</h2>
            
            <div className="mode-buttons">
              <button 
                className="mode-btn btn btn-primary"
                onClick={handleStartSingle}
                disabled={!isConnected}
              >
                <div className="mode-icon">🎲</div>
                <div className="mode-title">單人抽蛋</div>
                <div className="mode-desc">自由抽蛋，累積紀錄</div>
              </button>

              <button 
                className="mode-btn btn btn-success"
                onClick={handleStartBattle}
                disabled={!isConnected}
              >
                <div className="mode-icon">⚔️</div>
                <div className="mode-title">對戰模式</div>
                <div className="mode-desc">雙人對決，比拼價值</div>
              </button>
            </div>
          </div>

          {eggs.length > 0 && (
            <div className="egg-preview">
              <h3>可用扭蛋</h3>
              <div className="egg-list">
                {eggs.map(egg => (
                  <div key={egg.id} className="egg-item">
                    <span className="egg-name">{egg.name}</span>
                    <span className="egg-price">${egg.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {eggs.length > 0 && (
            <PoolViewer eggs={eggs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

