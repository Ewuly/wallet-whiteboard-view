
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CryptoTable from "./CryptoTable";
import { CryptoHolding, WalletAddress } from "./WalletPortfolio";
import { TrendingUp, Wallet } from "lucide-react";

interface PortfolioTabProps {
  cryptoHoldings: CryptoHolding[];
  totalValue: number;
  walletAddresses: WalletAddress[];
}

const PortfolioTab = ({ cryptoHoldings, totalValue, walletAddresses }: PortfolioTabProps) => {
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

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connected Wallets ({walletAddresses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walletAddresses.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={wallet.type === 'ethereum' ? 'default' : 'secondary'}>
                      {wallet.type === 'ethereum' ? 'ETH' : 'SOL'}
                    </Badge>
                    {wallet.label && (
                      <span className="font-medium text-gray-900">{wallet.label}</span>
                    )}
                  </div>
                  <p className="text-sm font-mono text-gray-600 break-all">
                    {wallet.address}
                  </p>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default PortfolioTab;
