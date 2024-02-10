import Image from "next/image";
import cottage from "@/images/Cottage.png";
import estate from "@/images/Estate.png";
import chateau from "@/images/Chateau.png";
import { sizeOptions, ratingOptions, CabinDetails } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/icons";
import JpgIcon from "@/images/JpgDarkMode.png";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface CabinInfobarProps {
  cell: CabinDetails;
  sizes: Set<string>;
  ratings: Set<string>;
  showForSale: boolean;
  showLandmark: boolean;
  showNonLandmarks: boolean;
  isCabinSelected: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  toggleSizeFilter: (size: string) => void;
  toggleRating: (rating: string) => void;
  selectAllRatings: () => void;
  deselectAllRatings: () => void;
  toggleForSale: () => void;
  toggleLandmarkFilter: () => void;
  toggleNonLandmarksFilter: () => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  resetSearch: () => void;
}

const CabinInfobar = ({
  cell,
  sizes,
  ratings,
  showForSale,
  showLandmark,
  showNonLandmarks,
  isCabinSelected,
  minPrice,
  maxPrice,
  toggleSizeFilter,
  toggleRating,
  selectAllRatings,
  deselectAllRatings,
  toggleForSale,
  toggleLandmarkFilter,
  toggleNonLandmarksFilter,
  setMinPrice,
  setMaxPrice,
  searchKey,
  setSearchKey,
  handleSearch,
  resetSearch,
}: CabinInfobarProps) => {
  function getImage(size: string) {
    const lowerCaseSize = size.toLowerCase();

    if (lowerCaseSize === "cottage") {
      return cottage;
    } else if (lowerCaseSize === "estate") {
      return estate;
    } else if (lowerCaseSize === "chateau") {
      return chateau;
    } else {
      return cottage;
    }
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value === "" ? null : Number(value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value === "" ? null : Number(value));
  };

  return (
    <Card className={cn("", isCabinSelected ? "border border-white" : "")}>
      <CardHeader>
        <CardTitle>Cabin Information</CardTitle>
        <CardDescription>Explore the collection</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <Image src={getImage(cell.size)} alt={cell.size} />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">DETAILS</span>
          </div>
        </div>
        <p className="text-sm font-medium leading-tight">Size: {cell.size}</p>
        <p className="text-sm font-medium leading-tight">SLVD: {cell.slvd}</p>
        <p className="text-sm font-medium leading-tight">
          District: {cell.district}
        </p>
        <p className="text-sm font-medium leading-tight">
          Street: {cell.streetAddress}
        </p>
        <p className="flex items-center text-sm font-medium leading-tight">
          Price:{" "}
          {cell.priceAda !== null && cell.assetUrl !== null ? (
            <>
              {cell.priceAda.toString()}
              <Icons.cardano className="h-[14px] w-[14px] fill-current" />
            </>
          ) : (
            "Not for sale"
          )}
          {cell.priceAda !== null && cell.assetUrl !== null && (
            <Link
              href={cell.assetUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2"
            >
              <Image src={JpgIcon} alt={"jpg-icon"} className="h-4 w-fit" />
            </Link>
          )}
        </p>
        <p className="text-sm font-medium leading-tight">
          Distribution:{" "}
          {cell.distribution !== 0 ? `${cell.distribution.toString()}%` : "N/A"}
        </p>
        {cell.distribution > 0 && cell.priceAda !== null && (
          <p className="flex items-center text-sm font-medium leading-tight">
            ADA per %: {Math.round(cell.priceAda / cell.distribution)}
            <Icons.cardano className="h-[14px] w-[14px] fill-current" />
          </p>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">FILTERS</span>
          </div>
        </div>
        <p className="text-lg font-medium text-left">Sizes</p>
        <div className="flex items-center gap-1">
          {sizeOptions.map((size) => (
            <>
              <Checkbox
                id={size}
                checked={sizes.has(size)}
                onClick={() => toggleSizeFilter(size)}
              />
              <Label htmlFor={size}>{size}</Label>
            </>
          ))}
        </div>
        <div className="text-lg font-medium text-left">Districts</div>
        <div className="flex items-center space-x-2">
          <Switch
            id="landmark"
            checked={showLandmark}
            onClick={toggleLandmarkFilter}
          />
          <Label htmlFor="landmark">Landmark Districts</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="non-landmarks"
            checked={showNonLandmarks}
            onClick={toggleNonLandmarksFilter}
          />
          <Label htmlFor="non-landmarks">Non Landmark Districts</Label>
        </div>
        <div className="text-lg font-medium text-left">Ratings</div>
        <div className="grid grid-cols-6 gap-1">
          {ratingOptions.map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={rating}
                checked={ratings.has(rating)}
                onClick={() => toggleRating(rating)}
              />
              <label
                htmlFor={rating}
                className="text-sm m-[0.1rem] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70e"
              >
                {rating}
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" onClick={selectAllRatings}>
            Select All
          </Button>
          <Button variant="secondary" onClick={deselectAllRatings}>
            Deselect All
          </Button>
        </div>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">LISTINGS</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="for-sale" checked={showForSale} onClick={toggleForSale} />
          <Label htmlFor="for-sale">For Sale</Label>
        </div>
        <div className="my-4">
          <Label htmlFor="minPrice">Min Price (ADA)</Label>
          <Input
            type="number"
            id="minPrice"
            placeholder=""
            value={minPrice !== null ? minPrice : ""}
            onChange={handleMinPriceChange}
          />
          <Label htmlFor="maxPrice">Max Price (ADA)</Label>
          <Input
            type="number"
            id="maxPrice"
            placeholder=""
            value={maxPrice !== null ? maxPrice : ""}
            onChange={handleMaxPriceChange}
          />
        </div>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">SEARCH</span>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-sm items-center space-y-2">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              className="pl-8"
              type="search"
              placeholder="Stake address, $handle"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-center space-x-2">
            <Button type="button" onClick={resetSearch}>
              Reset
            </Button>
            <Button type="submit" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CabinInfobar;
