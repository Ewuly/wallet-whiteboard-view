-- Database schema for wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('Bitcoin', 'Ethereum', 'Solana')),
    address TEXT NOT NULL,
    inserted_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_name ON wallets(name);
CREATE INDEX IF NOT EXISTS idx_wallets_type ON wallets(type);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);

-- Create trigger to update the updated_at field
CREATE TRIGGER IF NOT EXISTS update_wallets_updated_at 
    AFTER UPDATE ON wallets
    FOR EACH ROW
BEGIN
    UPDATE wallets SET updated_at = datetime('now') WHERE id = NEW.id;
END; 