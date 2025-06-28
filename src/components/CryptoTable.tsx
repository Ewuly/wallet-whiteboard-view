
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CryptoHolding } from "./WalletPortfolio";

interface CryptoTableProps {
  holdings: CryptoHolding[];
}

const CryptoTable = ({ holdings }: CryptoTableProps) => {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-900">Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Amount</TableHead>
            <TableHead className="font-semibold text-gray-900">Price (USD)</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow key={holding.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {holding.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{holding.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {holding.symbol}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono">
                {holding.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 6 
                })}
              </TableCell>
              <TableCell className="font-mono">
                ${holding.priceUsd.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold">
                ${holding.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CryptoTable;
