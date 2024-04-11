import CardanoWallet from "@/lib/cardano/CardanoWallet";
import { useState } from "react";
import { useGetConnectedWallet, useIsConnected } from "@/lib/cardano/hooks";
import { queryClient } from "@/lib/queryUtils";

export enum CardanoNetwork {
  Preprod = 0,
  Mainnet = 1,
}

export enum CardanoWalletType {
  NONE = "None",
  ETERNL = "Eternl",
  NAMI = "Nami",
  VESPR = "Vespr",
  TYPHON = "Typhon",
  GERO = "Gero",
  FLINT = "Flint",
  NUFI = "NuFi",
  LACE = "Lace",
}

export type Wallet = {
  walletType: CardanoWalletType;
  address: string;
};

export type WalletsProps = {
  name: string;
  image: string;
  type: CardanoWalletType;
};

export const Wallets: Record<CardanoWalletType, WalletsProps> = {
  [CardanoWalletType.NONE]: {
    name: CardanoWalletType.NONE,
    image: "",
    type: CardanoWalletType.NONE,
  },
  [CardanoWalletType.ETERNL]: {
    name: CardanoWalletType.ETERNL,
    image: "/images/wallets/Eternl.png",
    type: CardanoWalletType.ETERNL,
  },
  [CardanoWalletType.NAMI]: {
    name: CardanoWalletType.NAMI,
    image: "/images/wallets/Nami.png",
    type: CardanoWalletType.NAMI,
  },
  [CardanoWalletType.VESPR]: {
    name: CardanoWalletType.VESPR,
    image: "/images/wallets/Vespr.png",
    type: CardanoWalletType.VESPR,
  },
  [CardanoWalletType.TYPHON]: {
    name: CardanoWalletType.TYPHON,
    image: "/images/wallets/Typhon.png",
    type: CardanoWalletType.TYPHON,
  },
  [CardanoWalletType.GERO]: {
    name: CardanoWalletType.GERO,
    image: "/images/wallets/Gero.png",
    type: CardanoWalletType.GERO,
  },
  [CardanoWalletType.FLINT]: {
    name: CardanoWalletType.FLINT,
    image: "/images/wallets/Flint.png",
    type: CardanoWalletType.FLINT,
  },
  [CardanoWalletType.NUFI]: {
    name: CardanoWalletType.NUFI,
    image: "/images/wallets/NuFi.png",
    type: CardanoWalletType.NUFI,
  },
  [CardanoWalletType.LACE]: {
    name: CardanoWalletType.LACE,
    image: "/images/wallets/Lace.png",
    type: CardanoWalletType.LACE,
  },
};

export function formatWalletAddress(address: string) {
  return `${address.slice(0, 5)}..${address.slice(-5)}`;
}

export const useWalletConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: isConnected, refetch } = useIsConnected();
  const { data: connectedWallet }: any = useGetConnectedWallet();

  const walletText = connectedWallet?.address
    ? formatWalletAddress(connectedWallet.address)
    : "Connect";

  const multiRefetch = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["nft"] });
  };

  const connect = async (walletType: CardanoWalletType) => {
    setIsLoading(true);
    try {
      await CardanoWallet.connect(walletType);
      multiRefetch();
    } catch (error) {
      console.error("Error during wallet connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    CardanoWallet.disconnect();
    refetch();
    setIsLoading(false);
  };

  return {
    isLoading,
    isConnected,
    walletText,
    connect,
    disconnect,
  };
};
