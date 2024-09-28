
import { Server } from 'socket.io';

let drsTime = 15;
let interval;
let isTimerRunning = false;

const startTimer = (io) => {
  if (isTimerRunning) return;  
  clearInterval(interval);
  drsTime = 15;
  isTimerRunning = true;  

  interval = setInterval(() => {
    if (drsTime > 0) {
      drsTime--;
    } else {
      drsTime = 0;
      isTimerRunning = false;
      clearInterval(interval);
    }
    io.emit('timerUpdate', drsTime);
  }, 1000);
};

export default function socketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected');

      startTimer(io);
      socket.emit('timerUpdate', drsTime);

      socket.on('startTimer', () => {
        startTimer(io);
      });

      socket.on('resetTimer', () => {
        startTimer(io);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
  res.end();
}
