import { useEffect, useState } from "react";

function MemoryScene({ memory, onClose }) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showSecondImage, setShowSecondImage] = useState(false);

  const [displayedText, setDisplayedText] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(true);

  const currentDialogue = showSecondImage
    ? memory.afterFlashback?.[dialogueIndex]
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
    // SECOND IMAGE STAGE
    // =========================

    if (showSecondImage) {
      if (
        memory.afterFlashback &&
        dialogueIndex <
          memory.afterFlashback.length - 1
      ) {
        setDialogueIndex(
          (prev) => prev + 1
        );

        return;
      }

      onClose();
      return;
    }

    // =========================
    // FIRST IMAGE STAGE
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
    // SWITCH TO SECOND IMAGE
    // =========================

    if (
      memory.flashbackImage &&
      memory.afterFlashback
    ) {
      setShowSecondImage(true);
      setDialogueIndex(0);

      return;
    }

    // =========================
    // MEMORY FINISHED
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
    showSecondImage
  ]);

  // =========================
  // CURRENT IMAGE
  // =========================

  const currentImage =
    showSecondImage &&
    memory.flashbackImage
      ? memory.flashbackImage
      : memory.image;

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

        {/* =========================
            MEMORY IMAGE
        ========================= */}

        <div className="photo-frame">

          <img
            src={currentImage}
            alt={memory.title}
          />

        </div>

        <p className="memory-description">
          {memory.description}
        </p>

        {/* =========================
            DIALOGUE
        ========================= */}

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
