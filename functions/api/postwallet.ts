import { jsonResponse, reportError, handleCors } from "./cfPagesFunctionsUtils"

interface WalletData {
  name: string;
  type: 'Bitcoin' | 'Ethereum' | 'Solana';
  address: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onRequest = async (context: any) => {
  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    console.log('CORS preflight request received');
    return handleCors();
  }

  // Handle POST requests
  if (context.request.method === 'POST') {
    const db = context.env.DB;
    
    try {
      const requestData = await context.request.json() as WalletData;
      const { name, type, address } = requestData;

      // Validate required fields
      if (!name || !type || !address) {
        return jsonResponse({ 
          error: "Missing required fields: name, type, and address are required" 
        }, 400);
      }

      // Validate wallet type
      if (!['Bitcoin', 'Ethereum', 'Solana'].includes(type)) {
        return jsonResponse({ 
          error: "Invalid wallet type. Must be Bitcoin, Ethereum, or Solana" 
        }, 400);
      }

      // Validate address format based on type
      const addressValidation = validateAddress(address, type);
      if (!addressValidation.isValid) {
        return jsonResponse({ 
          error: addressValidation.error 
        }, 400);
      }

      // Check if wallet name already exists
      const existingWallet = await db.prepare('SELECT id FROM wallets WHERE name = ?')
        .bind(name)
        .first();

      if (existingWallet) {
        return jsonResponse({ 
          error: "Wallet name already exists. Please choose a different name." 
        }, 409);
      }

      // Insert the new wallet
      const insertResult = await db.prepare(`
        INSERT INTO wallets (name, type, address, inserted_at) 
        VALUES (?, ?, ?, ?)
      `).bind(name, type, address, new Date().toISOString()).run();

      if (!insertResult.success) {
        throw new Error('Failed to insert wallet into database');
      }

      return jsonResponse({ 
        message: "Wallet added successfully!",
        wallet: {
          id: insertResult.meta.last_row_id,
          name,
          type,
          address,
          inserted_at: new Date().toISOString()
        }
      }, 201);

    } catch (error) {
      console.error('Error in postwallet:', error);
      await reportError(context.env.DB, error);
      return jsonResponse({ 
        error: "Failed to add wallet. Please try again." 
      }, 500);
    }
  }

  // Method not allowed for other HTTP methods
  return jsonResponse({ error: "Method not allowed" }, 405);
}

function validateAddress(address: string, type: string): { isValid: boolean; error?: string } {
  switch (type) {
    case 'Ethereum': {
      const isEthereumValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      return {
        isValid: isEthereumValid,
        error: isEthereumValid ? undefined : "Invalid Ethereum address format"
      };
    }
    
    case 'Solana': {
      const isSolanaValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      return {
        isValid: isSolanaValid,
        error: isSolanaValid ? undefined : "Invalid Solana address format"
      };
    }
    
    case 'Bitcoin': {
      // Bitcoin address validation (simplified - supports P2PKH, P2SH, and Bech32)
      const isBitcoinValid = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
      return {
        isValid: isBitcoinValid,
        error: isBitcoinValid ? undefined : "Invalid Bitcoin address format"
      };
    }
    
    default:
      return {
        isValid: false,
        error: "Unsupported wallet type"
      };
  }
}
