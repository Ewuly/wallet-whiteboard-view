# Wrangler Commands for Wallet Database Setup

## Prerequisites
Make sure you have Wrangler CLI installed:
```bash
npm install -g wrangler
```

## 1. Create D1 Database
```bash
wrangler d1 create wallet-database
```

**Note:** Save the database ID from the output. You'll need it for the wrangler.toml configuration.

## 2. Update wrangler.toml
Create or update your `wrangler.toml` file in the project root:

```toml
name = "wallet-whiteboard-view"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

# D1 Database Configuration
[[d1_databases]]
binding = "DB"
database_name = "wallet-database"
database_id = "your-database-id-here"  # Replace with actual ID from step 1
```

## 3. Initialize Database Schema
Run the schema to create the wallets table:
```bash
wrangler d1 execute wallet-database --file=./schema.sql
```

## 4. Test Database Connection (Optional)
Test that your database is working:
```bash
wrangler d1 execute wallet-database --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## 5. Insert Test Data (Optional)
```bash
wrangler d1 execute wallet-database --command="INSERT INTO wallets (name, type, address, inserted_at) VALUES ('Test Wallet', 'Bitcoin', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', datetime('now'));"
```

## 6. Query Test Data (Optional)
```bash
wrangler d1 execute wallet-database --command="SELECT * FROM wallets;"
```

## 7. Development Setup
For local development, you can use:
```bash
wrangler d1 execute wallet-database --local --file=./schema.sql
```

## 8. Deploy Functions
Deploy your Cloudflare Pages Functions:
```bash
wrangler pages dev
```

For production deployment:
```bash
wrangler pages deploy
```

## 9. Environment Variables (if needed)
If you need to set environment variables:
```bash
wrangler pages secret put API_KEY
# Follow prompts to enter your secret value
```

## 10. View Database in Browser
You can inspect your database using:
```bash
wrangler d1 info wallet-database
```

## Useful Development Commands

### View all databases
```bash
wrangler d1 list
```

### Execute SQL commands directly
```bash
wrangler d1 execute wallet-database --command="SELECT COUNT(*) as total_wallets FROM wallets;"
```

### Backup database
```bash
wrangler d1 export wallet-database --output=backup.sql
```

### Import data from backup
```bash
wrangler d1 execute wallet-database --file=backup.sql
```

## Troubleshooting

### If you get permission errors:
```bash
wrangler auth login
```

### To reset the database:
```bash
wrangler d1 execute wallet-database --command="DROP TABLE IF EXISTS wallets;"
wrangler d1 execute wallet-database --file=./schema.sql
```

### To check schema:
```bash
wrangler d1 execute wallet-database --command="PRAGMA table_info(wallets);"
```

## Testing the API

Once deployed, you can test your wallet API:

### Add a wallet (POST)
```bash
curl -X POST https://your-domain.pages.dev/api/postwallet \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Bitcoin Wallet",
    "type": "Bitcoin",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  }'
```

### Test CORS (OPTIONS)
```bash
curl -X OPTIONS https://your-domain.pages.dev/api/postwallet \
  -H "Origin: http://localhost:3000" \
  -v
```

## Production Considerations

1. **Environment Variables**: Set up production environment variables
2. **Rate Limiting**: Consider implementing rate limiting for the API
3. **Validation**: The API includes comprehensive validation for wallet addresses
4. **Error Handling**: All errors are logged and returned with appropriate HTTP status codes
5. **CORS**: CORS is configured to allow cross-origin requests

## Notes

- The database uses SQLite with constraints to ensure data integrity
- Wallet names must be unique
- Wallet types are restricted to 'Bitcoin', 'Ethereum', or 'Solana'
- All timestamps are stored in ISO format
- The schema includes indexes for better query performance 