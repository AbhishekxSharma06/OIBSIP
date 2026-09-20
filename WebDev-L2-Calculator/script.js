/**
 * OIBSIP Level 2 Task 1: Scientific/Standard Calculator
 * Robust finite state machine avoiding eval(). Handles operation chaining,
 * floating-point precision, division-by-zero, and keyboard listeners.
 */

(() => {
  'use strict';

  // Calculator State Machine
  const calculatorState = {
    currentValue: '0',
    storedValue: null,
    operator: null,
    waitingForSecondOperand: false,
    hasError: false
  };

  // DOM Elements
  const screenPrimary = document.getElementById('screenPrimary');
  const screenHistory = document.getElementById('screenHistory');
  const keypad = document.getElementById('keypad');

  /**
   * Safe Arithmetic Operations Engine (Explicitly No eval())
   */
  const Operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => {
      if (b === 0) {
        throw new Error('Cannot divide by zero');
      }
      return a / b;
    }
  };

  /**
   * Helper to format floating point math cleanly (avoids 0.1 + 0.2 = 0.30000000000000004)
   */
  function cleanFloat(number) {
    // Limit precision to 10 decimals, remove unnecessary trailing zeros
    const rounded = parseFloat(number.toFixed(10));
    // If very long number or scientific notation needed
    if (Math.abs(rounded) > 1e12) {
      return rounded.toExponential(4);
    }
    return String(rounded);
  }

  /**
   * Updates the UI display screen
   */
  function updateDisplay() {
    if (calculatorState.hasError) {
      screenPrimary.textContent = calculatorState.currentValue;
      screenPrimary.classList.add('error-state');
      screenHistory.textContent = 'Math Error';
      return;
    }

    screenPrimary.classList.remove('error-state');
    screenPrimary.textContent = calculatorState.currentValue;

    // Build human-readable history string
    if (calculatorState.storedValue !== null && calculatorState.operator) {
      const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      screenHistory.textContent = `${calculatorState.storedValue} ${opSymbols[calculatorState.operator] || calculatorState.operator}`;
    } else {
      screenHistory.textContent = '';
    }

    // Highlight active operator key on keypad
    document.querySelectorAll('.key-operator').forEach(btn => {
      const btnOp = btn.getAttribute('data-value');
      btn.classList.toggle('active-op', btnOp === calculatorState.operator && calculatorState.waitingForSecondOperand);
    });
  }

  /**
   * Input a numeric digit (0-9)
   */
  function inputDigit(digit) {
    if (calculatorState.hasError) {
      clearAll();
    }

    if (calculatorState.waitingForSecondOperand) {
      calculatorState.currentValue = String(digit);
      calculatorState.waitingForSecondOperand = false;
    } else {
      calculatorState.currentValue =
        calculatorState.currentValue === '0' ? String(digit) : calculatorState.currentValue + digit;
    }

    updateDisplay();
  }

  /**
   * Input decimal point
   */
  function inputDecimal() {
    if (calculatorState.hasError) {
      clearAll();
    }

    if (calculatorState.waitingForSecondOperand) {
      calculatorState.currentValue = '0.';
      calculatorState.waitingForSecondOperand = false;
      updateDisplay();
      return;
    }

    if (!calculatorState.currentValue.includes('.')) {
      calculatorState.currentValue += '.';
      updateDisplay();
    }
  }

  /**
   * Delete / Backspace the last typed character
   */
  function deleteLastDigit() {
    if (calculatorState.hasError || calculatorState.waitingForSecondOperand) {
      return;
    }

    if (calculatorState.currentValue.length > 1) {
      calculatorState.currentValue = calculatorState.currentValue.slice(0, -1);
    } else {
      calculatorState.currentValue = '0';
    }

    updateDisplay();
  }

  /**
   * Clear entire calculator state (AC)
   */
  function clearAll() {
    calculatorState.currentValue = '0';
    calculatorState.storedValue = null;
    calculatorState.operator = null;
    calculatorState.waitingForSecondOperand = false;
    calculatorState.hasError = false;
    updateDisplay();
  }

  /**
   * Toggle positive / negative sign
   */
  function toggleSign() {
    if (calculatorState.hasError || calculatorState.currentValue === '0') return;

    if (calculatorState.currentValue.startsWith('-')) {
      calculatorState.currentValue = calculatorState.currentValue.slice(1);
    } else {
      calculatorState.currentValue = '-' + calculatorState.currentValue;
    }

    updateDisplay();
  }

  /**
   * Compute percentage of current number
   */
  function calculatePercent() {
    if (calculatorState.hasError) return;
    const val = parseFloat(calculatorState.currentValue);
    if (Number.isFinite(val)) {
      calculatorState.currentValue = cleanFloat(val / 100);
      updateDisplay();
    }
  }

  /**
   * Handles binary operators (+, -, *, /) and chains previous calculations
   */
  function handleOperator(nextOperator) {
    if (calculatorState.hasError) {
      clearAll();
    }

    const inputValue = parseFloat(calculatorState.currentValue);

    // If an operator is already set and user is still waiting for input, allow switching operator
    if (calculatorState.operator && calculatorState.waitingForSecondOperand) {
      calculatorState.operator = nextOperator;
      updateDisplay();
      return;
    }

    // If no previous value, store current as first operand
    if (calculatorState.storedValue === null && !isNaN(inputValue)) {
      calculatorState.storedValue = inputValue;
    } else if (calculatorState.operator) {
      // Operation chaining: evaluate previous pair
      try {
        const computation = Operations[calculatorState.operator](calculatorState.storedValue, inputValue);
        calculatorState.currentValue = cleanFloat(computation);
        calculatorState.storedValue = computation;
      } catch (err) {
        calculatorState.hasError = true;
        calculatorState.currentValue = err.message || 'Error';
        updateDisplay();
        return;
      }
    }

    calculatorState.waitingForSecondOperand = true;
    calculatorState.operator = nextOperator;
    updateDisplay();
  }

  /**
   * Evaluates final calculation on Equals click
   */
  function handleEquals() {
    if (calculatorState.hasError || !calculatorState.operator || calculatorState.storedValue === null) {
      return;
    }

    const inputValue = parseFloat(calculatorState.currentValue);

    try {
      const result = Operations[calculatorState.operator](calculatorState.storedValue, inputValue);
      screenHistory.textContent = `${calculatorState.storedValue} ${calculatorState.operator} ${inputValue} =`;
      calculatorState.currentValue = cleanFloat(result);
      calculatorState.storedValue = null;
      calculatorState.operator = null;
      calculatorState.waitingForSecondOperand = true;
    } catch (err) {
      calculatorState.hasError = true;
      calculatorState.currentValue = err.message || 'Error';
    }

    updateDisplay();
  }

  /**
   * Button Click Dispatcher
   */
  keypad.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const val = btn.getAttribute('data-value');

    switch (action) {
      case 'digit':
        inputDigit(val);
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'operator':
        handleOperator(val);
        break;
      case 'calculate':
        handleEquals();
        break;
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLastDigit();
        break;
      case 'negate':
        toggleSign();
        break;
      case 'percent':
        calculatePercent();
        break;
      default:
        break;
    }
  });

  /**
   * Keyboard Navigation Support
   */
  window.addEventListener('keydown', (event) => {
    const { key } = event;

    if (key >= '0' && key <= '9') {
      event.preventDefault();
      inputDigit(key);
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      event.preventDefault();
      handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleEquals();
    } else if (key === 'Backspace') {
      event.preventDefault();
      deleteLastDigit();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      event.preventDefault();
      clearAll();
    }
  });

  // Initialize display
  updateDisplay();
})();
