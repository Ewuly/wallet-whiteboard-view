/**
 * Utility functions for Cloudflare Pages Functions
 */

export interface JsonResponse {
  [key: string]: unknown;
}

/**
 * Creates a JSON response with proper headers
 */
export function jsonResponse(data: JsonResponse, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * Reports errors to the database and console
 */
export async function reportError(db: D1Database, error: unknown): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : '';
  
  console.error('Function Error:', {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });

  try {
    // Optional: Log to D1 database if you have an errors table
    // await db.prepare('INSERT INTO errors (message, stack, timestamp) VALUES (?, ?, ?)')
    //   .bind(errorMessage, errorStack, new Date().toISOString())
    //   .run();
  } catch (dbError) {
    console.error('Failed to log error to database:', dbError);
  }
}

/**
 * Handles CORS preflight requests
 */
export function handleCors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 