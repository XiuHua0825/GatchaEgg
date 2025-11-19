import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import './RoomCreator.css';

function RoomCreator({ onBack }) {
  const socket = getSocket();
  const { playerName, eggs } = useGameStore();
  const [eggType, setEggType] = useState('');
  const [drawCount, setDrawCount] = useState(5);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (!eggType) {
      alert('請選擇扭蛋類型');
      return;
    }

    setIsCreating(true);

    socket.emit('create-room', {
      playerName,
      eggType,
      drawCount: parseInt(drawCount)
    });
  };

  return (
    <div className="room-creator">
      <h2>🏠 建立對戰房間</h2>

      <div className="creator-form">
        <div className="input-group">
          <label>選擇扭蛋類型</label>
          <select
            className="input"
            value={eggType}
            onChange={(e) => setEggType(e.target.value)}
            disabled={isCreating}
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
            disabled={isCreating}
          >
            <option value="3">3 抽</option>
            <option value="5">5 抽</option>
            <option value="10">10 抽</option>
          </select>
        </div>

        <div className="creator-actions">
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={isCreating || !eggType}
          >
            {isCreating ? '建立中...' : '建立房間'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBack}
            disabled={isCreating}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCreator;

