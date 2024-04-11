import { queryClient } from "@/lib/queryUtils";
import { Wallet } from "@/lib/cardano/walletUtils";
import CardanoWallet from "@/lib/cardano/CardanoWallet";
import { useQuery } from "@tanstack/react-query";

const BASE_WALLET_KEY = "wallet";
export const IS_CONNECTED_KEY = [BASE_WALLET_KEY, "isConnected"];
export const CONNECTED_WALLET_KEY = [BASE_WALLET_KEY, "connected"];

export const getConnectedWallet = () =>
  queryClient.getQueryData(CONNECTED_WALLET_KEY);
export const setConnectedWallet = async (wallet: Wallet | null) =>
  queryClient.setQueryData(CONNECTED_WALLET_KEY, wallet);
export const useGetConnectedWallet = () =>
  useQuery({
    queryKey: CONNECTED_WALLET_KEY,
    queryFn: () => getConnectedWallet() ?? null,
  });

export const useIsConnected = () =>
  useQuery({
    queryKey: IS_CONNECTED_KEY,
    queryFn: async () => await CardanoWallet.isConnected(),
  });
