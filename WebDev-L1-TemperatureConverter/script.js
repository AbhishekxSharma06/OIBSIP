/**
 * OIBSIP Level 1 Task 3: Temperature Converter
 * Pure mathematical conversion functions, strict input validation,
 * absolute-zero physical boundary enforcement, and clear formula reporting.
 */

(() => {
  'use strict';

  // Physical constants - Absolute Zero boundaries
  const ABSOLUTE_ZERO = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0
  };

  // Pure conversion formulas
  const Conversions = {
    fromCelsius(c) {
      const fahrenheit = (c * 9) / 5 + 32;
      const kelvin = c + 273.15;
      return {
        celsius: c,
        fahrenheit,
        kelvin,
        formula: `[°F] = (${c} × 9/5) + 32 = ${fahrenheit.toFixed(2)} °F | [K] = ${c} + 273.15 = ${kelvin.toFixed(2)} K`
      };
    },

    fromFahrenheit(f) {
      const celsius = ((f - 32) * 5) / 9;
      const kelvin = celsius + 273.15;
      return {
        celsius,
        fahrenheit: f,
        kelvin,
        formula: `[°C] = (${f} - 32) × 5/9 = ${celsius.toFixed(2)} °C | [K] = (${f} - 32) × 5/9 + 273.15 = ${kelvin.toFixed(2)} K`
      };
    },

    fromKelvin(k) {
      const celsius = k - 273.15;
      const fahrenheit = (celsius * 9) / 5 + 32;
      return {
        celsius,
        fahrenheit,
        kelvin: k,
        formula: `[°C] = ${k} - 273.15 = ${celsius.toFixed(2)} °C | [°F] = (${k} - 273.15) × 9/5 + 32 = ${fahrenheit.toFixed(2)} °F`
      };
    }
  };

  // DOM Elements
  const form = document.getElementById('converterForm');
  const tempInput = document.getElementById('tempInput');
  const sourceUnit = document.getElementById('sourceUnit');
  const activeUnitSymbol = document.getElementById('activeUnitSymbol');
  const errorBanner = document.getElementById('errorBanner');
  const errorTitle = document.getElementById('errorTitle');
  const errorMessage = document.getElementById('errorMessage');
  const resetBtn = document.getElementById('resetBtn');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Result tiles
  const resCelsius = document.getElementById('resCelsius');
  const resFahrenheit = document.getElementById('resFahrenheit');
  const resKelvin = document.getElementById('resKelvin');
  const formulaMath = document.getElementById('formulaMath');
  const thermalCategory = document.getElementById('thermalCategory');

  // Highlight tile elements
  const tileCelsius = document.getElementById('tileCelsius');
  const tileFahrenheit = document.getElementById('tileFahrenheit');
  const tileKelvin = document.getElementById('tileKelvin');

  /**
   * Update active unit indicator symbol in input box
   */
  function updateUnitSymbol() {
    const symbols = {
      celsius: '°C',
      fahrenheit: '°F',
      kelvin: 'K'
    };
    activeUnitSymbol.textContent = symbols[sourceUnit.value] || '°C';
    clearError();
  }

  /**
   * Display an accessible error message in the banner
   */
  function showError(title, message) {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorBanner.hidden = false;
    tempInput.classList.add('input-error');
  }

  /**
   * Clear any active error banner
   */
  function clearError() {
    errorBanner.hidden = true;
    tempInput.classList.remove('input-error');
  }

  /**
   * Format numbers to clean decimal representations
   */
  function formatNumber(num) {
    // Show up to 2 decimals, avoid trailing .00
    return parseFloat(num.toFixed(2)).toLocaleString('en-US');
  }

  /**
   * Determine sensory thermal category based on Celsius equivalent
   */
  function getThermalCategory(celsius) {
    if (celsius <= 0) return '❄️ Freezing / Sub-Zero';
    if (celsius <= 15) return '🧥 Chilly';
    if (celsius <= 25) return '🌿 Comfortable / Room Temp';
    if (celsius <= 37) return '☀️ Warm';
    if (celsius < 100) return '🔥 Very Hot';
    return '💨 Vaporizing / Boiling';
  }

  /**
   * Main Conversion Workflow
   */
  function performConversion() {
    clearError();

    const rawValue = tempInput.value.trim();

    // 1. Check for empty input
    if (rawValue === '') {
      showError('Missing Input', 'Please enter a numeric temperature value to convert.');
      return;
    }

    // 2. Validate numeric input
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      showError('Invalid Format', 'Please enter a valid finite number (e.g. -15, 0, 98.6).');
      return;
    }

    const unit = sourceUnit.value;
    const minAllowed = ABSOLUTE_ZERO[unit];

    // 3. Physical Absolute Zero check
    if (numericValue < minAllowed) {
      const unitLabels = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
      showError(
        'Absolute Zero Violation',
        `Physically impossible temperature. The universe minimum for ${unit} is ${minAllowed} ${unitLabels[unit]}.`
      );
      return;
    }

    // 4. Calculate conversions
    let results;
    if (unit === 'celsius') {
      results = Conversions.fromCelsius(numericValue);
    } else if (unit === 'fahrenheit') {
      results = Conversions.fromFahrenheit(numericValue);
    } else {
      results = Conversions.fromKelvin(numericValue);
    }

    // 5. Render outputs
    resCelsius.textContent = formatNumber(results.celsius);
    resFahrenheit.textContent = formatNumber(results.fahrenheit);
    resKelvin.textContent = formatNumber(results.kelvin);
    formulaMath.textContent = results.formula;
    thermalCategory.textContent = getThermalCategory(results.celsius);

    // 6. Highlight active source unit tile
    tileCelsius.classList.toggle('active-source', unit === 'celsius');
    tileFahrenheit.classList.toggle('active-source', unit === 'fahrenheit');
    tileKelvin.classList.toggle('active-source', unit === 'kelvin');
  }

  /**
   * Reset form state and results
   */
  function handleReset() {
    form.reset();
    clearError();
    updateUnitSymbol();
    resCelsius.textContent = '—';
    resFahrenheit.textContent = '—';
    resKelvin.textContent = '—';
    formulaMath.textContent = 'Submit a temperature value to review mathematical derivation steps.';
    thermalCategory.textContent = 'Thermal State: Normal';
    tileCelsius.classList.remove('active-source');
    tileFahrenheit.classList.remove('active-source');
    tileKelvin.classList.remove('active-source');
    tempInput.focus();
  }

  // Event Listeners
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    performConversion();
  });

  sourceUnit.addEventListener('change', () => {
    updateUnitSymbol();
    if (tempInput.value.trim() !== '') {
      performConversion();
    }
  });

  tempInput.addEventListener('input', () => {
    clearError();
  });

  resetBtn.addEventListener('click', handleReset);

  // Preset button clicks
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tempInput.value = btn.getAttribute('data-val');
      sourceUnit.value = btn.getAttribute('data-unit');
      updateUnitSymbol();
      performConversion();
    });
  });

  // Initialize on page load
  updateUnitSymbol();
})();
