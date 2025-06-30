const historyEl = document.querySelector(".history");
const resultEl = document.querySelector(".result");
const buttons = document.querySelectorAll(".btn");
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;

let history = "";
let current = "0";
let operator = "";
let resetNext = false;
let firstOperand = null;

// Função para formatar o número com separador de milhar de forma simples
function formatNumber(num) {
  if (num === "" || isNaN(num)) return "";
  let [int, dec] = num.toString().split(".");
  // Aqui usamos toLocaleString para separar os milhares
  int = Number(int).toLocaleString();
  return dec ? `${int}.${dec}` : int;
}

function updateDisplay() {
  historyEl.textContent = history;
  resultEl.textContent = formatNumber(current);
}

function clear() {
  history = "";
  current = "0";
  operator = "";
  resetNext = false;
  firstOperand = null;
  updateDisplay();
}

function inputNumber(num) {
  if (resetNext) {
    current = num === "." ? "0." : num;
    resetNext = false;
  } else if (num === ".") {
    if (!current.includes(".")) current += ".";
  } else {
    current = current === "0" ? num : current + num;
  }
  if (operator) {
    history = `${formatNumber(firstOperand)} ${operator} ${current}`;
  }
  updateDisplay();
}

function setOperator(op) {
  if (operator && !resetNext) {
    calculate();
  }
  firstOperand = parseFloat(current.replace(/[.,]/g, ""));
  operator = op;
  history = `${formatNumber(current)} ${operator}`;
  resetNext = true;
  updateDisplay();
}

function calculate() {
  if (operator === "") return;
  let prev = firstOperand;
  let curr = parseFloat(current.replace(/[.,]/g, ""));
  let result = 0;
  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "×":
      result = prev * curr;
      break;
    case "÷":
      result = curr === 0 ? "Erro" : prev / curr;
      break;
    default:
      return;
  }
  current = result.toString();
  history = "";
  operator = "";
  firstOperand = null;
  resetNext = true;
  updateDisplay();
}

function percent() {
  current = (parseFloat(current.replace(/[.,]/g, "")) / 100).toString();
  updateDisplay();
}

function invert() {
  current = (parseFloat(current.replace(/[.,]/g, "")) * -1).toString();
  updateDisplay();
}

function backspace() {
  if (resetNext) return;
  if (current.length > 1) {
    current = current.slice(0, -1);
    if (current === "-" || current === "") current = "0";
  } else {
    current = "0";
  }
  updateDisplay();
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim();
    if (!isNaN(text) || text === ".") {
      inputNumber(text);
    } else if (btn.classList.contains("btn-func")) {
      if (text === "C") clear();
      else if (text === "+/-") invert();
      else if (text === "%") percent();
    } else if (btn.classList.contains("btn-op")) {
      setOperator(text);
    } else if (btn.classList.contains("btn-eq")) {
      calculate();
    } else if (text === "⌫") {
      backspace();
    }
  });
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
});

clear();
