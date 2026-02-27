import { useState, useCallback, useEffect } from "react";
import { Board, Player, getBestMove, getWinner, getWinningLine, isBoardFull } from "@/lib/minimax";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const EMPTY_BOARD: Board = Array(9).fill(null);

type GameStatus = "playing" | "win" | "lose" | "draw";

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>([...EMPTY_BOARD]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [moveCount, setMoveCount] = useState(0);

  // Check game state after each move
  const checkGame = useCallback((newBoard: Board) => {
    const winner = getWinner(newBoard);
    if (winner) {
      setWinLine(getWinningLine(newBoard));
      setStatus(winner === "X" ? "win" : "lose");
      return true;
    }
    if (isBoardFull(newBoard)) {
      setStatus("draw");
      return true;
    }
    return false;
  }, []);

  // AI makes its move
  useEffect(() => {
    if (isPlayerTurn || status !== "playing") return;

    const timer = setTimeout(() => {
      const newBoard = [...board];
      const move = getBestMove(newBoard);
      if (move !== -1) {
        newBoard[move] = "O";
        setBoard(newBoard);
        setMoveCount((c) => c + 1);
        if (!checkGame(newBoard)) {
          setIsPlayerTurn(true);
        }
      }
    }, 350); // Small delay for feel

    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, status, checkGame]);

  // Human clicks a cell
  const handleClick = (index: number) => {
    if (!isPlayerTurn || board[index] || status !== "playing") return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setMoveCount((c) => c + 1);
    if (!checkGame(newBoard)) {
      setIsPlayerTurn(false);
    }
  };

  const reset = () => {
    setBoard([...EMPTY_BOARD]);
    setIsPlayerTurn(true);
    setStatus("playing");
    setWinLine(null);
    setMoveCount(0);
  };

  const statusText: Record<GameStatus, string> = {
    playing: isPlayerTurn ? "Your turn (X)" : "AI is thinking...",
    win: "You won! 🎉",
    lose: "AI wins!",
    draw: "It's a draw!",
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Status */}
      <div className="h-10 flex items-center">
        <p className={`font-mono text-lg tracking-wide ${
          status === "playing" ? "text-muted-foreground" : "text-primary"
        }`}>
          {statusText[status]}
        </p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-1.5 bg-border rounded-lg p-1.5">
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || status !== "playing" || !isPlayerTurn}
              className={`
                w-24 h-24 sm:w-28 sm:h-28 rounded-md
                flex items-center justify-center
                font-mono text-4xl sm:text-5xl font-bold
                transition-all duration-200
                ${!cell && status === "playing" && isPlayerTurn
                  ? "bg-card hover:bg-accent cursor-pointer"
                  : "bg-card cursor-default"
                }
                ${isWinCell ? "bg-primary text-primary-foreground" : ""}
                ${cell === "X" && !isWinCell ? "text-foreground" : ""}
                ${cell === "O" && !isWinCell ? "text-muted-foreground" : ""}
              `}
              aria-label={`Cell ${i + 1}: ${cell || "empty"}`}
            >
              <span className={`transition-all duration-150 ${cell ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
                {cell}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <Button variant="outline" onClick={reset} className="gap-2 font-mono">
        <RotateCcw className="w-4 h-4" />
        {status !== "playing" ? "Play Again" : "Reset"}
      </Button>

      {/* Move counter */}
      <p className="text-xs text-muted-foreground font-mono">
        Moves: {moveCount}
      </p>
    </div>
  );
};

export default TicTacToe;
