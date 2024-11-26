import { CountryCurrencyMapping } from "./code.js";

// API URL and Key
const API_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_LZn98rgYfwgZS7uYX0SOfjZKgyf8isYoeuqN90QV";

// DOM Elements
const fromSelect = document.querySelector("select[name='from']");
const toSelect = document.querySelector("select[name='to']");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");
const amountInput = document.querySelector(".amount input");
const msgDiv = document.querySelector(".msg");
const button = document.querySelector("button");

// Exchange rate data
let exchangeRates = {};

// Fetch and populate currencies
async function fetchCurrencies() {
  try {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}`);
    const data = await response.json();

    exchangeRates = data.data; // Store the fetched exchange rates
    const currencies = Object.keys(exchangeRates);

    populateDropdowns(currencies);
    updateFlagsAndRate(); // Update flags and rate for default values
  } catch (error) {
    console.error("Error fetching currencies:", error);
    msgDiv.textContent = "Failed to load currencies.";
  }
}

// Populate dropdowns
function populateDropdowns(currencies) {
  currencies.forEach((currency) => {
    const fromOption = document.createElement("option");
    fromOption.value = currency;
    fromOption.textContent = currency;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = currency;
    toOption.textContent = currency;
    toSelect.appendChild(toOption);
  });

  // Set default values
  fromSelect.value = "USD";
  toSelect.value = "INR";
}

// Update flags and exchange rate
function updateFlagsAndRate() {
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  // Update flags
  if (CountryCurrencyMapping[fromCurrency]) {
    fromFlag.src = `https://flagsapi.com/${CountryCurrencyMapping[fromCurrency]}/flat/64.png`;
  } else {
    fromFlag.src = "https://via.placeholder.com/64"; // Placeholder if no flag is found
  }

  if (CountryCurrencyMapping[toCurrency]) {
    toFlag.src = `https://flagsapi.com/${CountryCurrencyMapping[toCurrency]}/flat/64.png`;
  } else {
    toFlag.src = "https://via.placeholder.com/64"; // Placeholder if no flag is found
  }

  // Update exchange rate
  if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const exchangeRate = toRate / fromRate;

    msgDiv.textContent = `1 ${fromCurrency} = ${exchangeRate.toFixed(
      2
    )} ${toCurrency}`;
  } else {
    msgDiv.textContent = "Exchange rate unavailable.";
  }
}

// Handle conversion
function handleConversion(event) {
  event.preventDefault();

  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    msgDiv.textContent = "Please enter a valid amount.";
    return;
  }

  if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const exchangeRate = toRate / fromRate;
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    msgDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } else {
    msgDiv.textContent = "Conversion failed.";
  }
}

// Event Listeners
fromSelect.addEventListener("change", updateFlagsAndRate);
toSelect.addEventListener("change", updateFlagsAndRate);
button.addEventListener("click", handleConversion);

// Initialize
fetchCurrencies();
