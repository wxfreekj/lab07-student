/**
 * Lab 7 Main Script
 * Initializes all components for Air Masses and Fronts lab
 */

import { initializeMultiLineCanvas } from "./shared/components/multi-line-canvas.js?v=6";
import {
  exportLabAnswers,
  exportLabAnswersAsZip, // This is the new function we're importing
  clearLabForm,
} from "./shared/utils/form-exporter.js";
import { lab07Config } from "./lab07-config.js";

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize progress tracking
  initializeProgressTracking();

  // Initialize Surface Analysis Multi-Line Canvas (Question 3)
  initializeMultiLineCanvas(lab07Config.surfaceAnalysis);

  // Make export functions globally available to the HTML buttons
  // This function is now async because zip creation takes time
  window.exportAnswers = async () => {
    try {
      // Call the new zip export function instead of the old text-only one
      const filename = await exportLabAnswersAsZip(lab07Config);

      // Show a success message telling students what they got
      alert(
        "✅ Complete submission exported successfully!\n\n" +
          "File: " +
          filename +
          "\n\n" +
          "This zip file contains:\n" +
          "• Your answers (text file)\n" +
          "• Surface analysis drawing (PNG image)\n\n" +
          "Please upload ONLY this zip file to Canvas."
      );
    } catch (error) {
      // If something goes wrong, log it and show a helpful error message
      console.error("Export failed:", error);
      alert(
        "❌ There was an error creating the zip file. Please try again or contact your instructor."
      );
    }
  };

  window.clearForm = () => {
    clearLabForm();
  };
});

/**
 * Initialize progress bar tracking based on points
 * This calculates how much of the lab the student has completed
 */
function initializeProgressTracking() {
  function updateProgress() {
    let earnedPoints = 0;
    const totalPoints = 31; // 7 + 2 + 2 + 2 + 18

    // Question 1: 7 points (q1a through q1g for air mass identification)
    const q1Inputs = ["q1a", "q1b", "q1c", "q1d", "q1e", "q1f", "q1g"];
    let q1Complete = 0;
    q1Inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== "") q1Complete++;
    });
    // Award partial credit proportional to how many they completed
    earnedPoints += (q1Complete / q1Inputs.length) * 7;

    // Question 2a: 2 points (precipitation patterns)
    const q2a = document.getElementById("q2a");
    if (q2a && q2a.value.trim() !== "") earnedPoints += 2;

    // Question 2b: 2 points (steady precipitation)
    const q2b = document.getElementById("q2b");
    if (q2b && q2b.value.trim() !== "") earnedPoints += 2;

    // Question 2c: 2 points (wind direction shift)
    const q2c = document.getElementById("q2c");
    if (q2c && q2c.value.trim() !== "") earnedPoints += 2;

    // Question 3: 18 points (surface analysis drawing)
    // Check if the student has drawn anything on the canvas
    const canvas = document.querySelector("#draw-canvas-analysis");
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let hasDrawing = false;

        // Look through the canvas pixels to see if any are not white or transparent
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // If we find a non-white, non-transparent pixel, they've drawn something
          if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
            hasDrawing = true;
            break;
          }
        }

        if (hasDrawing) earnedPoints += 18;
      }
    }

    // Update the progress bar width based on percentage complete
    const progress = (earnedPoints / totalPoints) * 100;
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }
  }

  // Update progress whenever a dropdown selection changes
  const inputs = document.querySelectorAll("select");
  inputs.forEach((input) => {
    input.addEventListener("change", updateProgress);
  });

  // Update progress when the student draws on the canvas
  const checkCanvas = () => {
    const canvas = document.querySelector("#draw-canvas-analysis");
    if (canvas) {
      canvas.addEventListener("mouseup", updateProgress);
      canvas.addEventListener("touchend", updateProgress);
      const saveBtn = document.querySelector("#save-btn-analysis");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          setTimeout(updateProgress, 100);
        });
      }
    }
  };

  // Wait a second for the canvas component to fully initialize before attaching listeners
  setTimeout(checkCanvas, 1000);

  // Do an initial progress update
  updateProgress();

  // Check progress every 3 seconds in case we missed a canvas change
  setInterval(updateProgress, 3000);
}

// Prevent accidental page navigation when the student has unsaved work
window.addEventListener("beforeunload", function (e) {
  const inputs = document.querySelectorAll(
    'select, input[type="text"], input[type="number"], textarea'
  );
  let hasContent = false;
  inputs.forEach((input) => {
    if (input.value.trim() !== "") hasContent = true;
  });

  // If they have work entered, show the browser's "are you sure you want to leave" dialog
  if (hasContent) {
    e.preventDefault();
    e.returnValue = "";
  }
});
