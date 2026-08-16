import { createClient } from '@libsql/client';

const tursoUrl = "libsql://findely-sabishimori.aws-ap-south-1.turso.io";
const tursoAuthToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4MTg0MDQyNTYsImlhdCI6MTc4Njg2ODI1NywiaWQiOiIwMWEwMDhkMS0xMjAxLTc5YmEtOWIwMi03YjJkYTE2NTI5MmUiLCJraWQiOiJIcEJPQ3ZqM1BuWHJlQk9sS2hmUlB3VGNLckh3U2NyckFfR0g5bDZlQXg4IiwicmlkIjoiY2RiZjIxZjktZGNjMy00M2ViLThlMzItZTZjMTk5Nzk5Mjc2In0.8Cy4YuS-XWZKTPWnZ9WkuDUg6Brq4_wOXNXljbmZ6drv7gisXEl91ZXkuejlAn1S_Av3xRnvMQcLA4BuqtOOCA";

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function main() {
  console.log("Creating otp_sessions table in Turso Cloud database...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS otp_sessions (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      name TEXT,
      expires_at INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at INTEGER
    );
  `);
  console.log("✓ Successfully created otp_sessions table in Turso!");

  const check = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='otp_sessions';");
  console.log("Table check result:", check.rows);
}

main().catch(console.error);
