const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase successfully.');

    // Add otp columns if they don't exist
    await client.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "otp" TEXT,
      ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);
    `);
    
    console.log('Successfully updated the User table with OTP columns!');
  } catch (err) {
    console.error('Migration error:', err.stack);
  } finally {
    await client.end();
  }
}

runMigration();
