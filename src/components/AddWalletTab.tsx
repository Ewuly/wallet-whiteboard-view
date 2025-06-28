import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { WalletAddress } from "./WalletPortfolio";
import { Plus, Wallet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { backendApi, WalletData } from "@/data/api/backendApi";

interface AddWalletTabProps {
  onAddWallet: (address: string, type: 'ethereum' | 'solana' | 'bitcoin', label?: string) => void;
  existingWallets: WalletAddress[];
  isLoadingWallets?: boolean;
}

const AddWalletTab = ({ onAddWallet, existingWallets, isLoadingWallets = false }: AddWalletTabProps) => {
  const [address, setAddress] = useState("");
  const [walletType, setWalletType] = useState<'Bitcoin' | 'Ethereum' | 'Solana'>('Ethereum');
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    if (!label.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet name",
        variant: "destructive"
      });
      return;
    }

    // Basic validation for address format
    let isValidAddress = false;
    
    switch (walletType) {
      case 'Ethereum':
        isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
        if (!isValidAddress) {
          toast({
            title: "Invalid Address",
            description: "Please enter a valid Ethereum address (starts with 0x)",
            variant: "destructive"
          });
          return;
        }
        break;
      
      case 'Solana':
        isValidAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        if (!isValidAddress) {
          toast({
            title: "Invalid Address",
            description: "Please enter a valid Solana address",
            variant: "destructive"
          });
          return;
        }
        break;
      
      case 'Bitcoin':
        isValidAddress = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
        if (!isValidAddress) {
          toast({
            title: "Invalid Address",
            description: "Please enter a valid Bitcoin address",
            variant: "destructive"
          });
          return;
        }
        break;
    }

    // Check if wallet already exists
    const walletExists = existingWallets.some(wallet => wallet.address === address);
    if (walletExists) {
      toast({
        title: "Wallet Already Added",
        description: "This wallet address is already in your portfolio",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const walletData: WalletData = {
        name: label.trim(),
        type: walletType,
        address: address.trim()
      };

      const response = await backendApi.postWallet(walletData);
      
      // Call the callback to update the local state
      onAddWallet(
        address, 
        walletType.toLowerCase() as 'ethereum' | 'solana' | 'bitcoin', 
        label.trim()
      );
      
      // Reset form
      setAddress("");
      setLabel("");
      
      toast({
        title: "Wallet Added Successfully!",
        description: `${walletType} wallet "${label.trim()}" has been added to your portfolio.`,
      });

    } catch (error) {
      toast({
        title: "Failed to Add Wallet",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="text-center">
        <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-4">
          <Plus className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add New Wallet</h3>
        <p className="text-gray-600">Connect your Bitcoin, Ethereum, or Solana wallet to track your portfolio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wallet-type">Wallet Type</Label>
              <RadioGroup 
                value={walletType} 
                onValueChange={(value) => setWalletType(value as 'Bitcoin' | 'Ethereum' | 'Solana')}
                className="flex gap-6 flex-wrap"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bitcoin" id="bitcoin" />
                  <Label htmlFor="bitcoin" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">BTC</Badge>
                    Bitcoin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ethereum" id="ethereum" />
                  <Label htmlFor="ethereum" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="default">ETH</Badge>
                    Ethereum
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Solana" id="solana" />
                  <Label htmlFor="solana" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="secondary">SOL</Badge>
                    Solana
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Wallet Name *</Label>
              <Input
                id="label"
                type="text"
                placeholder="e.g., Main Trading Wallet"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Give your wallet a unique name for easy identification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Public Key (Address) *</Label>
              <Input
                id="address"
                type="text"
                placeholder={
                  walletType === 'Ethereum' ? '0x...' : 
                  walletType === 'Bitcoin' ? '1... or 3... or bc1...' :
                  'Enter Solana address'
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                {walletType === 'Ethereum' 
                  ? 'Enter a valid Ethereum address starting with 0x'
                  : walletType === 'Bitcoin'
                  ? 'Enter a valid Bitcoin address (Legacy, P2SH, or Bech32 format)'
                  : 'Enter a valid Solana address (32-44 characters)'
                }
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Wallet...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Add Wallet
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Wallets ({existingWallets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingWallets ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-gray-600">Loading wallets...</span>
            </div>
          ) : existingWallets.length === 0 ? (
            <div className="text-center py-6">
              <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No wallets connected yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {existingWallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {getWalletBadge(wallet.type)}
                  <div className="flex-1 min-w-0">
                    {wallet.label && (
                      <p className="font-medium text-sm text-gray-900">{wallet.label}</p>
                    )}
                    <p className="text-xs font-mono text-gray-600 truncate">
                      {wallet.address}
                    </p>
                  </div>
                  {wallet.inserted_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(wallet.inserted_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWalletTab;
