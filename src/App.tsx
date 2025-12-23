import { useEffect, useState } from "react";
import { TROPES } from "./data/tropes";
import { generateCard } from "./utils/bingo";
import Confetti from "react-confetti";

interface Square {
  id: number;
  text: string;
  checked: boolean;
}

const STORAGE_KEY = "hallmark-bingo-card";

function App() {
  const [card, setCard] = useState<Square[]>([]);
  const [bingo, setBingo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCard(JSON.parse(saved));
    } else {
      createNewCard();
    }
  }, []);

  useEffect(() => {
    if (card.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
      checkBingo(card);
    }
  }, [card]);

  function createNewCard() {
    const seed = Math.floor(Math.random() * 1e9);
    const newCard = generateCard(TROPES, seed);
    setCard(newCard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCard)); // <-- save new card
    window.history.replaceState(null, "", `?seed=${seed}`);
  }


  function toggleSquare(id: number) {
    setCard(card.map(s =>
      s.id === id ? { ...s, checked: !s.checked } : s
    ));
  }

  function checkBingo(card: Square[]) {
    const grid = Array.from({ length: 5 }, (_, r) =>
      card.slice(r * 5, r * 5 + 5)
    );

    const lines = [];

    lines.push(...grid); // rows
    lines.push(...[0,1,2,3,4].map(c => grid.map(r => r[c]))); // cols
    lines.push([0,1,2,3,4].map(i => grid[i][i])); // diagonal TL-BR
    lines.push([0,1,2,3,4].map(i => grid[i][4-i])); // diagonal TR-BL

    setBingo(lines.some(line => line.every(s => s.checked)));
  }

return (
  <div className="app">
    {/* Confetti overlay */}
    {bingo && (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ pointerEvents: "none" }}
      />
    )}

    <h1 className="title">🎄 Hallmark Bingo 🎄</h1>

    <div className="card-container">
      <div className="grid-container">
        {/* BINGO text overlay centered on the grid */}
        {bingo && <div className="bingo-text">BINGO!</div>}

        {/* Bingo card grid */}
        <div className="grid">
          {card.map(square => (
            <button
              key={square.id}
              className={square.checked ? "checked" : ""}
              onClick={() => toggleSquare(square.id)}
            >
              <span className="square-text">{square.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="controls">
      <button onClick={createNewCard}>🎁 New Card</button>
      <button
        onClick={() => {
          const resetCard = card.map(s => ({
            ...s,
            checked: s.text === "FREE SPACE" ? true : false
          }));
          setCard(resetCard);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resetCard));
        }}
      >
        ♻ Reset
      </button>
    </div>
  </div>
);



}

export default App;