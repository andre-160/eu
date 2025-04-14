const Chess = require('chess.js');

const games = {};

module.exports = async (req, res) => {
  const gameId = Math.random().toString(36).substr(2, 9);
  games[gameId] = { chess: new Chess(), players: [] };
  res.status(200).json({ gameId });
};