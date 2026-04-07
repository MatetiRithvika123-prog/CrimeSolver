const { spawn } = require('child_process');
const path = require('path');

class PythonService {
    async analyzeImage(imagePath) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                path.join(__dirname, '../ai/analyze.py'),
                imagePath
            ]);

            let output = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python script error:', errorOutput);
                    reject(new Error('AI analysis failed'));
                    return;
                }

                try {
                    const result = JSON.parse(output.trim());
                    resolve(result);
                } catch (parseError) {
                    console.error('Failed to parse Python output:', output);
                    reject(new Error('Invalid analysis result'));
                }
            });

            pythonProcess.on('error', (error) => {
                console.error('Python process error:', error);
                reject(new Error('Failed to run AI analysis'));
            });
        });
    }
}

module.exports = new PythonService();
