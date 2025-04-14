const games = require('../games');

module.exports = async (req, res) => {
  const { gameId, from, to } = req.body;

  if (!games[gameId]) {
    return res.status(400).json({ error: 'Game does not exist' });
  }

  const game = games[gameId].chess;
  try {
    const move = game.move({ from, to });
    if (!move) {
      return res.status(400).json({ error: 'Invalid move' });
    }

    const board = game.board().map((row) => row.map((cell) => (cell ? cell.type.toUpperCase() : '')));
    const history = game.history();

    if (game.game_over()) {
      return res.status(200).json({
        board,
        history,
        gameOver: game.in_checkmate() ? 'Checkmate!' : 'Draw!',
      });
    }

    res.status(200).json({ board, history });
  } catch (e) {
    res.status(400).json({ error: 'Invalid move' });
  }
};