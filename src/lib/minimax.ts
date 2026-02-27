// Tic-Tac-Toe AI using Minimax with Alpha-Beta Pruning
// 
// HOW MINIMAX WORKS:
// The Minimax algorithm simulates all possible future game states recursively.
// It assumes both players play optimally:
// - The "maximizing" player (AI/O) tries to maximize the score
// - The "minimizing" player (Human/X) tries to minimize the score
// Scores: AI wins = +10, Human wins = -10, Draw = 0
// Alpha-Beta pruning skips branches that can't affect the final decision.

export type Player = "X" | "O" | null;
export type Board = Player[];

// Check all winning combinations
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// Returns the winner ('X' or 'O') or null
export function getWinner(board: Board): Player {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Returns the winning line indices, or null
export function getWinningLine(board: Board): number[] | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

// Check if the board is full (draw condition)
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Minimax with Alpha-Beta Pruning
// isMaximizing: true when it's AI's turn (O), false for human (X)
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const winner = getWinner(board);

  // Terminal states: return score adjusted by depth for faster wins
  if (winner === "O") return 10 - depth; // AI wins (prefer faster wins)
  if (winner === "X") return depth - 10;  // Human wins (delay losses)
  if (isBoardFull(board)) return 0;       // Draw

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O"; // AI move
        const eval_ = minimax(board, depth + 1, false, alpha, beta);
        board[i] = null; // Undo move
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break; // Alpha-Beta pruning: cut off
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X"; // Human move
        const eval_ = minimax(board, depth + 1, true, alpha, beta);
        board[i] = null; // Undo move
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break; // Alpha-Beta pruning: cut off
      }
    }
    return minEval;
  }
}

// Find the best move for AI (O) — returns the index of the optimal cell
export function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      const score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}
