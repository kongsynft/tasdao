import { cn } from "@/lib/utils";
import { CabinDetails, landmarkDistricts } from "@/lib/constants";
import LevvyIcon from "@/images/SVG/Levvy.svg";
import PlungeIcon from "@/images/SVG/Plunge.svg";
import FactoryIcon from "@/images/SVG/Factory.svg";

interface HeatmapCellProps {
  cell: CabinDetails;
  showForSale: boolean;
  showLandmark: boolean;
  isSelected: boolean;
  selectedSizes: Set<string>;
  selectedRatings: Set<string>;
  minPrice: number | null;
  maxPrice: number | null;
  onMouseEnter: (cell: CabinDetails) => void;
  onClick: (cell: CabinDetails) => void;
}

const renderDistrictIcon = (cell: CabinDetails) => {
  if (cell.id.startsWith("empty")) {
    switch (cell.district) {
      case "Koatwoolf":
        return <LevvyIcon />;
      case "Tasama City":
        return <PlungeIcon />;
      case "Shiahib":
        return <FactoryIcon />;
      default:
        return null;
    }
  }
};

const HeatmapCell = ({
  cell,
  showForSale,
  showLandmark,
  isSelected,
  selectedSizes,
  selectedRatings,
  minPrice,
  maxPrice,
  onMouseEnter,
  onClick,
}: HeatmapCellProps) => {
  const isCellSelected = (): boolean => {
    const isSizeSelected = selectedSizes.has(cell.size);
    const isRatingSelected = selectedRatings.has(cell.rating);
    const isLandmarkSelected =
      !showLandmark || landmarkDistricts.has(cell.district);
    const shouldDisplayForSale = showForSale ? cell.priceAda !== null : true;
    const isEmptySpot = cell.id.startsWith("empty");
    const isInPriceRange = maxPrice
      ? cell.priceAda !== null &&
        cell.priceAda >= (minPrice ?? 0) &&
        cell.priceAda <= maxPrice
      : true;

    return (
      isEmptySpot ||
      (isSizeSelected &&
        isRatingSelected &&
        shouldDisplayForSale &&
        isLandmarkSelected &&
        isInPriceRange)
    );
  };

  const shouldDisplay = isCellSelected();

  return (
    <div
      className={cn(
        cell.id.startsWith("empty")
          ? "w-full h-full flex justify-center items-center"
          : "w-3 h-3",
        shouldDisplay ? cell.color : "bg-background",
        "border border-black-alpha-10",
        cell?.bottomBorder && "border-b-border",
        cell?.rightBorder && "border-r-border",
        cell.colSpan,
        cell.rowSpan,
        !cell.id.startsWith("empty") && "hover:border-primary hover:border-2",
        isSelected && "border-primary-foreground border-2",
      )}
      onMouseEnter={() => onMouseEnter(cell)}
      onClick={() => onClick(cell)}
    >
      {renderDistrictIcon(cell)}
    </div>
  );
};

export default HeatmapCell;
