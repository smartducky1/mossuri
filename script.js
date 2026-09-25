/* =========================================================
   MOSSURI
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

let selected = 0;


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);


function validEvm(wallet) {
  return /^0x[a-fA-F0-9]{40}$/.test(
    wallet.trim()
  );
}


function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[char]
  );
}


function toast(message) {
  const element = $("toast");

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    element.classList.remove("show");
  }, 2400);
}


/* =========================================================
   CHARACTER SELECTOR
   ========================================================= */

function renderCharacter() {

  const character = characters[selected];

  $("selectorImage").src = character.file;

  $("selectorImage").alt =
    `${character.name} personality`;

  $("personalityImage").src =
    character.file;

  $("personalityImage").alt =
    `${character.name} personality`;

  $("personalityName").textContent =
    character.name;
}


$("prevChar").addEventListener(
  "click",
  () => {

    selected =
      (selected - 1 + characters.length)
      % characters.length;

    renderCharacter();
  }
);


$("nextChar").addEventListener(
  "click",
  () => {

    selected =
      (selected + 1)
      % characters.length;

    renderCharacter();
  }
);


/* =========================================================
   DOWNLOAD CHARACTER
   ========================================================= */

$("downloadBtn").addEventListener(
  "click",
  async () => {

    const character =
      characters[selected];

    try {

      const response =
        await fetch(character.file);

      const blob =
        await response.blob();

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `MOSSURI-${character.name}.jpg`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

    } catch (error) {

      window.open(
        character.file,
        "_blank"
      );
    }
  }
);


/* =========================================================
   X TASKS
   ========================================================= */

const X_URL =
  "https://x.com/mossuris";


document.querySelectorAll(
  'a[href="https://x.com/mossuris"]'
).forEach((link) => {

  link.addEventListener(
    "click",
    () => {
      // Normal link behaviour.
    }
  );

});


/* =========================================================
   WALLET CHECKER
   ========================================================= */

async function checkWallet() {

  const wallet =
    $("checkWallet")
      .value
      .trim();

  const result =
    $("checkResult");

  if (!validEvm(wallet)) {

    result.textContent =
      "🔴 NO — wallet is not on the list";

    result.className =
      "status-result no";

    return;
  }

  result.textContent =
    "CHECKING...";

  result.className =
    "status-result";


  try {

    const response =
      await fetch(
        "/api/check",
        {
          method: "POST",

          headers: {
            "content-type":
              "application/json"
          },

          body: JSON.stringify({
            wallet
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to check wallet"
      );
    }


    if (data.onList) {

      result.textContent =
        "🟢 YES — wallet is on the list";

      result.className =
        "status-result yes";

    } else {

      result.textContent =
        "🔴 NO — wallet is not on the list";

      result.className =
        "status-result no";
    }

  } catch (error) {

    result.textContent =
      "🔴 NO — wallet is not on the list";

    result.className =
      "status-result no";
  }
}


$("checkBtn").addEventListener(
  "click",
  checkWallet
);


$("checkWallet").addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      event.preventDefault();

      checkWallet();
    }
  }
);


/* =========================================================
   SUCCESS POPUP
   ========================================================= */

function showSuccess() {

  /*
   * Always use the supplied success-popup image.
   * Add cache-busting so browser caching doesn't
   * cause an old broken image to remain visible.
   */

  const image =
    $("successImage");

  image.src =
    `/assets/success-popup.png?v=${Date.now()}`;

  $("successOverlay").hidden = false;
}


function closeSuccess() {

  $("successOverlay").hidden = true;
}


$("closeSuccess").addEventListener(
  "click",
  closeSuccess
);


$("successOverlay").addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      $("successOverlay")
    ) {
      closeSuccess();
    }
  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      !$("successOverlay").hidden
    ) {
      closeSuccess();
    }
  }
);


/* =========================================================
   REGISTER / SUBMIT
   ========================================================= */

async function register(event) {

  event.preventDefault();


  const username =
    $("username")
      .value
      .trim()
      .replace(/^@/, "");


  const wallet =
    $("wallet")
      .value
      .trim();


  const quoteUrl =
    $("quoteUrl")
      .value
      .trim();


  const tagUrl =
    $("tagUrl")
      .value
      .trim();


  const serverError =
    $("serverError");


  serverError.textContent = "";


  if (!username) {

    toast(
      "Enter your X username"
    );

    $("username").focus();

    return;
  }


  if (!validEvm(wallet)) {

    toast(
      "Enter a valid EVM wallet"
    );

    $("wallet").focus();

    return;
  }


  if (!quoteUrl) {

    toast(
      "Add your Quote Tweet link"
    );

    $("quoteUrl").focus();

    return;
  }


  if (!tagUrl) {

    toast(
      "Add your comment link"
    );

    $("tagUrl").focus();

    return;
  }


  const button =
    $("registerBtn");

  button.disabled = true;

  button.textContent =
    "SENDING...";


  try {

    const payload = {

      username,

      wallet,

      personality:
        characters[selected].name,

      quoteUrl,

      tagUrl

    };


    const response =
      await fetch(
        "/api/submit",
        {
          method: "POST",

          headers: {
            "content-type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );


    let data = {};

    try {

      data =
        await response.json();

    } catch {
      data = {};
    }


    if (
      !response.ok ||
      !data.ok
    ) {

      throw new Error(
        data.error ||
        "Could not save your application."
      );
    }


    /*
     * Clear form.
     */

    $("username").value = "";

    $("wallet").value = "";

    $("quoteUrl").value = "";

    $("tagUrl").value = "";


    /*
     * Show success popup.
     */

    showSuccess();


    /*
     * Refresh board.
     */

    await loadBoard();


  } catch (error) {

    const message =
      error.message ||
      "Could not save your application.";

    serverError.textContent =
      message;

    toast(message);

  } finally {

    button.disabled = false;

    button.textContent =
      "REGISTER";
  }
}


$("applicationForm").addEventListener(
  "submit",
  register
);


/* =========================================================
   MOSSURIS BOARD
   ========================================================= */

async function loadBoard() {

  const container =
    $("boardRows");


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


    if (
      !response.ok ||
      !data.ok
    ) {
      throw new Error(
        data.error ||
        "Could not load board"
      );
    }


    const rows =
      Array.isArray(data.rows)
        ? data.rows
        : [];


    if (!rows.length) {

      container.innerHTML = `
        <div class="tr">
          <span>—</span>
          <span>—</span>
          <span>—</span>
        </div>
      `;

      return;
    }


    container.innerHTML =
      rows
        .map((row) => {

          return `
            <div class="tr">

              <span>
                ${escapeHtml(
                  row.username ||
                  row.xUsername ||
                  ""
                )}
              </span>

              <span>
                ${escapeHtml(
                  row.wallet ||
                  ""
                )}
              </span>

              <span>
                ${escapeHtml(
                  row.personality ||
                  ""
                )}
              </span>

            </div>
          `;

        })
        .join("");


  } catch (error) {

    /*
     * Keep board empty if the API
     * isn't configured yet.
     */

    container.innerHTML = "";
  }
}


/* =========================================================
   BOARD SCROLL BUTTONS
   ========================================================= */

$("boardUp").addEventListener(
  "click",
  () => {

    $("boardRows").scrollBy({
      top: -220,
      behavior: "smooth"
    });
  }
);


$("boardDown").addEventListener(
  "click",
  () => {

    $("boardRows").scrollBy({
      top: 220,
      behavior: "smooth"
    });
  }
);


/* =========================================================
   START
   ========================================================= */

renderCharacter();

loadBoard();
