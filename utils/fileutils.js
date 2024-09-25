const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { getToken } = require('../auth');

async function downloadVttFile(downloadUrl) {
  try {
    const token = await getToken();
    const response = await axios.get(downloadUrl, {
      responseType: 'text',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return cleanVttContent(response.data);
  } catch (error) {
    console.error('Error downloading VTT file:', error.message);
    return null;
  }
}

function cleanVttContent(vttContent) {
  if (!vttContent) return null;

  const lines = vttContent.split('\n');
  const cleanedLines = lines.slice(2).filter(line => line.trim() !== '');

  let cleanedContent = [];
  for (let i = 0; i < cleanedLines.length; i += 3) {
    if (i + 2 < cleanedLines.length) {
      const timestamp = cleanedLines[i + 1];
      const text = cleanedLines[i + 2];
      cleanedContent.push(`${timestamp}\n${text}`);
    }
  }

  return cleanedContent.join('\n\n').trim();
}

async function writeDataToFile(data, fileName) {
  const dirPath = path.join(__dirname, '../data');
  const filePath = path.join(dirPath, `${fileName}.json`);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Data written to file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing data to file ${filePath}:`, error);
    throw error;
  }
}

module.exports = { downloadVttFile, writeDataToFile };
