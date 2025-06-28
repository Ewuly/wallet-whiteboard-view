export interface TokenBalance {
  amount: number;
  symbol: string;
  decimals: number;
}

export interface BalanceResponse {
  address: string;
  balances: {
    SOL: TokenBalance;
    USDC: TokenBalance;
    zBTC: TokenBalance;
  };
  timestamp: string;
}

export interface BitcoinPriceResponse {
  price: number;
  currency: string;
  source: string;
  quote: {
    usdcAmount: number;
    zbtcAmount: number;
    rate: string;
  };
  timestamp: string;
  contextSlot: number;
  priceImpact: string;
}

export interface WalletData {
  name: string;
  type: 'Bitcoin' | 'Ethereum' | 'Solana';
  address: string;
}

export interface WalletResponse {
  message: string;
  wallet?: {
    id: number;
    name: string;
    type: string;
    address: string;
    inserted_at: string;
  };
  error?: string;
}

export interface GetWalletsResponse {
  wallets: Array<{
    id: string;
    address: string;
    type: 'ethereum' | 'solana' | 'bitcoin';
    label: string;
    inserted_at: string;
    updated_at: string;
  }>;
  count: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? `${window.location.origin}/api`
const GET_BALANCE_API = API_BASE_URL + "/getbalance"
const GET_BITCOIN_PRICE_API = API_BASE_URL + "/getbitcoinprice"
const POST_WALLET_API = API_BASE_URL + "/postwallet"
const GET_WALLETS_API = API_BASE_URL + "/getwallets"

  
type GetBalanceArgs = {
  address: string
}

const getBalance = async ({ address }: GetBalanceArgs): Promise<BalanceResponse> => {
  const url = new URL(GET_BALANCE_API, window.location.href)
  url.searchParams.set("address", address)

  const response = await fetch(url)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error || 'Failed to fetch balances')
  }

    const json = await response.json()
  return json
}

const getBitcoinPrice = async (): Promise<BitcoinPriceResponse> => {
  const response = await fetch(GET_BITCOIN_PRICE_API)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error || 'Failed to fetch Bitcoin price')
  }

  const json = await response.json()
  return json
}

const postWallet = async (walletData: WalletData): Promise<WalletResponse> => {
  const response = await fetch(POST_WALLET_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(walletData),
  })

  const json = await response.json()
  
  if (!response.ok) {
    throw new Error(json?.error || 'Failed to add wallet')
  }

  return json
}

const getWallets = async (): Promise<GetWalletsResponse> => {
  const response = await fetch(GET_WALLETS_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await response.json()
  
  if (!response.ok) {
    throw new Error(json?.error || 'Failed to fetch wallets')
  }

  return json
}

export const backendApi = {
  getBalance,
  getBitcoinPrice,
  postWallet,
  getWallets,
}
  