import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CryptoTable from "./CryptoTable";
import { CryptoHolding, WalletAddress } from "./WalletPortfolio";
import { TrendingUp, Wallet, Loader2 } from "lucide-react";

interface PortfolioTabProps {
  cryptoHoldings: CryptoHolding[];
  totalValue: number;
  walletAddresses: WalletAddress[];
  isLoadingWallets?: boolean;
}

const PortfolioTab = ({ cryptoHoldings, totalValue, walletAddresses, isLoadingWallets = false }: PortfolioTabProps) => {
  const getWalletBadge = (type: 'ethereum' | 'solana' | 'bitcoin') => {
    switch (type) {
      case 'ethereum':
        return <Badge variant="default">ETH</Badge>;
      case 'bitcoin':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">BTC</Badge>;
      case 'solana':
        return <Badge variant="secondary">SOL</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Portfolio Value</p>
              <p className="text-4xl font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoTable holdings={cryptoHoldings} />
        </CardContent>
      </Card>
      
      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connected Wallets ({walletAddresses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingWallets ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-gray-600">Loading wallets...</span>
            </div>
          ) : walletAddresses.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No wallets connected yet</p>
              <p className="text-sm text-gray-400">Add your first wallet using the "Add Wallet" tab</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletAddresses.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getWalletBadge(wallet.type)}
                      {wallet.label && (
                        <span className="font-medium text-gray-900">{wallet.label}</span>
                      )}
                      {wallet.inserted_at && (
                        <span className="text-xs text-gray-400 ml-auto">
                          Added {new Date(wallet.inserted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-mono text-gray-600 break-all">
                      {wallet.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;
