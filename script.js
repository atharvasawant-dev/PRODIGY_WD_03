let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let score = { X: 0, O: 0, Tie: 0 };

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const turnElement = document.getElementById('turn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreTie = document.getElementById('scoreTie');
const modeSelect = document.getElementById('mode');
const difficultySelect = document.getElementById('difficulty');

document.querySelectorAll('.board div').forEach((cell, i) => {
  cell.addEventListener('click', () => {
    if (board[i] !== '' || isGameOver) return;
    if (modeSelect.value === 'ai' && currentPlayer === 'O') return;

    board[i] = currentPlayer;
    renderBoard();
    if (checkWinner()) {
      messageElement.textContent = `${currentPlayer} Wins!`;
      score[currentPlayer]++;
      updateScores();
      isGameOver = true;
    } else if (!board.includes('')) {
      messageElement.textContent = `It's a Tie!`;
      score.Tie++;
      updateScores();
      isGameOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      turnElement.textContent = `${currentPlayer} TURN`;

      if (modeSelect.value === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 400);
      }
    }
  });
});

function aiMove() {
  let empty = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  let move;

  const difficulty = difficultySelect.value;
  if (difficulty === 'easy') {
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (difficulty === 'medium') {
    move = findWinningMove('O') || findWinningMove('X') || empty[Math.floor(Math.random() * empty.length)];
  } else {
    move = findWinningMove('O') || findWinningMove('X') || empty[0];
  }

  if (move !== undefined) {
    board[move] = 'O';
    renderBoard();
    if (checkWinner()) {
      messageElement.textContent = `O Wins!`;
      score.O++;
      updateScores();
      isGameOver = true;
    } else if (!board.includes('')) {
      messageElement.textContent = `It's a Tie!`;
      score.Tie++;
      updateScores();
      isGameOver = true;
    } else {
      currentPlayer = 'X';
      turnElement.textContent = 'X TURN';
    }
  }
}

function findWinningMove(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of wins) {
    const [a,b,c] = pattern;
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v === player).length === 2 && line.includes('')) {
      return pattern[line.indexOf('')];
    }
  }
  return null;
}

function renderBoard() {
  boardElement.querySelectorAll('div').forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function updateScores() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  scoreTie.textContent = score.Tie;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameOver = false;
  messageElement.textContent = '';
  turnElement.textContent = 'X TURN';
  renderBoard();
}

resetGame();
