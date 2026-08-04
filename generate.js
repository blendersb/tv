const fs = require('fs');
const path = require('path');

const SOURCE_URL = 'https://raw.githubusercontent.com/sixpg/zeyo-test/refs/heads/main/jtv.m3u';
const OUTPUT_FILE = path.join(__dirname, 'playlist.m3u');

async function proxyFetchPlaylist() {
  console.log('Fetching raw playlist...');

  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch raw playlist. HTTP Status: ${response.status}`);
    }

    // Get exact raw string response
    const rawContent = await response.text();

    // Write raw output directly to playlist.m3u file
    fs.writeFileSync(OUTPUT_FILE, rawContent, 'utf8');
    console.log('Successfully written raw response to playlist.m3u!');

  } catch (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }
}

proxyFetchPlaylist();
