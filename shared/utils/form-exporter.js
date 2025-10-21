/**
 * Generic form export utility for lab assignments
 */

/**
 * Export lab answers to a text file for Canvas submission
 * This is the original text-only export method
 * @param {Object} config - Lab configuration object
 * @returns {string} - Filename of the exported file
 */
export function exportLabAnswers(config) {
  const { labNumber, labName, totalPoints, questions } = config;

  let output = "";
  output += `ASSIGNMENT=${labName}\n`;
  output += `LAB_NUMBER=${labNumber}\n`;
  output += `DATE=${new Date().toISOString()}\n`;
  output += `TOTAL_POINTS=${totalPoints}\n`;
  output += "---BEGIN_ANSWERS---\n";

  // Export each question from the config
  questions.forEach((q) => {
    if (q.id) {
      const element = document.getElementById(q.id);
      if (element) {
        output += `${q.key}=${element.value}\n`;
      }
    } else if (q.note) {
      output += `${q.key}=${q.note}\n`;
    }
  });

  output += "---END_ANSWERS---\n";
  output += "\nIMPORTANT: Please also upload any required images to Canvas.\n";

  // Create a blob (binary data) from the text content
  const blob = new Blob([output], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const filename = `Lab${labNumber}_Answers_${Date.now()}.txt`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Export lab answers AND images as a single ZIP file for Canvas submission
 * This function creates a zip containing the text file and any canvas drawings
 * @param {Object} config - Lab configuration object
 * @returns {Promise<string>} - Filename of the exported zip file
 */
export async function exportLabAnswersAsZip(config) {
  const { labNumber, labName, totalPoints, questions } = config;

  // First, check if the JSZip library is available in the browser
  if (typeof JSZip === "undefined") {
    alert(
      "Error: JSZip library not loaded. Please refresh the page and try again."
    );
    throw new Error("JSZip not available");
  }

  // Create a new empty zip file that we'll add files to
  const zip = new JSZip();

  // Step 1: Create the text file with all the student's answers
  let textContent = "";
  textContent += `ASSIGNMENT=${labName}\n`;
  textContent += `LAB_NUMBER=${labNumber}\n`;
  textContent += `DATE=${new Date().toISOString()}\n`;
  textContent += `TOTAL_POINTS=${totalPoints}\n`;
  textContent += "---BEGIN_ANSWERS---\n";

  // Loop through each question in the configuration and get its value
  questions.forEach((q) => {
    if (q.id) {
      const element = document.getElementById(q.id);
      if (element) {
        textContent += `${q.key}=${element.value}\n`;
      }
    } else if (q.note) {
      textContent += `${q.key}=${q.note}\n`;
    }
  });

  textContent += "---END_ANSWERS---\n";

  // Add the text file to the zip with the lab name as the filename
  zip.file(`${labName}.txt`, textContent);

  // Step 2: Capture the surface analysis canvas drawing and add it to the zip
  try {
    // Find the canvas where the student drew their surface analysis
    const analysisCanvas = document.getElementById("draw-canvas-analysis");
    const analysisImg = document.getElementById("bg-img-analysis");

    // Only proceed if both the canvas and background image exist
    if (analysisCanvas && analysisImg) {
      // Merge the background image with the student's drawing
      const mergedCanvas = mergeCanvasWithImage(analysisCanvas, analysisImg);

      // Convert the merged canvas to a PNG image in base64 format
      // The split removes the "data:image/png;base64," prefix
      const imageData = mergedCanvas.toDataURL("image/png").split(",")[1];

      // Add the PNG image to the zip file
      zip.file("Lab07_SurfaceAnalysis.png", imageData, { base64: true });
    }
  } catch (error) {
    // If something goes wrong capturing the image, log it but continue
    // This way the student still gets a zip with their text answers
    console.warn("Could not capture surface analysis:", error);
  }

  // Step 3: Generate the actual zip file and trigger a download
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;

  // Create a filename with leading zero for single-digit lab numbers
  const filename = `Lab${
    labNumber < 10 ? "0" + labNumber : labNumber
  }_Complete_Submission.zip`;
  link.download = filename;

  // Programmatically click the link to start the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Helper function to merge a canvas drawing with its background image
 * This creates a new canvas that has both the map and the student's lines
 * @param {HTMLCanvasElement} canvas - The drawing canvas with student's work
 * @param {HTMLImageElement} img - The background map image
 * @returns {HTMLCanvasElement} - A new canvas with both layers merged
 */
function mergeCanvasWithImage(canvas, img) {
  // Create a temporary canvas for merging
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext("2d");

  // Draw the background map image first
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Draw the student's drawing on top of the background
  ctx.drawImage(canvas, 0, 0);

  return tempCanvas;
}

/**
 * Clear all form inputs with user confirmation
 * This is used by the "Clear All Answers" button
 */
export function clearLabForm() {
  if (
    confirm(
      "⚠️ Are you sure you want to clear all answers? This cannot be undone."
    )
  ) {
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="number"], select, textarea'
    );
    inputs.forEach((input) => {
      input.value = "";
    });

    // Trigger change events so the progress bar updates
    inputs.forEach((input) => {
      input.dispatchEvent(new Event("change"));
    });

    alert("✅ All answers have been cleared.");
  }
}
