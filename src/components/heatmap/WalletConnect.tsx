import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Wallets,
  CardanoWalletType,
  useWalletConnection,
} from "@/lib/cardano/walletUtils";

interface WalletDropdownContentProps {
  isConnected: boolean | undefined;
  connect: (walletType: CardanoWalletType) => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletDropdownContent = ({
  isConnected,
  connect,
  disconnect,
}: WalletDropdownContentProps) => (
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Wallets</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {Object.entries(Wallets)
      .filter(([key, wallet]) => wallet.type !== CardanoWalletType.NONE)
      .map(([key, wallet]) => (
        <DropdownMenuItem key={key} onClick={() => connect(wallet.type)}>
          {wallet.name}
        </DropdownMenuItem>
      ))}
    <DropdownMenuSeparator />
    {isConnected && (
      <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
    )}
  </DropdownMenuContent>
);

export function WalletConnect() {
  const { isLoading, isConnected, walletText, connect, disconnect } =
    useWalletConnection();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" disabled={isLoading}>
          {isConnected ? walletText : "Connect"}
        </Button>
      </DropdownMenuTrigger>
      <WalletDropdownContent
        isConnected={isConnected}
        connect={connect}
        disconnect={disconnect}
      />
    </DropdownMenu>
  );
}
