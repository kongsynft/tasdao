import { cabinsPolicyId, handlePolicyId } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type AssetDetailsResponse = {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: {
    name: string;
    rate: string;
    files: Array<{
      src: string;
      name: string;
      mediaType: string;
    }>;
    image: string;
    Street: string;
    District: string;
    mediaType: string;
    "Cabin Size": string;
    "SLVD Rating": string;
    description: string;
    "X Coordinate": string;
    "Y Coordinate": string;
  };
  onchain_metadata_standard: string;
  onchain_metadata_extra: null;
  metadata: null;
};

type AddressAssetsResponse = {
  unit: string;
  quantity: string;
};

type AssetAddressesResponse = {
  address: string;
  quantity: string;
};

type WalletAddressResponse = {
  address: string;
  amount: Array<{
    unit: string;
    quantity: string;
  }>;
  stake_address: string;
  type: string;
  script: boolean;
};

function isValidInput(
  input: string,
): "stakeKey" | "walletAddress" | "handle" | "invalid" {
  const stakeKeyRegex = /^stake1[0-9a-z]{53}$/;
  const walletAddressRegex = /^addr1[0-9a-zA-Z]{98}$/;
  const handleRegex = /^\$[0-9a-zA-Z]+$/;

  if (stakeKeyRegex.test(input)) {
    return "stakeKey";
  } else if (walletAddressRegex.test(input)) {
    return "walletAddress";
  } else if (handleRegex.test(input)) {
    return "handle";
  } else {
    return "invalid";
  }
}

async function getInputStakeKey(input: string): Promise<string> {
  switch (isValidInput(input)) {
    case "stakeKey":
      return input;
    case "walletAddress":
      return addressToStakeKey(input);
    case "handle":
      return handleToStakeKey(input.slice(1));
    case "invalid":
    default:
      throw new Error("Invalid input");
  }
}

async function addressToStakeKey(address: string): Promise<string> {
  const response = await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}`,
    {
      headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "API call failed for wallet address " + address + " with response:",
      {
        endpoint: response.url,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      },
    );
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`,
    );
  }

  const addressToStakeKey: WalletAddressResponse = await response.json();
  return addressToStakeKey.stake_address;
}

async function handleToStakeKey(handle: string): Promise<string> {
  const handleHexEncoded = Buffer.from(handle).toString("hex");
  const handleAddressResponse = await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0/assets/${handlePolicyId}${handleHexEncoded}/addresses`,
    {
      headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
    },
  );

  if (!handleAddressResponse.ok) {
    const errorText = await handleAddressResponse.text();
    console.error("API call failed for handle " + handle + " with response:", {
      endpoint: handleAddressResponse.url,
      status: handleAddressResponse.status,
      statusText: handleAddressResponse.statusText,
      errorBody: errorText,
    });
    throw new Error(
      `API call failed: ${handleAddressResponse.status} ${handleAddressResponse.statusText}`,
    );
  }
  const assetAddresses: AssetAddressesResponse[] =
    await handleAddressResponse.json();
  const address = assetAddresses[0].address;
  return addressToStakeKey(address);
}

async function fetchCabinIds(
  addressAssets: AddressAssetsResponse[],
): Promise<string[]> {
  const cabinNames: string[] = [];

  for (const asset of addressAssets) {
    const response = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}`,
      {
        headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API call failed for asset " + asset.unit + " with response:",
        {
          endpoint: response.url,
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
        },
      );
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`,
      );
    }

    const assetDetails: AssetDetailsResponse = await response.json();
    const cleanedName =
      "cabin" + assetDetails.onchain_metadata.name.replace(/[., ]/g, "");
    cabinNames.push(cleanedName);
  }

  return cabinNames;
}

async function fetchStakeKeyAssets(
  stakeKey: string,
  policyId: string,
): Promise<AddressAssetsResponse[]> {
  let assets: AddressAssetsResponse[] = [];
  let page = 1;
  const count = 100;

  while (true) {
    const response = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/accounts/${stakeKey}/addresses/assets?count=${count}&page=${page}`,
      {
        headers: { project_id: process.env.BLOCKFROST_API_KEY as string },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API call failed for stake key " + stakeKey + " with response:",
        {
          endpoint: response.url,
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
        },
      );
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: AddressAssetsResponse[] = await response.json();
    const filteredData = data.filter((asset) =>
      asset.unit.startsWith(policyId),
    );
    assets = assets.concat(filteredData);

    if (data.length < count) {
      break;
    }

    page++;
  }

  return assets;
}

export async function GET(request: NextRequest) {
  cookies();
  if (
    typeof process.env.BLOCKFROST_API_KEY !== "string" ||
    process.env.BLOCKFROST_API_KEY.trim() === ""
  ) {
    throw Error("Missing or invalid Blockfrost API key");
  }

  const input = request.nextUrl.searchParams.get("input");
  if (!input) {
    return new Response(JSON.stringify({ error: "Missing input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const inputType = isValidInput(input);
  if (inputType === "invalid") {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const stakeKey = await getInputStakeKey(input);

  try {
    const walletCabins = await fetchStakeKeyAssets(stakeKey, cabinsPolicyId);
    const cabinIds: string[] = await fetchCabinIds(walletCabins);
    return new Response(JSON.stringify({ cabinIds: cabinIds }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
