import { useEffect, useState } from "react";
import "./App.css";
import memories from "./data/memories";
import GameWorld from "./components/GameWorld";
import DialogueBox from "./components/DialogueBox";
import MemoryScene from "./components/MemoryScene";
import Inventory from "./components/Inventory";
import FinalLetter from "./components/FinalLetter";

function App() {
  const [gameState, setGameState] = useState("intro");
  const [dialogue, setDialogue] = useState([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [nextState, setNextState] = useState("explore");
  const [collected, setCollected] = useState([]);
  const [activeMemory, setActiveMemory] = useState(null);

  const startGame = () => setGameState("wake");

  const startDialogue = (lines, stateAfter) => {
    setDialogue(lines);
    setDialogueIndex(0);
    setNextState(stateAfter);
    setGameState("dialogue");
  };

  const nextDialogue = () => {
    if (dialogueIndex < dialogue.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      setGameState(nextState);
    }
  };

  useEffect(() => {
    if (gameState === "wake") {
      startDialogue(
        [
          { speaker: "Girl", text: "Where am I?" },
          { speaker: "Girl", text: "I... don't remember anything." }
        ],
        "guide"
      );
    }

    if (gameState === "guide") {
      startDialogue(
        [
          { speaker: "Guide", text: "Your memories aren't gone." },
          { speaker: "Guide", text: "They're scattered." },
          { speaker: "Guide", text: "Find them." },
          { speaker: "Guide", text: "Remember them." },
          { speaker: "Guide", text: "And when you've found them all..." },
          {
            speaker: "Guide",
            text: "You'll remember who you're looking for."
          }
        ],
        "explore"
      );
    }
  }, [gameState]);

  const collectMemory = (memoryId) => {
    if (collected.includes(memoryId)) return;

    const memory = memories[memoryId];

    setCollected((prev) => {
      if (prev.includes(memoryId)) return prev;
      return [...prev, memoryId];
    });

    setActiveMemory(memory);
    setGameState("memory");
  };

  const closeMemory = () => {
    if (!activeMemory) return;

    /*
      Include the current memory in the check.

      React state updates are asynchronous, so the newly
      collected memory may not yet appear inside `collected`
      when this function runs.
    */
    const updatedCollected = collected.includes(activeMemory.id)
      ? collected
      : [...collected, activeMemory.id];

    setActiveMemory(null);

    const allMemoriesCollected = Object.keys(memories).every((id) =>
      updatedCollected.includes(id)
    );

    if (allMemoriesCollected) {
      setGameState("combine");
    } else {
      setGameState("explore");
    }
  };

  const combineMemories = () => setGameState("restored");

  const continueToLetter = () => setGameState("letter");

  return (
    <div className="game">
      {gameState === "intro" && (
        <div className="fullscreen intro-screen">
          <div className="intro-content">
            <p className="small-text">A story waiting to be remembered</p>

            <h1>MEMORY</h1>

            <p>Some memories are never really lost.</p>

            <button onClick={startGame}>Wake Up</button>
          </div>
        </div>
      )}

      {gameState === "dialogue" && (
        <div className="fullscreen world-screen">
          <div className="pixel-room">
            <div className="girl-character">♀</div>
            <div className="guide-character">?</div>
          </div>

          <DialogueBox
            dialogue={dialogue[dialogueIndex]}
            onNext={nextDialogue}
          />
        </div>
      )}

      {gameState === "explore" && (
        <div className="game-container">
          <GameWorld
            collected={collected}
            onCollect={collectMemory}
          />

          <Inventory collected={collected} />
        </div>
      )}

      {gameState === "memory" && activeMemory && (
        <MemoryScene
          memory={activeMemory}
          onClose={closeMemory}
        />
      )}

      {gameState === "combine" && (
        <div className="fullscreen combine-screen">
          <h1>All Memories Found</h1>

          <p>Something is beginning to come back.</p>

          <div className="memory-combination">
            {Object.values(memories).map((memory) => (
              <div
                key={memory.id}
                className="memory-piece"
              >
                {memory.icon}
              </div>
            ))}
          </div>

          <button onClick={combineMemories}>
            Combine Memories
          </button>
        </div>
      )}

      {gameState === "restored" && (
        <div className="fullscreen restored-screen">
          <div className="restored-content">
            <p>Memory restored.</p>

            <p>Story restored.</p>

            <h1>Identity restored.</h1>

            <div className="final-dialogue">
              <p>Girl: "...I remember."</p>
              <p>Guide: "You remembered."</p>
              <p>Girl: "Who are you?"</p>
              <p>Guide: "Someone who'll always be beside you"</p>
            </div>

            <button onClick={continueToLetter}>
              Continue
            </button>
          </div>
        </div>
      )}

      {gameState === "letter" && <FinalLetter />}
    </div>
  );
}

export default App;
