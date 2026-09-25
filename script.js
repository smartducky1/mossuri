/* =========================================================
   MOSSURI
   Main frontend logic
========================================================= */


/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = [
  {
    name: "Goofy",
    file: "/assets/goofy.jpg"
  },
  {
    name: "Smart",
    file: "/assets/smart.jpg"
  },
  {
    name: "Hyper",
    file: "/assets/hyper.jpg"
  }
];

let currentCharacter = 0;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const characterImage =
  document.getElementById("characterImage");

const selectedPersonalityImage =
  document.getElementById("selectedPersonalityImage");

const selectedPersonalityName =
  document.getElementById("selectedPersonalityName");

const prevCharacter =
  document.getElementById("prevCharacter");

const nextCharacter =
  document.getElementById("nextCharacter");

const downloadCharacter =
  document.getElementById("downloadCharacter");


/* =========================================================
   CHARACTER RENDER
========================================================= */

function renderCharacter() {

  const character = characters[currentCharacter];

  if (!character) {
    return;
  }

  if (characterImage) {
    characterImage.src = character.file;
    characterImage.alt =
      `${character.name} personality`;
  }

  if (selectedPersonalityImage) {
    selectedPersonalityImage.src = character.file;
    selectedPersonalityImage.alt =
      `${character.name} personality`;
  }

  if (selectedPersonalityName) {
    selectedPersonalityName.textContent =
      character.name.toUpperCase();
  }
}


/* =========================================================
   PREVIOUS CHARACTER
========================================================= */

if (prevCharacter) {

  prevCharacter.addEventListener("click", () => {

    currentCharacter--;

    if (currentCharacter < 0) {
      currentCharacter =
        characters.length - 1;
    }

    renderCharacter();

  });

}


/* =========================================================
   NEXT CHARACTER
========================================================= */

if (nextCharacter) {

  nextCharacter.addEventListener("click", () => {

    currentCharacter++;

    if (currentCharacter >= characters.length) {
      currentCharacter = 0;
    }

    renderCharacter();

  });

}


/* =========================================================
   DOWNLOAD CHARACTER
========================================================= */

if (downloadCharacter) {

  downloadCharacter.addEventListener("click", async () => {

    const character =
      characters[currentCharacter];

    if (!character) {
      return;
    }

    try {

      const response =
        await fetch(character.file);

      if (!response.ok) {
        throw new Error(
          "Image could not be loaded."
        );
      }

      const blob =
        await response.blob();

      const blobUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;

      link.download =
        `${character.name.toLowerCase()}.jpg`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(blobUrl);

    } catch (error) {

      console.error(error);

      window.open(
        character.file,
        "_blank",
        "noopener,noreferrer"
      );

    }

  });

}


/* =========================================================
   EVM CHECKER
========================================================= */

const checkWallet =
  document.getElementById("checkWallet");

const checkBtn =
  document.getElementById("checkBtn");

const checkResult =
  document.getElementById("checkResult");


function showCheckResult(message, type) {

  if (!checkResult) {
    return;
  }

  checkResult.textContent = message;

  checkResult.className =
    `check-result ${type}`;
}


/* =========================================================
   CHECK WALLET
========================================================= */

if (checkBtn) {

  checkBtn.addEventListener("click", async () => {

    const wallet =
      checkWallet.value.trim();

    if (!wallet) {

      showCheckResult(
        "Paste your wallet first.",
        "no"
      );

      return;
    }


    checkBtn.disabled = true;

    checkBtn.textContent = "CHECKING";


    try {

      const response =
        await fetch("/api/check", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            wallet
          })

        });


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to check wallet."
        );

      }


      if (data.eligible === true) {

        showCheckResult(
          "🟢 YES — wallet is on the list.",
          "yes"
        );

      } else {

        showCheckResult(
          "🔴 NO — wallet is not on the list.",
          "no"
        );

      }

    } catch (error) {

      console.error(error);

      showCheckResult(
        error.message ||
        "Unable to check wallet.",
        "no"
      );

    } finally {

      checkBtn.disabled = false;

      checkBtn.textContent = "CHECK";

    }

  });

}


/* =========================================================
   FORM ELEMENTS
========================================================= */

const usernameInput =
  document.getElementById("username");

const walletInput =
  document.getElementById("wallet");

const quoteUrlInput =
  document.getElementById("quoteUrl");

const tagUrlInput =
  document.getElementById("tagUrl");

const registerBtn =
  document.getElementById("registerBtn");

const formMessage =
  document.getElementById("formMessage");


/* =========================================================
   MESSAGE
========================================================= */

function showFormMessage(
  message,
  type = ""
) {

  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;

  formMessage.className =
    `form-message ${type}`;

}


/* =========================================================
   WALLET VALIDATION
========================================================= */

function isValidEvmWallet(wallet) {

  return /^0x[a-fA-F0-9]{40}$/.test(wallet);

}


/* =========================================================
   URL VALIDATION
========================================================= */

function isValidUrl(value) {

  if (!value) {
    return false;
  }

  try {

    const url =
      new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );

  } catch {

    return false;

  }

}


/* =========================================================
   REGISTER
========================================================= */

if (registerBtn) {

  registerBtn.addEventListener(
    "click",
    async () => {

      showFormMessage("");

      const username =
        usernameInput.value.trim();

      const wallet =
        walletInput.value.trim();

      const quoteUrl =
        quoteUrlInput.value.trim();

      const tagUrl =
        tagUrlInput.value.trim();

      const personality =
        characters[currentCharacter].name;


      /* Username */

      if (!username) {

        showFormMessage(
          "Please enter your X username.",
          "error"
        );

        usernameInput.focus();

        return;
      }


      /* Wallet */

      if (!isValidEvmWallet(wallet)) {

        showFormMessage(
          "Please enter a valid EVM wallet.",
          "error"
        );

        walletInput.focus();

        return;
      }


      /* Quote URL */

      if (!isValidUrl(quoteUrl)) {

        showFormMessage(
          "Please paste your quote tweet link.",
          "error"
        );

        quoteUrlInput.focus();

        return;
      }


      /* Tag URL */

      if (!isValidUrl(tagUrl)) {

        showFormMessage(
          "Please paste your tag post link.",
          "error"
        );

        tagUrlInput.focus();

        return;
      }


      /* Loading */

      registerBtn.disabled = true;

      registerBtn.textContent =
        "SUBMITTING";


      try {

        const response =
          await fetch("/api/submit", {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              username,

              wallet,

              personality,

              quoteUrl,

              tagUrl

            })

          });


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "We could not save your application."
          );

        }


        /* Success */

        showFormMessage(
          "Application received!",
          "success"
        );


        showSuccessModal();


        /* Refresh board */

        loadBoard();


        /* Clear form */

        usernameInput.value = "";

        walletInput.value = "";

        quoteUrlInput.value = "";

        tagUrlInput.value = "";


      } catch (error) {

        console.error(error);

        showFormMessage(
          error.message ||
          "We could not save your application.",
          "error"
        );

      } finally {

        registerBtn.disabled = false;

        registerBtn.textContent =
          "REGISTER";

      }

    }
  );

}


/* =========================================================
   SUCCESS MODAL
========================================================= */

const successModal =
  document.getElementById("successModal");

const successImage =
  document.getElementById("successImage");

const closeModal =
  document.getElementById("closeModal");

const modalBackdrop =
  document.querySelector(".modal-backdrop");


const successImages = [
  "/assets/success-popup.png"
];


function showSuccessModal() {

  if (!successModal) {
    return;
  }

  const randomImage =
    successImages[
      Math.floor(
        Math.random() *
        successImages.length
      )
    ];

  if (successImage) {
    successImage.src = randomImage;
  }

  successModal.classList.remove("hidden");

}


function hideSuccessModal() {

  if (!successModal) {
    return;
  }

  successModal.classList.add("hidden");

}


if (closeModal) {

  closeModal.addEventListener(
    "click",
    hideSuccessModal
  );

}


if (modalBackdrop) {

  modalBackdrop.addEventListener(
    "click",
    hideSuccessModal
  );

}


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      successModal &&
      !successModal.classList.contains("hidden")
    ) {

      hideSuccessModal();

    }

  }
);


/* =========================================================
   BOARD
========================================================= */

const boardBody =
  document.getElementById("boardBody");

const boardPrev =
  document.getElementById("boardPrev");

const boardNext =
  document.getElementById("boardNext");


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function shortWallet(wallet) {

  if (!wallet) {
    return "";
  }

  if (wallet.length <= 14) {
    return wallet;
  }

  return (
    wallet.slice(0, 7) +
    "..." +
    wallet.slice(-5)
  );

}


function renderBoard(rows) {

  if (!boardBody) {
    return;
  }


  if (!Array.isArray(rows) || rows.length === 0) {

    boardBody.innerHTML = `
      <div class="board-empty">
        No applications yet.
      </div>
    `;

    return;
  }


  boardBody.innerHTML =
    rows.map((row) => {

      const username =
        row.username ||
        row.Username ||
        "";

      const wallet =
        row.wallet ||
        row.Wallet ||
        "";

      const personality =
        row.personality ||
        row.Personality ||
        "";


      return `
        <div class="board-row">

          <div>
            ${escapeHtml(username)}
          </div>

          <div
            class="board-wallet"
            title="${escapeHtml(wallet)}"
          >
            ${escapeHtml(
              shortWallet(wallet)
            )}
          </div>

          <div>
            ${escapeHtml(
              personality
            )}
          </div>

        </div>
      `;

    }).join("");

}


async function loadBoard() {

  if (!boardBody) {
    return;
  }

  try {

    const response =
      await fetch(
        "/api/board",
        {
          method: "GET",
          cache: "no-store"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Could not load board."
      );

    }


    const rows =
      Array.isArray(data)
        ? data
        : (
            data.rows ||
            data.applications ||
            []
          );


    renderBoard(rows);

  } catch (error) {

    console.error(
      "Board error:",
      error
    );

    if (boardBody) {

      boardBody.innerHTML = `
        <div class="board-empty">
          Board unavailable.
        </div>
      `;

    }

  }

}


/* =========================================================
   BOARD SCROLL BUTTONS
========================================================= */

if (boardPrev) {

  boardPrev.addEventListener(
    "click",
    () => {

      if (!boardBody) {
        return;
      }

      boardBody.scrollBy({
        top: -250,
        behavior: "smooth"
      });

    }
  );

}


if (boardNext) {

  boardNext.addEventListener(
    "click",
    () => {

      if (!boardBody) {
        return;
      }

      boardBody.scrollBy({
        top: 250,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================================
   INITIALIZE
========================================================= */

renderCharacter();

loadBoard();
