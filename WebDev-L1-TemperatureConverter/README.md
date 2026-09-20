# WebDev-L1-TemperatureConverter — Scientific Temperature Converter

> **OIBSIP Track**: Web Development & Designing  
> **Level**: 1 | **Task**: 3  
> **Tech Stack**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules & Pure Functions)

---

## 📌 Project Overview
An interactive temperature conversion utility capable of instantaneous bidirectional conversion between Celsius (°C), Fahrenheit (°F), and Kelvin (K). Built with strict thermodynamic boundaries (absolute zero rejection), pure math functions, and formula breakdown reporting.

---

## 🎯 Acceptance Criteria & Checklist
- [x] **Numeric Temperature Input**: Supports positive, negative, and decimal floats.
- [x] **Unit Selector**: Seamless dropdown switching between Celsius, Fahrenheit, and Kelvin.
- [x] **Simultaneous Multi-Unit Output**: Renders all 3 units concurrently without requiring repetitive recalculations.
- [x] **Thermodynamic Boundary Protection (Absolute Zero)**:
  - Rejects Celsius values below `-273.15 °C`.
  - Rejects Fahrenheit values below `-459.67 °F`.
  - Rejects Kelvin values below `0 K`.
  - Displays user-friendly scientific explanation in an alert banner.
- [x] **Non-Numeric Validation**: Rejects non-finite values and empty submissions.
- [x] **Mathematical Transparency**: Shows step-by-step formula breakdown used for the conversion.
- [x] **Sensory Thermal Category**: Visual badge displaying state (e.g. Freezing, Room Temp, Boiling).
- [x] **Quick Reference Presets**: Instant one-click presets for Freezing (0°C), Room Temp (25°C), Human Body (37°C), and Boiling (100°C).

---

## 📐 Formulas Applied
| From / To | Formula |
|---|---|
| **Celsius to Fahrenheit** | `°F = (°C × 9/5) + 32` |
| **Celsius to Kelvin** | `K = °C + 273.15` |
| **Fahrenheit to Celsius** | `°C = (°F - 32) × 5/9` |
| **Fahrenheit to Kelvin** | `K = (°F - 32) × 5/9 + 273.15` |
| **Kelvin to Celsius** | `°C = K - 273.15` |
| **Kelvin to Fahrenheit** | `°F = (K - 273.15) × 9/5 + 32` |

---

## 🚀 How to Run Locally
Open `WebDev-L1-TemperatureConverter/index.html` directly in your browser.
