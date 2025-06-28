import { jsonResponse, reportError, handleCors } from "./cfPagesFunctionsUtils"

interface WalletRecord {
  id: number;
  name: string;
  type: 'Bitcoin' | 'Ethereum' | 'Solana';
  address: string;
  inserted_at: string;
  updated_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onRequest = async (context: any) => {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    console.log('CORS preflight request received for getwallets');
    return handleCors();
  }

  // Handle GET requests
  if (context.request.method === 'GET') {
    const db = context.env.DB;
    
    try {
      // Retrieve all wallets from the database
      const wallets = await db.prepare(`
        SELECT id, name, type, address, inserted_at, updated_at 
        FROM wallets 
        ORDER BY inserted_at DESC
      `).all();

      if (!wallets.success) {
        throw new Error('Failed to retrieve wallets from database');
      }

      // Transform the results to match frontend interface
      const transformedWallets = wallets.results.map((wallet: WalletRecord) => ({
        id: wallet.id.toString(),
        address: wallet.address,
        type: wallet.type.toLowerCase() as 'ethereum' | 'solana' | 'bitcoin',
        label: wallet.name,
        inserted_at: wallet.inserted_at,
        updated_at: wallet.updated_at
      }));

      return jsonResponse({ 
        wallets: transformedWallets,
        count: transformedWallets.length
      }, 200);

    } catch (error) {
      console.error('Error in getwallets:', error);
      await reportError(context.env.DB, error);
      return jsonResponse({ 
        error: "Failed to retrieve wallets. Please try again." 
      }, 500);
    }
  }

  // Method not allowed for other HTTP methods
  return jsonResponse({ error: "Method not allowed" }, 405);
} 