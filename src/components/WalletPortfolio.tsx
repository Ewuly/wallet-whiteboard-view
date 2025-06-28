import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PortfolioTab from "./PortfolioTab";
import AddWalletTab from "./AddWalletTab";
import { Wallet, Loader2 } from "lucide-react";
import { backendApi } from "@/data/api/backendApi";
import { useToast } from "@/hooks/use-toast";

export interface CryptoHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  priceUsd: number;
  totalValue: number;
}

export interface WalletAddress {
  id: string;
  address: string;
  type: 'ethereum' | 'solana' | 'bitcoin';
  label?: string;
  inserted_at?: string;
  updated_at?: string;
}

const WalletPortfolio = () => {
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.5,
      priceUsd: 45000,
      totalValue: 22500
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      amount: 2.3,
      priceUsd: 3000,
      totalValue: 6900
    },
    {
      id: "3",
      name: "Solana",
      symbol: "SOL",
      amount: 15.7,
      priceUsd: 150,
      totalValue: 2355
    }
  ]);

  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const { toast } = useToast();

  const totalPortfolioValue = cryptoHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);

  // Fetch wallets from the database
  const fetchWallets = async () => {
    try {
      setIsLoadingWallets(true);
      const response = await backendApi.getWallets();
      setWalletAddresses(response.wallets);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      toast({
        title: "Failed to Load Wallets",
        description: error instanceof Error ? error.message : "Unable to fetch wallet data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingWallets(false);
    }
  };

  // Load wallets when component mounts
  useEffect(() => {
    fetchWallets();
  }, []);

  const addWalletAddress = (address: string, type: 'ethereum' | 'solana' | 'bitcoin', label?: string) => {
    // Optimistic update - add wallet to local state immediately
    const newWallet: WalletAddress = {
      id: Date.now().toString(),
      address,
      type,
      label,
      inserted_at: new Date().toISOString()
    };
    setWalletAddresses(prev => [newWallet, ...prev]);
    
    // Refresh from database to get the real ID and ensure consistency
    setTimeout(() => {
      fetchWallets();
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet Portfolio</h1>
        </div>
        <p className="text-gray-600">Track and manage your cryptocurrency portfolio</p>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-0">
          <Tabs defaultValue="portfolio" className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1">
                <TabsTrigger 
                  value="portfolio" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger 
                  value="add-wallet"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Add Wallet
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="portfolio" className="p-6 mt-0">
              {isLoadingWallets ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-600">Loading wallets...</span>
                </div>
              ) : (
                <PortfolioTab 
                  cryptoHoldings={cryptoHoldings}
                  totalValue={totalPortfolioValue}
                  walletAddresses={walletAddresses}
                />
              )}
            </TabsContent>

            <TabsContent value="add-wallet" className="p-6 mt-0">
              <AddWalletTab 
                onAddWallet={addWalletAddress}
                existingWallets={walletAddresses}
                isLoadingWallets={isLoadingWallets}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPortfolio;
