import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://your-backend-url.vercel.app'); // Substitua pela URL do backend

function ChessGame() {
  const [board, setBoard] = useState([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);
  const [gameId, setGameId] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const createGame = async () => {
    const response = await fetch('/api/createGame', { method: 'POST' });
    const data = await response.json();
    setGameId(data.gameId);
    setMessage('Game created! Share this ID with your opponent.');
  };

  const joinGame = async () => {
    const response = await fetch(`/api/joinGame?gameId=${gameId}`, { method: 'POST' });
    const data = await response.json();
    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage('Joined game successfully!');
    }
  };

  const handleMove = async (from, to) => {
    const response = await fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, from, to }),
    });
    const data = await response.json();
    if (data.error) {
      setMessage(data.error);
    } else {
      setBoard(data.board);
      setHistory(data.history);
      if (data.gameOver) {
        setMessage(data.gameOver);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Chess Online</h1>
      <button onClick={createGame}>Create Game</button>
      <div>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <button onClick={joinGame}>Join Game</button>
      </div>
      <p>{message}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 50px)', gap: '1px', margin: '20px auto' }}>
        {board.flat().map((piece, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: (Math.floor(index / 8) + index) % 2 === 0 ? '#f0d9b5' : '#b58863',
              textAlign: 'center',
              lineHeight: '50px',
              fontSize: '24px',
              cursor: piece ? 'pointer' : 'default',
            }}
            onClick={() => piece && handleMove(Math.floor(index / 8), index % 8)}
          >
            {piece}
          </div>
        ))}
      </div>
      <h3>Move History</h3>
      <ul>
        {history.map((move, idx) => (
          <li key={idx}>{move}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChessGame;