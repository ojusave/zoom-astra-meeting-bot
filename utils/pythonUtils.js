const { spawnSync, spawn } = require('child_process');

function getPythonCommand() {
    // Check if 'python3' exists on the system
    const python3Check = spawnSync('which', ['python3']);
    if (python3Check.status === 0) {
        return 'python3'; // If found, use 'python3'
    }
    return 'python'; // Otherwise, default to 'python'
}

function runPythonScript(scriptPath, ...args) {
    return new Promise((resolve, reject) => {
        const pythonCmd = getPythonCommand(); // Get appropriate Python command
        const pythonProcess = spawn(pythonCmd, [scriptPath, ...args]);
        
        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
            console.log(`Python stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`Python stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            if (code !== 0) {
                console.error(`Error output: ${errorOutput}`);
                reject(`An error occurred while processing your request. Error code: ${code}`);
            } else {
                console.log(`Python script output: ${output.trim()}`);
                resolve(output.trim());
            }
        });
    });
}

module.exports = { runPythonScript };
