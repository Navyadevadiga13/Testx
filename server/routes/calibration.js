// server/routes/calibration.js
//
// GET /scoring/calibration
// -> 200 { taOffset, ccOffset, lrOffset, graOffset, sampleSize, updatedAt }
//
// Serves the latest per-criterion correction offsets computed by
// comparing this app's auto-scores against real human-examiner bands.
// These offsets are NOT computed here — they're computed periodically
// by scripts/recalibrate.js (see below) and just read from storage here.
//
// Any missing field is treated as 0 (no adjustment) by the frontend.

import { getLatestCalibration } from "../lib/calibrationStore.js"; // e.g. a single-row DB table

export default async function calibrationHandler(req, res) {
  try {
    const calibration = await getLatestCalibration();

    if (!calibration) {
      // No calibration data yet — respond with an explicit "no offsets"
      // shape rather than an error, since this is an expected state
      // for a new deployment before enough human-graded data exists.
      return res.status(200).json({
        taOffset: 0, ccOffset: 0, lrOffset: 0, graOffset: 0,
        sampleSize: 0, updatedAt: null
      });
    }

    return res.status(200).json(calibration);
  } catch (err) {
    console.error("[/scoring/calibration] fetch failed:", err);
    return res.status(502).json({ error: "calibration_unavailable" });
  }
}

// ============================================================================
// scripts/recalibrate.js — run periodically (cron / manual) once you have
// a table of { essayId, autoScore: {ta, cc, lr, gra}, humanScore: {ta, cc, lr, gra} }
// from essays that were both auto-scored AND graded by a real IELTS examiner.
// ============================================================================
//
// import { getGradedPairs } from "../lib/gradedEssaysStore.js";
// import { saveCalibration } from "../lib/calibrationStore.js";
//
// async function recalibrate() {
//   const pairs = await getGradedPairs(); // needs >= ~50-100 pairs to be meaningful
//   if (pairs.length < 50) {
//     console.log(`Only ${pairs.length} graded pairs — skipping recalibration (need >= 50).`);
//     return;
//   }
//
//   const offset = (criterion) => {
//     const diffs = pairs.map(p => p.humanScore[criterion] - p.autoScore[criterion]);
//     const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length;
//     // Round to nearest 0.5 band so offsets stay interpretable and don't overfit noise.
//     return Math.round(mean * 2) / 2;
//   };
//
//   await saveCalibration({
//     taOffset: offset("ta"),
//     ccOffset: offset("cc"),
//     lrOffset: offset("lr"),
//     graOffset: offset("gra"),
//     sampleSize: pairs.length,
//     updatedAt: new Date().toISOString()
//   });
//
//   console.log(`Recalibrated from ${pairs.length} graded pairs.`);
// }
//
// recalibrate();