// ===============================
// PAGE LOAD
// ===============================

window.addEventListener("load", () => {
  if (window.location.hash) {
    window.scrollTo(0, 0);
    history.replaceState(null, "", window.location.pathname);
  }
});


// ===============================
// CHARACTER SETS
// ===============================

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}~"
};


// ===============================
// ELEMENT REFERENCES
// ===============================

const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const optUpper = document.getElementById("optUpper");
const optLower = document.getElementById("optLower");
const optNumbers = document.getElementById("optNumbers");
const optSymbols = document.getElementById("optSymbols");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const passwordText = document.getElementById("passwordText");
const charCount = document.getElementById("charCount");

const errorMsg = document.getElementById("errorMsg");
const copiedMsg = document.getElementById("copiedMsg");

const strengthBars =
  document.querySelectorAll(".strength__bars .bar");

const strengthLabel =
  document.getElementById("strengthLabel");

let currentPassword = "";


// ===============================
// LENGTH SLIDER
// ===============================

lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});


// ===============================
// BUILD CHARACTER POOL
// ===============================

function buildCharPool() {

  let pool = "";

  if (optUpper.checked) {
    pool += CHARSETS.upper;
  }

  if (optLower.checked) {
    pool += CHARSETS.lower;
  }

  if (optNumbers.checked) {
    pool += CHARSETS.numbers;
  }

  if (optSymbols.checked) {
    pool += CHARSETS.symbols;
  }

  return pool;
}


// ===============================
// SECURE RANDOM CHARACTER
// ===============================

function getSecureRandomIndex(max) {

  if (max <= 0) {
    return 0;
  }

  const randomValues =
    new Uint32Array(1);

  const maxUint =
    0xffffffff;

  const limit =
    maxUint -
    ((maxUint + 1) % max);

  let randomNumber;

  do {
    window.crypto.getRandomValues(
      randomValues
    );

    randomNumber =
      randomValues[0];

  } while (
    randomNumber > limit
  );

  return randomNumber % max;
}


// ===============================
// GENERATE PASSWORD
// ===============================

function generatePassword(length, pool) {

  let result = "";

  for (let i = 0; i < length; i++) {

    const randomIndex =
      getSecureRandomIndex(
        pool.length
      );

    result +=
      pool[randomIndex];
  }

  return result;
}


// ===============================
// PASSWORD STRENGTH SCORE
// ===============================

function scorePassword(password) {

  let score = 0;

  // Length checks
  if (password.length >= 8) {
    score++;
  }

  if (password.length >= 12) {
    score++;
  }

  if (password.length >= 16) {
    score++;
  }


  // Character variety
  let varietyCount = 0;

  if (/[A-Z]/.test(password)) {
    varietyCount++;
  }

  if (/[a-z]/.test(password)) {
    varietyCount++;
  }

  if (/[0-9]/.test(password)) {
    varietyCount++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    varietyCount++;
  }


  if (varietyCount >= 3) {
    score++;
  }

  if (varietyCount === 4) {
    score++;
  }


  return Math.min(score, 4);
}


// ===============================
// UPDATE STRENGTH DISPLAY
// ===============================

function updateStrengthMeter(password) {

  const score =
    password
      ? scorePassword(password)
      : 0;

  let color =
    "var(--border)";

  let label = "—";


  if (score === 1) {

    color =
      "var(--weak)";

    label =
      "Weak";

  } else if (
    score === 2 ||
    score === 3
  ) {

    color =
      "var(--medium)";

    label =
      "Medium";

  } else if (
    score === 4
  ) {

    color =
      "var(--strong)";

    label =
      "Strong";
  }


  strengthBars.forEach(
    (bar, index) => {

      bar.style.background =
        index < score
          ? color
          : "var(--border)";
    }
  );


  strengthLabel.textContent =
    label;

  strengthLabel.style.color =
    score === 0
      ? "var(--text-muted)"
      : color;
}


// ===============================
// GENERATE BUTTON
// ===============================

generateBtn.addEventListener(
  "click",
  () => {

    const pool =
      buildCharPool();


    // No character type selected
    if (pool.length === 0) {

      errorMsg.classList.add(
        "show"
      );

      return;
    }


    errorMsg.classList.remove(
      "show"
    );


    const length =
      parseInt(
        lengthSlider.value,
        10
      );


    currentPassword =
      generatePassword(
        length,
        pool
      );


    passwordText.textContent =
      currentPassword;


    charCount.textContent =
      `${length} chars`;


    updateStrengthMeter(
      currentPassword
    );
  }
);


// ===============================
// COPY PASSWORD
// ===============================

copyBtn.addEventListener(
  "click",
  async () => {

    if (!currentPassword) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        currentPassword
      );


      copiedMsg.classList.add(
        "show"
      );


      setTimeout(
        () => {
          copiedMsg.classList.remove(
            "show"
          );
        },
        1500
      );

    } catch (error) {

      console.error(
        "Clipboard copy failed:",
        error
      );
    }
  }
);


// ===============================
// INITIAL STATE
// ===============================

lengthValue.textContent =
  lengthSlider.value;

updateStrengthMeter("");