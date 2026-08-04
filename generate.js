const fs = require('fs');
const path = require('path');

const SOURCE_URL = 'https://raw.githubusercontent.com/sixpg/zeyo-test/refs/heads/main/jtv.m3u';
const EPG_URL = 'https://tsepg.cf/epg.xml.gz';
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

    // Read the original response text
    let rawContent = await response.text();

    // Remove any existing #EXTM3U header lines if present
    rawContent = rawContent.replace(/^#EXTM3U.*\r?\n/gi, '').trim();

    // Prepend #EXTM3U header with the EPG URL at the very first line
    const finalContent = `#EXTM3U x-tvg-url="${EPG_URL}"\n\n` + rawContent;

    // Save to playlist.m3u
    fs.writeFileSync(OUTPUT_FILE, finalContent, 'utf8');
    console.log('Successfully written playlist with EPG header at first line!');

  } catch (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }
}

proxyFetchPlaylist();
