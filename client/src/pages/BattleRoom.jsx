import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import RoomCreator from '../components/RoomCreator';
import RoomJoiner from '../components/RoomJoiner';
import Countdown from '../components/Countdown';
import GachaResult from '../components/GachaResult';
import './BattleRoom.css';

function BattleRoom() {
  const navigate = useNavigate();
  const socket = getSocket();
  const { playerName, eggs, currentRoom, setCurrentRoom, battleResult, setBattleResult, reset } = useGameStore();

  const [mode, setMode] = useState(null); // 'create' | 'join' | null
  const [roomState, setRoomState] = useState('idle'); // idle, waiting, countdown, playing, finished
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!playerName) {
      navigate('/');
      return;
    }

    if (!socket) return;

    // 監聽房間建立成功
    socket.on('room-created', (data) => {
      setCurrentRoom(data.room);
      setRoomState('waiting');
    });

    // 監聽玩家加入房間
    socket.on('room-joined', (data) => {
      setCurrentRoom(data.room);
      if (data.room.player1 && data.room.player2) {
        setRoomState('ready');
      }
    });

    // 監聽倒數開始
    socket.on('start-countdown', (data) => {
      setRoomState('countdown');
      setCountdown(data.countdown);
    });

    // 監聽對戰開始
    socket.on('battle-start', () => {
      setRoomState('playing');
    });

    // 監聽對戰結果
    socket.on('battle-result', (data) => {
      setBattleResult(data);
      setRoomState('finished');
    });

    // 監聽房間錯誤
    socket.on('room-error', (data) => {
      alert('錯誤: ' + data.message);
    });

    // 監聽房間關閉
    socket.on('room-closed', (data) => {
      alert(data.message);
      handleLeaveRoom();
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('start-countdown');
      socket.off('battle-start');
      socket.off('battle-result');
      socket.off('room-error');
      socket.off('room-closed');
    };
  }, [socket, playerName, navigate]);

  const handleLeaveRoom = () => {
    reset();
    setMode(null);
    setRoomState('idle');
    setCountdown(0);
  };

  const handleBackToHome = () => {
    handleLeaveRoom();
    navigate('/');
  };

  const renderContent = () => {
    // 選擇模式
    if (!mode) {
      return (
        <div className="mode-selection-battle">
          <h2>選擇對戰方式</h2>
          <div className="battle-mode-buttons">
            <button 
              className="btn btn-primary battle-mode-btn"
              onClick={() => setMode('create')}
            >
              <div className="icon">🏠</div>
              <div>建立房間</div>
            </button>
            <button 
              className="btn btn-success battle-mode-btn"
              onClick={() => setMode('join')}
            >
              <div className="icon">🚪</div>
              <div>加入房間</div>
            </button>
          </div>
        </div>
      );
    }

    // 建立房間
    if (mode === 'create' && roomState === 'idle') {
      return <RoomCreator onBack={() => setMode(null)} />;
    }

    // 加入房間
    if (mode === 'join' && roomState === 'idle') {
      return <RoomJoiner onBack={() => setMode(null)} />;
    }

    // 等待對手
    if (roomState === 'waiting') {
      return (
        <div className="room-waiting">
          <h2>⏳ 等待對手加入...</h2>
          <div className="room-info-display">
            <div className="room-id-display">
              <span>房間號：</span>
              <strong>{currentRoom?.id}</strong>
              <button
                className="btn btn-secondary btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(currentRoom?.id);
                  alert('房間號已複製');
                }}
              >
                📋 複製
              </button>
            </div>
            <div className="room-settings">
              <p>扭蛋類型：{eggs.find(e => e.id === currentRoom?.eggType)?.name}</p>
              <p>抽取數量：{currentRoom?.drawCount} 抽</p>
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleLeaveRoom}>
            取消房間
          </button>
        </div>
      );
    }

    // 倒數中
    if (roomState === 'countdown') {
      return (
        <div className="room-countdown">
          <h2>⚔️ 對戰即將開始！</h2>
          <div className="players-display">
            <div className="player-card">
              <div className="player-name">{currentRoom?.player1?.name}</div>
              <div className="player-label">玩家 1</div>
            </div>
            <div className="vs">VS</div>
            <div className="player-card">
              <div className="player-name">{currentRoom?.player2?.name}</div>
              <div className="player-label">玩家 2</div>
            </div>
          </div>
          <Countdown seconds={countdown} large />
        </div>
      );
    }

    // 對戰中
    if (roomState === 'playing') {
      return (
        <div className="room-playing">
          <h2>🎲 抽蛋中...</h2>
          <div className="loading-animation">
            <div className="spinner"></div>
            <p>雙方正在抽取扭蛋</p>
          </div>
        </div>
      );
    }

    // 對戰結束
    if (roomState === 'finished' && battleResult) {
      const isPlayer1 = socket?.id === currentRoom?.player1?.socketId;
      const myResult = isPlayer1 ? battleResult.player1 : battleResult.player2;
      const opponentResult = isPlayer1 ? battleResult.player2 : battleResult.player1;
      const iWon = (battleResult.winner === 'player1' && isPlayer1) || 
                   (battleResult.winner === 'player2' && !isPlayer1);
      const isDraw = battleResult.winner === 'draw';

      return (
        <div className="room-finished">
          <div className="battle-result-header">
            {isDraw ? (
              <h2 className="result-draw">🤝 平手！</h2>
            ) : iWon ? (
              <h2 className="result-win">🎉 你贏了！</h2>
            ) : (
              <h2 className="result-lose">😢 你輸了</h2>
            )}
          </div>

          <div className="battle-results-grid">
            <div className={`result-column ${iWon && !isDraw ? 'winner' : ''}`}>
              <h3>{myResult.name} {iWon && !isDraw && '👑'}</h3>
              <GachaResult draws={myResult.draws} total={myResult.total} />
            </div>

            <div className={`result-column ${!iWon && !isDraw ? 'winner' : ''}`}>
              <h3>{opponentResult.name} {!iWon && !isDraw && '👑'}</h3>
              <GachaResult draws={opponentResult.draws} total={opponentResult.total} />
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={handleLeaveRoom}>
              再來一局
            </button>
            <button className="btn btn-secondary" onClick={handleBackToHome}>
              返回首頁
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="battle-room-page">
      <div className="container">
        <div className="header">
          {roomState === 'idle' && (
            <button className="btn btn-secondary" onClick={handleBackToHome}>
              ← 返回首頁
            </button>
          )}
          <h1>⚔️ 對戰模式</h1>
          <div className="player-info">玩家：{playerName}</div>
        </div>

        <div className="battle-content card">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default BattleRoom;

