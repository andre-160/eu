const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Chess = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let games = {};

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substr(2, 9);
    const chess = new Chess();
    games[gameId] = { players: [socket.id], chess };
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId) => {
    if (games[gameId] && games[gameId].players.length < 2) {
      games[gameId].players.push(socket.id);
      socket.join(gameId);
      io.to(gameId).emit('updateBoard', games[gameId].chess.fen());
    } else {
      socket.emit('error', 'Game is full or does not exist');
    }
  });

  socket.on('move', ({ from, to }) => {
    const gameId = Object.keys(games).find((id) => games[id].players.includes(socket.id));
    if (!gameId) return;

    const game = games[gameId].chess;
    try {
      const move = game.move({ from, to });
      io.to(gameId).emit('updateBoard', game.fen());
      io.to(gameId).emit('moveHistory', game.history());
      if (game.game_over()) {
        io.to(gameId).emit('gameOver', game.in_checkmate() ? 'Checkmate!' : 'Draw!');
      }
    } catch (e) {
      socket.emit('error', 'Invalid move');
    }
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});