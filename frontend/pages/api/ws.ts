import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

interface SocketIOResponse extends NextApiResponse {
  socket: any;
}

const ioHandler = (req: NextApiRequest, res: SocketIOResponse) => {
  if (!res.socket.server.io) {
    console.log('Initializing socket.io server...');
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  if (!['POST', 'GET'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed. Only POST and GET are supported.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'WebSocket endpoint is running' });
  }

  const { message, progress } = req.body;
  console.log('[API] Received webhook:', { message, progress });

  try {
    if (res.socket?.server?.io) {
      console.log('[API] Broadcasting to socket clients...');
      res.socket.server.io.emit('ws', { message, progress });
      console.log('[API] Broadcast complete');
    } else {
      console.warn('[API] Socket.io not initialized');
    }
  } catch (error) {
    console.error('[API] Socket emit error:', error);
  }

  res.status(200).json({ success: true, received: { message, progress } });
};

export default ioHandler;
