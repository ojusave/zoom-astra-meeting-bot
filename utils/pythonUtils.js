const { spawnSync, spawn } = require('child_process');
const path = require('path');

console.log('pythonUtils.js file loaded');

function getPythonCommand() {
    const commands = ['python3', 'python', '/usr/local/bin/python3', '/usr/bin/python3'];
    for (const cmd of commands) {
        try {
            const result = spawnSync(cmd, ['-c', 'print("Python found")']);
            if (result.status === 0) {
                console.log(`Using Python at: ${cmd}`);
                return cmd;
            }
        } catch (error) {
            console.log(`Failed to execute ${cmd}: ${error.message}`);
        }
    }
    throw new Error('Python executable not found. Please ensure Python is installed and added to your PATH.');
}

function runPythonScript(scriptPath, ...args) {
    return new Promise((resolve, reject) => {
        const pythonCmd = getPythonCommand();
        console.log(`Executing: ${pythonCmd} ${scriptPath} ${args.join(' ')}`);
        console.log(`Current working directory: ${process.cwd()}`);
        console.log(`Script path: ${path.resolve(scriptPath)}`);

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
                reject(`An error occurred while processing your request. Error code: ${code}. Error output: ${errorOutput}`);
            } else {
                console.log(`Python script output: ${output.trim()}`);
                resolve(output.trim());
            }
        });

        pythonProcess.on('error', (error) => {
            console.error(`Failed to start Python process: ${error.message}`);
            reject(`Failed to start Python process: ${error.message}`);
        });
    });
}

module.exports = { runPythonScript };