/**
 * Lab 7 Main Script
 * Initializes all components for Air Masses and Fronts lab
 */

import { initializeMultiLineCanvas } from "./shared/components/multi-line-canvas.js?v=6";
import {
  exportLabAnswers,
  clearLabForm,
} from "./shared/utils/form-exporter.js";
import { lab07Config } from "./lab07-config.js";

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize progress tracking
  initializeProgressTracking();

  // Initialize Surface Analysis Multi-Line Canvas (Question 3)
  initializeMultiLineCanvas(lab07Config.surfaceAnalysis);

  // Make export functions globally available
  window.exportAnswers = () => {
    const filename = exportLabAnswers(lab07Config);
    alert(
      "✅ Answers exported successfully!\n\nFile: " +
        filename +
        "\n\nPlease submit this file AND your surface analysis image (Question 3) to Canvas."
    );
  };

  window.clearForm = () => {
    clearLabForm();
  };
});

/**
 * Initialize progress bar tracking based on points
 */
function initializeProgressTracking() {
  function updateProgress() {
    let earnedPoints = 0;
    const totalPoints = 31; // 7 + 2 + 2 + 2 + 18

    // Question 1: 7 points (q1a through q1g)
    const q1Inputs = ["q1a", "q1b", "q1c", "q1d", "q1e", "q1f", "q1g"];
    let q1Complete = 0;
    q1Inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== "") q1Complete++;
    });
    // Award partial credit: (completed/total) * 7 points
    earnedPoints += (q1Complete / q1Inputs.length) * 7;

    // Question 2a: 2 points
    const q2a = document.getElementById("q2a");
    if (q2a && q2a.value.trim() !== "") earnedPoints += 2;

    // Question 2b: 2 points
    const q2b = document.getElementById("q2b");
    if (q2b && q2b.value.trim() !== "") earnedPoints += 2;

    // Question 2c: 2 points
    const q2c = document.getElementById("q2c");
    if (q2c && q2c.value.trim() !== "") earnedPoints += 2;

    // Question 3: 18 points (surface analysis drawing)
    // Check if canvas has been drawn on
    const canvas = document.querySelector("#draw-canvas-analysis");
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let hasDrawing = false;

        // Check if any non-white/non-transparent pixels exist
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // If pixel is not white (255,255,255) or not fully transparent (a=0)
          if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
            hasDrawing = true;
            break;
          }
        }

        if (hasDrawing) earnedPoints += 18;
      }
    }

    const progress = (earnedPoints / totalPoints) * 100;
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }
  }

  // Update on input changes
  const inputs = document.querySelectorAll("select");
  inputs.forEach((input) => {
    input.addEventListener("change", updateProgress);
  });

  // Update when canvas is drawn on
  const checkCanvas = () => {
    const canvas = document.querySelector("#draw-canvas-analysis");
    if (canvas) {
      canvas.addEventListener("mouseup", updateProgress);
      canvas.addEventListener("touchend", updateProgress);
      // Also listen for the save button
      const saveBtn = document.querySelector("#save-btn-analysis");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          setTimeout(updateProgress, 100);
        });
      }
    }
  };

  // Wait for canvas to be created by the component
  setTimeout(checkCanvas, 1000);

  // Initial update
  updateProgress();

  // Periodic update to catch canvas changes
  setInterval(updateProgress, 3000);
}

// Prevent accidental page navigation
window.addEventListener("beforeunload", function (e) {
  const inputs = document.querySelectorAll(
    'select, input[type="text"], input[type="number"], textarea'
  );
  let hasContent = false;
  inputs.forEach((input) => {
    if (input.value.trim() !== "") hasContent = true;
  });

  if (hasContent) {
    e.preventDefault();
    e.returnValue = "";
  }
});
