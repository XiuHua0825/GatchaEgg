/**
 * 處理全服廣播事件
 */
export function handleBroadcastEvents(socket, io) {
  
  // 發送全服訊息（管理員功能）
  socket.on('send-global-message', (data) => {
    const { message, type } = data;
    
    io.emit('global-message', {
      message,
      type: type || 'info',
      timestamp: Date.now()
    });

    console.log(`全服廣播: ${message}`);
  });

  // 客戶端請求當前在線人數
  socket.on('request-online-count', () => {
    const count = io.engine.clientsCount;
    socket.emit('online-count', { count });
  });
}

