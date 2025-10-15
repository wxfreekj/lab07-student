/**
 * Lab 7 Configuration
 * Air Masses and Fronts - Surface Analysis
 */

export const lab07Config = {
  labNumber: 7,
  labName: "Lab07_AirMassesAndFronts",
  totalPoints: 30,

  // Multi-Line Canvas Configuration for Surface Analysis (Question 3)
  surfaceAnalysis: {
    canvasId: "draw-canvas-analysis",
    imageId: "bg-img-analysis",
    selectId: "line-select-analysis",
    undoLastBtnId: "undo-last-btn-analysis",
    undoAllBtnId: "undo-all-btn-analysis",
    saveBtnId: "save-btn-analysis",
    saveFilename: "Lab07_SurfaceAnalysis.png",
    lineTypes: {
      0: {
        color: "#00FF00", // Green for 1000 mb
        width: 4,
        label: "1000",
        dash: [8, 4],
      },
      1: {
        color: "#FF00FF", // Magenta for 1004 mb
        width: 4,
        label: "1004",
        dash: [8, 4],
      },
      2: {
        color: "#00FFFF", // Cyan for 1008 mb
        width: 4,
        label: "1008",
        dash: [8, 4],
      },
      3: {
        color: "#0000FF", // Blue for cold front
        width: 5,
        label: "Cold Front",
        dash: [], // Solid line
      },
      4: {
        color: "#FF0000", // Red for warm front
        width: 5,
        label: "Warm Front",
        dash: [], // Solid line
      },
      5: {
        color: "#FF8C00", // Dark Orange for broken & overcast clouds
        width: 4,
        label: "Clouds",
        dash: [12, 6], // Dashed line to distinguish from fronts
      },
    },
  },

  // Form Export Configuration
  questions: [
    // Question 1: Air Mass Identification (7 points - locations A-G)
    { id: "q1a", key: "Q1a_AIR_MASS_A" },
    { id: "q1b", key: "Q1b_AIR_MASS_B" },
    { id: "q1c", key: "Q1c_AIR_MASS_C" },
    { id: "q1d", key: "Q1d_AIR_MASS_D" },
    { id: "q1e", key: "Q1e_AIR_MASS_E" },
    { id: "q1f", key: "Q1f_AIR_MASS_F" },
    { id: "q1g", key: "Q1g_AIR_MASS_G" },

    // Question 2: Front Types (3 points)
    { id: "q2a", key: "Q2a_INTENSE_PRECIP" },
    { id: "q2b", key: "Q2b_STEADY_RAIN" },
    { id: "q2c", key: "Q2c_WIND_SHIFT" },

    // Question 3: Surface Analysis (20 points)
    {
      key: "Q3_NOTE",
      note: "Surface analysis with isobars and fronts - see uploaded image",
    },
  ],
};
