// server/ai/pyRunner.js
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Returns a Promise that resolves to a JS object (parsed JSON)
export async function analyzeImage(imagePath) {
  return new Promise((resolve, reject) => {
    // Use PYTHON_CMD from env if set; otherwise `python`
    const pythonCmd = "python";

    const script = path.join(__dirname, "analyze.py"); // ensure this exists

    const proc = spawn(pythonCmd, [script, imagePath]);

    let stdout = "";
    
    let stderr = "";

    proc.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Analyzer exited ${code}: ${stderr}`));
      }
      try {
        const obj = JSON.parse(stdout);
        resolve(obj);
      } catch (err) {
        reject(new Error("Invalid JSON from analyzer: " + err.message + " — stdout: " + stdout + " — stderr: " + stderr));
      }
    });

    proc.on("error", (err) => reject(err));
  });
}
