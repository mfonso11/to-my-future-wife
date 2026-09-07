import { useEffect, useState } from "react";

function MemoryScene({ memory, onClose }) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showFlashback, setShowFlashback] =
    useState(false);

  const [afterFlashbackIndex, setAfterFlashbackIndex] =
    useState(0);

  const [displayedText, setDisplayedText] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(true);

  const currentDialogue = showFlashback
    ? memory.afterFlashback?.[afterFlashbackIndex]
    : memory.dialogue?.[dialogueIndex];

  // =========================
  // TYPEWRITER
  // =========================

  useEffect(() => {
    if (!currentDialogue) return;

    setDisplayedText("");
    setIsTyping(true);

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayedText(
        currentDialogue.text.slice(
          0,
          index
        )
      );

      if (
        index >=
        currentDialogue.text.length
      ) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);

    return () => {
      clearInterval(interval);
    };
  }, [currentDialogue]);

  // =========================
  // NEXT
  // =========================

  const next = () => {
    if (!currentDialogue) return;

    // Finish typing first
    if (isTyping) {
      setDisplayedText(
        currentDialogue.text
      );

      setIsTyping(false);

      return;
    }

    // =========================
    // FLASHBACK DIALOGUE
    // =========================

    if (showFlashback) {
      if (
        memory.afterFlashback &&
        afterFlashbackIndex <
          memory.afterFlashback.length - 1
      ) {
        setAfterFlashbackIndex(
          (prev) => prev + 1
        );
      } else {
        onClose();
      }

      return;
    }

    // =========================
    // NORMAL DIALOGUE
    // =========================

    if (
      memory.dialogue &&
      dialogueIndex <
        memory.dialogue.length - 1
    ) {
      setDialogueIndex(
        (prev) => prev + 1
      );

      return;
    }

    // =========================
    // FLASHBACK
    // =========================

    if (memory.flashbackImage) {
      setShowFlashback(true);
      setAfterFlashbackIndex(0);

      return;
    }

    // =========================
    // FINISHED
    // =========================

    onClose();
  };

  // =========================
  // KEYBOARD
  // =========================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    currentDialogue,
    isTyping,
    dialogueIndex,
    afterFlashbackIndex,
    showFlashback
  ]);

  // =========================
  // FLASHBACK SCREEN
  // =========================

  if (showFlashback) {
    return (
      <div
        className="fullscreen flashback-screen"
        onClick={next}
      >
        <div className="flashback-content">

          <div className="flashback-label">
            MEMORY FLASHBACK
          </div>

          <div className="conversation-frame">
            <img
              src={memory.flashbackImage}
              alt="Conversation memory"
            />
          </div>

          {currentDialogue && (
            <div className="flashback-dialogue">

              <div className="speaker">
                {currentDialogue.speaker}
              </div>

              <p>
                {displayedText}
              </p>

              <span>
                {isTyping
                  ? "▶"
                  : "Click to continue ▶"}
              </span>

            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================
  // MEMORY SCREEN
  // =========================

  return (
    <div
      className="fullscreen memory-screen"
      onClick={next}
    >
      <div className="memory-content">

        <div className="memory-header">

          <span>
            MEMORY FRAGMENT FOUND
          </span>

          <h1>
            {memory.icon}{" "}
            {memory.title}
          </h1>

        </div>

        <div className="photo-frame">

          <img
            src={memory.image}
            alt={memory.title}
          />

        </div>

        <p className="memory-description">
          {memory.description}
        </p>

        {currentDialogue && (
          <div className="memory-dialogue">

            <div className="speaker">
              {currentDialogue.speaker}
            </div>

            <p>
              {displayedText}
            </p>

            <span>
              {isTyping
                ? "▶"
                : "Click to continue ▶"}
            </span>

          </div>
        )}

      </div>
    </div>
  );
}

export default MemoryScene;