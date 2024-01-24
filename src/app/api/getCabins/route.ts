import { kv } from "@vercel/kv";
import * as zlib from "zlib";
import {
  ApiJpgListingsResponse,
  CabinFromJPGStore,
  CabinFromKV,
} from "@/lib/constants";
import { cookies } from "next/headers";

async function getCabinsFromJPGStore(): Promise<CabinFromJPGStore[]> {
  let cabinListings: CabinFromJPGStore[] = [];
  let cursor: string | null = null;
  let isFirstRequest = true;
  while (isFirstRequest || cursor !== null) {
    const url = `https://server.jpgstoreapis.com/policy/d4e087164acf8314f1203f0b0996f14908e2a199a296d065f14b8b09/listings${
      cursor ? `?cursor=${cursor}` : ""
    }`;
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiJpgListingsResponse = await response.json();

    cabinListings = cabinListings.concat(
      data.listings
        .filter((listing) => listing.listing_type === "SINGLE_ASSET")
        .map((listing) => ({
          id: `cabin${listing.display_name.replace(/,|\s/g, "")}`,
          assetUrl: `https://www.jpg.store/asset/${listing.asset_id}`,
          priceAda: Number(listing.price_lovelace) / 1000000,
        })),
    );
    cursor = data.nextPageCursor;
    isFirstRequest = false;
  }

  return cabinListings;
}

async function getCabinsFromKV(): Promise<CabinFromKV[]> {
  const cabins = await kv.get("cabins");
  if (typeof cabins !== "string" || !cabins) {
    throw new Error("Cabins data from KV either null or not a string");
  }
  const buffer = Buffer.from(cabins, "base64");
  const decompressed = zlib.gunzipSync(buffer);
  const cabinsJson = decompressed.toString("utf-8");
  const cabinsData = JSON.parse(cabinsJson);
  return cabinsData;
}

export async function GET() {
  cookies();
  try {
    const cabins = await getCabinsFromKV();
    const listings = await getCabinsFromJPGStore();
    const listingsMap = new Map(
      listings.map((listing) => [listing.id, listing]),
    );

    const mergedCabins = cabins.map((cabin) => {
      const listing = listingsMap.get(cabin.id);

      return {
        id: cabin.id,
        size: cabin.size,
        slvd: cabin.slvd,
        rating: cabin.rating,
        district: cabin.district,
        color: cabin.color,
        streetAddress: cabin.streetAddress,
        bottomBorder: cabin.bottom_border,
        rightBorder: cabin.right_border,
        colSpan: cabin.col_span,
        rowSpan: cabin.row_span,
        distribution: cabin.distribution,
        priceAda: listing ? listing.priceAda : null,
        assetUrl: listing ? listing.assetUrl : null,
      };
    });
    return new Response(JSON.stringify({ cabins: mergedCabins }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error in GET function:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
