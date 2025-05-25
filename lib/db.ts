import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL!)

// Simple test function to verify database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return { success: true, result: result }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error }
  }
}
