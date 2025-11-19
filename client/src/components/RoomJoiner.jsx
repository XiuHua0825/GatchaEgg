import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import './RoomJoiner.css';

function RoomJoiner({ onBack }) {
  const socket = getSocket();
  const { playerName } = useGameStore();
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    const trimmedRoomId = roomId.trim().toUpperCase();
    
    if (!trimmedRoomId) {
      alert('請輸入房間號');
      return;
    }

    if (trimmedRoomId.length !== 6) {
      alert('房間號應為 6 碼');
      return;
    }

    setIsJoining(true);

    socket.emit('join-room', {
      roomId: trimmedRoomId,
      playerName
    });

    // 設定超時處理
    setTimeout(() => {
      setIsJoining(false);
    }, 3000);
  };

  return (
    <div className="room-joiner">
      <h2>🚪 加入對戰房間</h2>

      <div className="joiner-form">
        <div className="input-group">
          <label>房間號</label>
          <input
            type="text"
            className="input room-id-input"
            placeholder="請輸入 6 碼房間號"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={isJoining}
          />
          <div className="input-hint">
            房間號由房主提供（6 位英數字）
          </div>
        </div>

        <div className="joiner-actions">
          <button
            className="btn btn-success"
            onClick={handleJoin}
            disabled={isJoining || roomId.trim().length !== 6}
          >
            {isJoining ? '加入中...' : '加入房間'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBack}
            disabled={isJoining}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomJoiner;

