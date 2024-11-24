import * as React from "react";
import { useEffect } from "react";
export type PuzzleGamePropsTypes = {
    onStartGame: () => Promise<any>;
    onEndGame: (xp: number, continueGame: () => Promise<any>) => Promise<any>;
  } & Partial<React.ReactPortal>;
  

export const PuzzleGame: React.FC<PuzzleGamePropsTypes> = ({
  onStartGame,
  onEndGame,
}) => {
    useEffect(() => {

        document.addEventListener("gameStart", onStartGame as EventListener);
        return () => {
        document.removeEventListener("gameStart", onStartGame as EventListener);
        };
    }, []);

    useEffect(() => {
        const handleGameOver = (event: CustomEvent) => {
            console.log(event)            
          onEndGame(event.detail.score, async() => {
            const gameStartEvent = new CustomEvent("gameStart", {});
            document.dispatchEvent(gameStartEvent);
          });
        };
    console.log('addEventListener')
        document.addEventListener("gameOver", handleGameOver as EventListener);
        
        // return () => {
        //   document.removeEventListener("gameOver", handleGameOver as EventListener);
        // };
      }, []);


  return <></>;
};
