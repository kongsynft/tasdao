// Define HeatMap constants
export const sizeOptions = ["Cottage", "Estate", "Chateau"];
export const ratingOptions = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const defaultCabin: CabinDetails = {
  id: "N/A",
  size: "Cottage",
  slvd: "N/A",
  rating: "N/A",
  district: "N/A",
  color: "N/A",
  streetAddress: "N/A",
  bottomBorder: false,
  rightBorder: false,
  colSpan: "N/A",
  rowSpan: "N/A",
  distribution: 0.0,
  priceAda: 0,
  assetUrl: "N/A",
};

export const landmarkDistricts: Set<string> = new Set([
  "Heolt",
  "Vaitmoot",
  "Shiahib",
  "Quniod",
  "Tasama City",
  "Whooss",
  "Canmard City",
  "Koatwoolf",
  "Scholnag",
  "Lanurk",
  "Doork East",
]);

// Define JPG Store API types
export type ApiListing = {
  asset_id: string;
  confirmed_at: string;
  display_name: string;
  tx_hash: string;
  lising_id: number;
  listed_at: string;
  price_lovelace: string;
  listing_type: string;
};

export type ApiJpgListingsResponse = {
  listings: ApiListing[];
  nextPageCursor: string;
};

export type CabinFromJPGStore = {
  id: string;
  assetUrl: string;
  priceAda: number;
};

export type CabinDetails = {
  id: string;
  size: string;
  slvd: string;
  rating: string;
  district: string;
  color: string;
  streetAddress: string;
  bottomBorder: boolean;
  rightBorder: boolean;
  colSpan: string;
  rowSpan: string;
  distribution: number;
  priceAda: number | null;
  assetUrl: string | null;
};

export type CabinFromKV = {
  id: string;
  x: number;
  y: number;
  size: string;
  rating: string;
  streetAddress: string;
  slvd: string;
  district: string;
  color: string;
  bottom_border: boolean;
  right_border: boolean;
  col_span: string;
  row_span: string;
  distribution: number;
};

export type DatePrice = {
  date: string;
  price: number;
};

export type HolderDistributions = {
  "1": number;
  "10-24": number;
  "2-4": number;
  "25+": number;
  "5-9": number;
};

export type TopHolder = {
  address: string;
  amount: number;
};

export type TopHolderWithRank = TopHolder & {
  rank: number;
};

export type VolumeTrended = {
  date: string;
  price: number;
  sales: number;
  volume: number;
};

export type VolumeTransformedData = {
  date: string;
  apes: number;
  cabins: number;
  cotas: number;
};

export type ListingsDepthResponse = {
  avg: number;
  count: number;
  price: number;
  total: number;
};

export type HoldersTrended = {
  date: string;
  holders: number;
};

export type ListingsTrended = {
  date: string;
  listings: number;
};

export type DaoTreasury = {
  daoTreasuryADA: string;
  daoTreasuryUSD: string;
};

export const apesPolicyId =
  "dac355946b4317530d9ec0cb142c63a4b624610786c2a32137d78e25";
export const cabinsPolicyId =
  "d4e087164acf8314f1203f0b0996f14908e2a199a296d065f14b8b09";
export const cotasPolicyId =
  "fca746f58adf9f3da13b7227e5e2c6052f376447473f4d49f8004195";
export const societyUnit =
  "25f0fc240e91bd95dcdaebd2ba7713fc5168ac77234a3d79449fc20c534f4349455459";
export const handlePolicyId =
  "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a";
export const daoStakeKey =
  "stake17xxu0kuhd00syak6msqysczv308ce44w6q7glhq9z9hajwcgmdpha";
