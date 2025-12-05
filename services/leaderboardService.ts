import { PlayerScore } from '../types';

// Updated key to v2 to ensure we start fresh without old mock data
const DB_KEY = 'comic_con_leaderboard_db_v2';

export const getLeaderboardData = async (): Promise<PlayerScore[]> => {
  // Simulate network latency for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  const storedData = localStorage.getItem(DB_KEY);
  if (!storedData) {
    // Return empty array instead of mock data
    return [];
  }

  try {
    return JSON.parse(storedData);
  } catch (e) {
    console.error("Failed to parse leaderboard data", e);
    return [];
  }
};

export const savePlayerScore = async (score: PlayerScore): Promise<void> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const currentData = await getLeaderboardData();
  // Add new score
  const updatedData = [...currentData, score];
  
  // Sort by time (asc) to keep the list somewhat organized in storage
  updatedData.sort((a, b) => a.timeSeconds - b.timeSeconds);

  // Store back to "DB"
  localStorage.setItem(DB_KEY, JSON.stringify(updatedData));
  
  // NOTE: To connect to Google Sheets:
  // 1. Create a Google Apps Script Web App that accepts POST requests.
  // 2. Use fetch() here to send the `score` object to that URL.
  // Example:
  // await fetch('YOUR_GOOGLE_SCRIPT_URL', {
  //   method: 'POST',
  //   body: JSON.stringify(score)
  // });
};
