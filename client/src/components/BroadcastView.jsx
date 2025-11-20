import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../hooks/useSocket';
import { BROADCAST_TYPES, getBroadcastConfig } from '../config/broadcastConfig';
import './BroadcastView.css';

// 渲染不同類型的廣播內容
const renderBroadcastContent = (message) => {
  const typeConfig = getBroadcastConfig(message.type);
  
  switch (message.type) {
    case 'jackpot':
      return (
        <>
          <div className="broadcast-icon">{typeConfig.icon}</div>
          <div className="broadcast-text">
            <strong>{message.data.playerName}</strong> 抽到了
            <span className="broadcast-item">{message.data.itemName}</span>
            <span className="broadcast-value">${message.data.itemPrice}</span>！
          </div>
        </>
      );
      
    case 'battle_result':
      return (
        <>
          <div className="broadcast-icon">{typeConfig.icon}</div>
          <div className="broadcast-text">
            恭喜 <strong>{message.data.winner}</strong> 在與 
            <strong>{message.data.loser}</strong> 的對戰中贏得 
            <span className="broadcast-value">${message.data.totalValue}</span>！
          </div>
        </>
      );
      
    default:
      return (
        <>
          <div className="broadcast-icon">📢</div>
          <div className="broadcast-text">{message.data.message || '系統訊息'}</div>
        </>
      );
  }
};

function BroadcastView() {
  const socket = getSocket();
  const { addJackpotMessage } = useGameStore();
  const [displayMessages, setDisplayMessages] = useState([]); // 支援多個訊息重疊顯示
  const [messageQueue, setMessageQueue] = useState([]);
  const [processTrigger, setProcessTrigger] = useState(0); // 觸發器
  const nextIdRef = useRef(0);
  const isProcessingRef = useRef(false);

  // 監聽廣播，加入佇列
  useEffect(() => {
    if (!socket) return;

    // 監聽大獎廣播
    socket.on('global-jackpot', (data) => {
      addJackpotMessage(data);
      const message = {
        id: nextIdRef.current++,
        type: 'jackpot',
        data: {
          playerName: data.playerName,
          itemName: data.itemName,
          itemPrice: data.itemPrice || 0,
          itemImage: data.itemImage
        },
        timestamp: Date.now()
      };
      setMessageQueue(prev => [...prev, message]);
    });

    // 監聽對戰結果廣播
    socket.on('global-battle-result', (data) => {
      const message = {
        id: nextIdRef.current++,
        type: 'battle_result',
        data: {
          winner: data.winner,
          loser: data.loser,
          totalValue: data.totalValue
        },
        timestamp: Date.now()
      };
      setMessageQueue(prev => [...prev, message]);
    });

    // 監聽全服訊息
    socket.on('global-message', (data) => {
      console.log('全服訊息:', data.message);
    });

    return () => {
      socket.off('global-jackpot');
      socket.off('global-battle-result');
      socket.off('global-message');
    };
  }, [socket, addJackpotMessage]);

  // 處理跑馬燈佇列
  useEffect(() => {
    if (messageQueue.length === 0 || isProcessingRef.current) return;

    isProcessingRef.current = true;
    
    const nextMessage = messageQueue[0];
    const typeConfig = getBroadcastConfig(nextMessage.type);
    
    // 從佇列中移除
    setMessageQueue(prev => prev.slice(1));
    
    // 創建帶有動畫狀態的訊息物件
    const messageWithState = {
      ...nextMessage,
      animationState: 'hidden'
    };
    
    // 添加到顯示列表
    setDisplayMessages(prev => [...prev, messageWithState]);
    
    // 等待 DOM 更新後開始進入動畫
    setTimeout(() => {
      setDisplayMessages(prev => 
        prev.map(msg => 
          msg.id === nextMessage.id 
            ? { ...msg, animationState: 'entering' } 
            : msg
        )
      );
      
      setTimeout(() => {
        // 停留顯示
        setDisplayMessages(prev => 
          prev.map(msg => 
            msg.id === nextMessage.id 
              ? { ...msg, animationState: 'display' } 
              : msg
          )
        );
        
        setTimeout(() => {
          // 開始離開動畫
          setDisplayMessages(prev => 
            prev.map(msg => 
              msg.id === nextMessage.id 
                ? { ...msg, animationState: 'leaving' } 
                : msg
            )
          );
          
          // 1秒後允許下一個訊息進入
          setTimeout(() => {
            isProcessingRef.current = false;
            setProcessTrigger(prev => prev + 1); // 觸發下一次處理
          }, 600);
          
          // 0.6秒後移除這個訊息
          setTimeout(() => {
            setDisplayMessages(prev => 
              prev.filter(msg => msg.id !== nextMessage.id)
            );
          }, 600);
          
        }, typeConfig.displayDuration);
        
      }, 500);
      
    }, 50);

  }, [messageQueue, processTrigger]);

  return (
    <div className="broadcast-marquee-container">
      {displayMessages.map((message) => (
        <div 
          key={message.id}
          className={`broadcast-marquee ${message.animationState}`}
          style={{
            color: getBroadcastConfig(message.type).textColor
          }}
        >
          <div className="broadcast-marquee-content">
            {renderBroadcastContent(message)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BroadcastView;

