// server/ai/mockModel.py
export async function analyzeImage(imagePath) {
  // 🧠 Mock function that simulates AI processing
  return {
    crimeType: "Burglary",
    confidence: "92%",
    description: "Detected possible burglary scene with broken window and scattered items.",
    evidence: [
      { type: "Weapon", detail: "Knife detected" },
      { type: "Fingerprint", detail: "Visible on glass surface" }
    ]
  };
}
