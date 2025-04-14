const games = require('../games');

module.exports = async (req, res) => {
  const { gameId } = req.query;

  if (!games[gameId] || games[gameId].players.length >= 2) {
    return res.status(400).json({ error: 'Game is full or does not exist' });
  }

  games[gameId].players.push('player2');
  res.status(200).json({ success: true });
};