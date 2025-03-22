// Your code here
document.addEventListener("DOMContentLoaded", () => {
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const votesInput = document.getElementById("votes");
  const resetButton = document.getElementById("reset-btn");

  // Bonus:
  const characterForm = document.getElementById("character-form");
  const newNameInput = characterForm ? document.getElementById("name") : null;
  const newImageUrlInput = characterForm
    ? document.getElementById("image-url")
    : null;

  let currentCharacter = null;

  function fetchCharacters() {
    fetch("http://localhost:3000/characters")
      .then((response) => response.json())
      .then((characters) => {
        characters.forEach((character) => {
          const characterSpan = document.createElement("span");
          characterSpan.textContent = character.name;
          characterSpan.addEventListener("click", () =>
            displayCharacterDetails(character.id)
          );
          characterBar.appendChild(characterSpan);
        });
      });
  }

  function displayCharacterDetails(id) {
    fetch(`http://localhost:3000/characters/${id}`)
      .then((response) => response.json())
      .then((character) => {
        currentCharacter = character;
        nameElement.textContent = character.name;
        imageElement.src = character.image;
        imageElement.alt = character.name;
        voteCountElement.textContent = character.votes;
      });
  }

  votesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentCharacter) {
      const addedVotes = parseInt(votesInput.value);
      if (!isNaN(addedVotes)) {
        currentCharacter.votes += addedVotes;
        voteCountElement.textContent = currentCharacter.votes;
        votesInput.value = "";

        // Extra Bonus: Update the server
        fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ votes: currentCharacter.votes }),
        })
          .then((response) => response.json())
          .catch((error) => console.error("Error updating votes:", error));
      }
    }
  });

  resetButton.addEventListener("click", () => {
    if (currentCharacter) {
      currentCharacter.votes = 0;
      voteCountElement.textContent = 0;

      // Extra Bonus: Update the server
      fetch(`http://localhost:3000/characters/${currentCharacter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: 0 }),
      })
        .then((response) => response.json())
        .catch((error) => console.error("Error resetting votes:", error));
    }
  });

  // Bonus: Add new character
  if (characterForm) {
    characterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newName = newNameInput.value;
      const newImageUrl = newImageUrlInput.value;
      if (newName && newImageUrl) {
        const newCharacter = {
          name: newName,
          image: newImageUrl,
          votes: 0,
        };

        // Extra Bonus: Post new character to server
        fetch("http://localhost:3000/characters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCharacter),
        })
          .then((response) => response.json())
          .then((createdCharacter) => {
            const characterSpan = document.createElement("span");
            characterSpan.textContent = createdCharacter.name;
            characterSpan.addEventListener("click", () =>
              displayCharacterDetails(createdCharacter.id)
            );
            characterBar.appendChild(characterSpan);

            displayCharacterDetails(createdCharacter.id);

            newNameInput.value = "";
            newImageUrlInput.value = "";
          })
          .catch((error) => console.error("Error adding character:", error));
      }
    });
  }

  fetchCharacters();
});
