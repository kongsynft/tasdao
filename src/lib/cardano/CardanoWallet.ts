import { getConnectedWallet, setConnectedWallet } from "@/lib/cardano/hooks";
import {
  CardanoNetwork,
  CardanoWalletType,
  Wallet,
} from "@/lib/cardano/walletUtils";
import { Lucid } from "lucid-cardano";

class CardanoWallet {
  static lucid: Lucid | undefined;

  static async connect(wallet: CardanoWalletType) {
    try {
      const cardano: any = window.cardano;
      if (!cardano) {
        console.error(
          "Error: window.cardano is null or undefined. You must have a Cardano Wallet Extension (such as Nami) to connect.",
        );
        return false;
      }

      if (wallet === CardanoWalletType.NONE) {
        console.error("Error: Cardano Wallet not selected.");
        return false;
      }

      const walletSet = await this.setWallet(cardano, wallet);
      if (!walletSet) {
        console.error("Error: Wallet not set.");
        return false;
      }

      const correctNetwork = this.isCorrectNetwork();
      if (!correctNetwork) {
        console.error("Error: Incorrect Network.");
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static disconnect() {
    const cardano: any = window.cardano;
    if (!cardano) return false;

    this.lucid = undefined;
    setConnectedWallet(null);
  }

  static async signData(data: string) {
    try {
      if (!this.lucid) return null;

      const address = await this.lucid?.wallet?.address();
      const { fromText } = await import("lucid-cardano");
      const messageToSign = fromText(data);
      const signedMessage = await this.lucid?.wallet?.signMessage(
        address,
        messageToSign,
      );
      return signedMessage;
    } catch (error) {
      console.error(error);
      throw new Error("Sign Data Error");
    }
  }

  static async isConnected() {
    const cardano: any = window.cardano;
    if (!cardano) return false;

    if (this.lucid && this.isCorrectNetwork()) return true;

    const connectedWalletData: any = getConnectedWallet();
    const walletAPI = this.getWalletAPI(
      cardano,
      connectedWalletData?.walletType,
    );
    const isEnabled = await walletAPI?.isEnabled();

    if (isEnabled) {
      await this.setWallet(cardano, connectedWalletData?.walletType);
    } else {
      this.lucid = undefined;
      return false;
    }

    const correctNetwork = this.isCorrectNetwork();
    if (!correctNetwork) {
      return false;
    }

    return true;
  }

  static async getNetworkId(api: any) {
    if (!api) return null;

    const networkId = await api.getNetworkId();
    return networkId;
  }

  static async setWallet(cardano: any, wallet: CardanoWalletType) {
    const api = await this.getWalletAPI(cardano, wallet).enable();
    if (!api) return false;

    const networkId = await this.getNetworkId(api);
    const network = networkId === 1 ? "Mainnet" : "Preprod";
    const { Lucid } = await import("lucid-cardano");

    this.lucid = await Lucid.new(undefined, network);
    this.lucid.selectWallet(api);
    const address = await this.lucid?.wallet.address();
    setConnectedWallet({ walletType: wallet, address } as Wallet);
    return true;
  }

  static getWalletAPI(cardanoWindow: any, walletType: CardanoWalletType) {
    if (walletType === CardanoWalletType.NONE) {
      return null;
    } else if (walletType === CardanoWalletType.NAMI) {
      return cardanoWindow.nami;
    } else if (walletType === CardanoWalletType.ETERNL) {
      return cardanoWindow.eternl;
    } else if (walletType === CardanoWalletType.LACE) {
      return cardanoWindow.lace;
    } else if (walletType === CardanoWalletType.FLINT) {
      return cardanoWindow.flint;
    } else if (walletType === CardanoWalletType.GERO) {
      return cardanoWindow.gerowallet;
    } else if (walletType === CardanoWalletType.TYPHON) {
      return cardanoWindow.typhoncip30;
    } else if (walletType === CardanoWalletType.NUFI) {
      return cardanoWindow.nufi;
    } else if (walletType === CardanoWalletType.VESPR) {
      return cardanoWindow.vespr;
    }

    return null;
  }

  static isCorrectNetwork() {
    if (!this.lucid) return false;

    const networkString = process.env.NEXT_PUBLIC_CARDANO_NETWORK;
    const network =
      networkString === "mainnet"
        ? CardanoNetwork.Mainnet
        : CardanoNetwork.Preprod;
    const networkId = this.lucid.network;

    if (
      (network === CardanoNetwork.Mainnet &&
        networkId.toString() === "Mainnet") ||
      (network === CardanoNetwork.Preprod && networkId.toString() === "Preprod")
    ) {
      return true;
    }
    return false;
  }
}

export default CardanoWallet;
