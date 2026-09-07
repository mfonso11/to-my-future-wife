import memories from "../data/memories";

function Inventory({ collected }) {

  return (
    <div className="inventory">

      <div className="inventory-title">
        MEMORIES
      </div>

      <div className="inventory-items">

        {Object.values(memories).map(
          (memory) => {

            const found =
              collected.includes(
                memory.id
              );

            return (
              <div
                key={memory.id}
                className={`inventory-item ${
                  found
                    ? "collected"
                    : ""
                }`}
              >

                {found
                  ? memory.icon
                  : "?"}

              </div>
            );

          }
        )}

      </div>

    </div>
  );
}

export default Inventory;