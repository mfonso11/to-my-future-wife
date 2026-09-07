import { useEffect, useState } from "react";

function DialogueBox({ dialogue, onNext }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!dialogue) return;

    setDisplayedText("");
    setIsTyping(true);

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayedText(
        dialogue.text.slice(0, index)
      );

      if (index >= dialogue.text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);

    return () => {
      clearInterval(interval);
    };
  }, [dialogue]);

  const handleClick = () => {
    if (!dialogue) return;

    // Finish typing immediately
    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
      return;
    }

    // Move to next dialogue
    onNext();
  };

  if (!dialogue) return null;

  return (
    <div
      className="dialogue-box"
      onClick={handleClick}
    >
      <div className="speaker">
        {dialogue.speaker}
      </div>

      <p>
        {displayedText}
      </p>

      <span className="continue">
        {isTyping
          ? "▶"
          : "Click to continue ▶"}
      </span>
    </div>
  );
}

export default DialogueBox;
