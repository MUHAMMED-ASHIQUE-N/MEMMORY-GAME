  import { useRef, useState } from "react";
  import "./App.css";
  import { useEffect } from "react";
  import Confetti from "react-confetti";

  const gameIcons = ["💖", "😶‍🌫️", "🍻", "☠️", "🎂", "🎁"];

  function App() {
    const [pisces, setPisces] = useState([]);
    const [isGameCompleted, setIsGameCompleted] = useState(false)
    let timeout = useRef();
    
    const startGame = () => {
      const duplicateGameIcons = [...gameIcons, ...gameIcons];
      const newGameIcons = [];

      while (newGameIcons.length < gameIcons.length * 2) {
        const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
        newGameIcons.push({
          emoji: duplicateGameIcons[randomIndex],
          flipped: false,
          solved: false,
          position: newGameIcons.length,
        });

        duplicateGameIcons.splice(randomIndex, 1);
      }
      setPisces(newGameIcons);
      setIsGameCompleted(false);
    };

    useEffect(() => {
      startGame();
    }, []);

    const handleActive = (data) => {
      const flippedData = pisces.filter((item) => item.flipped && !item.solved);
      if (flippedData.length === 2) return;
      setPisces(
        pisces.map((item) => {
          if (item.position === data.position) {
            item.flipped = !item.flipped;
          }
          return item;
        })
      );
    };

    const gameLogicForFlipped = () => {
      const flippeditem = pisces.filter((item) => item.flipped && !item.solved);

      if (flippeditem.length === 2) {
        timeout.current = setTimeout(() => {
          setPisces(
            pisces.map((item) => {
              if (
                item.position === flippeditem[0].position ||
                item.position === flippeditem[1].position
              ) {
                if (flippeditem[0].emoji === flippeditem[1].emoji) {
                  item.solved = true;
                } else {
                  item.flipped = false;
                }
              }
              return item;
            })
          );
        }, 800);
      }
    };

    useEffect(() => {
      gameLogicForFlipped();

      if (pisces.length > 0 && pisces.every((item) => item.solved)) {
        setIsGameCompleted(true);
      }
    }, [pisces]);

    console.log(isGameCompleted);

    return (
      <main>
        <h1>Memmory Game in React </h1>

        <div className="container">
          {pisces.map((data, index) => (
            <div
              className={`flip-card ${
                data.flipped || data.solved ? "active" : ""
              }`}
              key={index}
            >
              <div className="flip-card-inner">
                <div
                  className="flip-card-front"
                  onClick={() => handleActive(data)}
                />
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
        </div>
        {isGameCompleted && (
          <div className="game-completed">
            <h1> YOU WIN!!! </h1>
            <Confetti width={window.innerWidth} height={window.innerHeight} />

            <button onClick={startGame} >Restart Game</button>
          </div>
        )}
      </main>
    );
  }

  export default App;
