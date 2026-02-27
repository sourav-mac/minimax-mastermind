import TicTacToe from "@/components/TicTacToe";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-foreground">
          Tic-Tac-Toe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-mono">
          You are X · AI uses Minimax with α-β pruning
        </p>
      </div>
      <TicTacToe />
    </div>
  );
};

export default Index;
