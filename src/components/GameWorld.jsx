import { useEffect, useState } from "react";

function GameWorld({ collected, onCollect }) {

  const [player, setPlayer] = useState({
    x: 50,
    y: 50
  });

  const objects = [
    {
      id: "laptop",
      icon: "💻",
      name: "Laptop",
      x: 20,
      y: 30
    },

    {
      id: "movie",
      icon: "🎬",
      name: "Movie",
      x: 70,
      y: 25
    },

    {
      id: "ring",
      icon: "💍",
      name: "Promise Ring",
      x: 25,
      y: 70
    },

    {
      id: "book",
      icon: "📖",
      name: "Book",
      x: 75,
      y: 70
    }
  ];

  // =====================================================
  // PLAYER MOVEMENT
  // =====================================================

  useEffect(() => {

    const handleKeyDown = (event) => {

      const key =
        event.key.toLowerCase();

      setPlayer((current) => {

        let newX = current.x;
        let newY = current.y;

        const speed = 3;

        if (
          key === "w" ||
          key === "arrowup"
        ) {
          newY -= speed;
        }

        if (
          key === "s" ||
          key === "arrowdown"
        ) {
          newY += speed;
        }

        if (
          key === "a" ||
          key === "arrowleft"
        ) {
          newX -= speed;
        }

        if (
          key === "d" ||
          key === "arrowright"
        ) {
          newX += speed;
        }

        newX = Math.max(
          5,
          Math.min(95, newX)
        );

        newY = Math.max(
          10,
          Math.min(90, newY)
        );

        return {
          x: newX,
          y: newY
        };

      });

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

  }, []);

  // =====================================================
  // INTERACTION
  // =====================================================

  const interact = (object) => {

    if (
      collected.includes(object.id)
    ) {
      return;
    }

    const distance = Math.sqrt(
      Math.pow(
        player.x - object.x,
        2
      ) +
      Math.pow(
        player.y - object.y,
        2
      )
    );

    if (distance < 15) {
      onCollect(object.id);
    }

  };

  return (
    <div className="game-world">

      <div className="world-title">
        Find what you remember.
      </div>

      {/* =================================================
          OBJECTS
      ================================================= */}

      {objects.map((object) => {

        const found =
          collected.includes(
            object.id
          );

        return (
          <div
            key={object.id}
            className={`world-object ${
              found ? "found" : ""
            }`}
            style={{
              left: `${object.x}%`,
              top: `${object.y}%`
            }}
            onClick={() =>
              interact(object)
            }
          >

            <div className="object-icon">
              {found
                ? "✓"
                : object.icon}
            </div>

            {!found && (
              <span className="object-name">
                {object.name}
              </span>
            )}

          </div>
        );

      })}

      {/* =================================================
          GIRL PLAYER
      ================================================= */}

      <div
        className="player"
        style={{
          left: `${player.x}%`,
          top: `${player.y}%`
        }}
      >

        <div className="player-sprite">
          ♀
        </div>

      </div>

      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="controls">

        WASD / Arrow Keys to move
        <br />
        Walk near a memory and click it

      </div>

    </div>
  );
}

export default GameWorld;