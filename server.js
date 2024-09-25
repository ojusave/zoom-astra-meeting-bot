const { spawn } = require('child_process');
const { fetchAllData } = require('./zoomapi');

async function runPythonScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const process = spawn('python', [scriptPath]);

    process.stdout.on('data', (data) => {
      // Print the Python script output directly to maintain formatting
      process.stdout.write(data);
    });

    process.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    // Pipe Node.js process's stdin to the Python process's stdin
    process.stdin.pipe(process.stdin);
  });
}

async function main() {
  try {
    console.log("Fetching data from Zoom...");
    await fetchAllData();

    console.log("\nLoading data into Astra DB...");
    await runPythonScript('./scripts/load_data.py');

    console.log("\nStarting the Zoom AI bot...");
    await runPythonScript('./scripts/zoom_ai_bot.py');

    console.log("All processes completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();