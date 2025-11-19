import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import './BroadcastView.css';

function BroadcastView() {
  const socket = getSocket();
  const { jackpotMessages, addJackpotMessage } = useGameStore();
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // 監聽大獎廣播
    socket.on('global-jackpot', (data) => {
      addJackpotMessage(data);
      setCurrentMessage(data);

      // 5 秒後隱藏
      setTimeout(() => {
        setCurrentMessage(null);
      }, 5000);
    });

    // 監聽全服訊息
    socket.on('global-message', (data) => {
      console.log('全服訊息:', data.message);
    });

    return () => {
      socket.off('global-jackpot');
      socket.off('global-message');
    };
  }, [socket]);

  if (!currentMessage) return null;

  return (
    <div className="broadcast-view">
      <div className="broadcast-content">
        <div className="broadcast-icon">🎉</div>
        <div className="broadcast-text">
          <strong>{currentMessage.playerName}</strong> 抽到了
          <span className="broadcast-item">{currentMessage.itemName}</span>！
        </div>
      </div>
    </div>
  );
}

export default BroadcastView;

