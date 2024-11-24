import React from "react";
import "./App.css";
import "./utils/object";
import { PuzzleGame } from "./startgame";

function App() {
  return (
    <div>
      {/* header */}
      <h1 id="titleInfo">
        <span className="blue">10</span>
        <span className="yellow">10</span>
        <span className="red">!</span>
      </h1>

      {/* game component*/}
      <PuzzleGame
        onStartGame={async () => console.log("Start game")}
        onEndGame={async (xp, continueGame) => {
          console.log({ xp });
          await continueGame();
        }}
      />
    </div>
  );
}

export default App;
