
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { WalletAddress } from "./WalletPortfolio";
import { Plus, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddWalletTabProps {
  onAddWallet: (address: string, type: 'ethereum' | 'solana', label?: string) => void;
  existingWallets: WalletAddress[];
}

const AddWalletTab = ({ onAddWallet, existingWallets }: AddWalletTabProps) => {
  const [address, setAddress] = useState("");
  const [walletType, setWalletType] = useState<'ethereum' | 'solana'>('ethereum');
  const [label, setLabel] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    // Basic validation for address format
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);

    if (walletType === 'ethereum' && !isEthereumAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (starts with 0x)",
        variant: "destructive"
      });
      return;
    }

    if (walletType === 'solana' && !isSolanaAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana address",
        variant: "destructive"
      });
      return;
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

    onAddWallet(address, walletType, label.trim() || undefined);
    
    // Reset form
    setAddress("");
    setLabel("");
    
    toast({
      title: "Wallet Added",
      description: `${walletType === 'ethereum' ? 'Ethereum' : 'Solana'} wallet added successfully!`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-4">
          <Plus className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add New Wallet</h3>
        <p className="text-gray-600">Connect your Ethereum or Solana wallet to track your portfolio</p>
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
                onValueChange={(value) => setWalletType(value as 'ethereum' | 'solana')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ethereum" id="ethereum" />
                  <Label htmlFor="ethereum" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="default">ETH</Badge>
                    Ethereum
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solana" id="solana" />
                  <Label htmlFor="solana" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="secondary">SOL</Badge>
                    Solana
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Public Key (Address) *</Label>
              <Input
                id="address"
                type="text"
                placeholder={walletType === 'ethereum' ? '0x...' : 'Enter Solana address'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                {walletType === 'ethereum' 
                  ? 'Enter a valid Ethereum address starting with 0x'
                  : 'Enter a valid Solana address (32-44 characters)'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Wallet Label (Optional)</Label>
              <Input
                id="label"
                type="text"
                placeholder="e.g., Main Trading Wallet"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Give your wallet a memorable name for easy identification
              </p>
            </div>

            <Button type="submit" className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              Add Wallet
            </Button>
          </form>
        </CardContent>
      </Card>

      {existingWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallets ({existingWallets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingWallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Badge variant={wallet.type === 'ethereum' ? 'default' : 'secondary'}>
                    {wallet.type === 'ethereum' ? 'ETH' : 'SOL'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    {wallet.label && (
                      <p className="font-medium text-sm text-gray-900">{wallet.label}</p>
                    )}
                    <p className="text-xs font-mono text-gray-600 truncate">
                      {wallet.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddWalletTab;
