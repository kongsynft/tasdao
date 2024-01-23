import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePrice } from "@/lib/constants";
import { ThickArrowUpIcon, ThickArrowDownIcon } from "@radix-ui/react-icons";

type PriceCardProps = {
  title: string;
  prices: DatePrice[];
};

export const PriceCard: React.FC<PriceCardProps> = ({ title, prices }) => {
  function getLatestPrice(): string {
    const latestPrice = prices[prices.length - 1].price;
    return latestPrice < 10 ? latestPrice.toFixed(4) : latestPrice.toString();
  }
  function getChangedPrice(): number {
    return (
      ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) *
      100
    );
  }

  const latestPrice = getLatestPrice();
  const changedPrice = getChangedPrice();
  const inNumberOfDays = `in ${prices.length} days`;

  return (
    <Card>
      <CardHeader className="text-center md:text-left">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold text-center md:text-left">
        <div className="text-xl">{latestPrice} ADA</div>
        <div className="flex items-center justify-center md:justify-start">
          {changedPrice < 0 ? (
            <ThickArrowDownIcon className="text-destructive" />
          ) : (
            <ThickArrowUpIcon className="text-primary" />
          )}
          <span className={`text-xs text-muted-foreground`}>
            {changedPrice.toFixed(2)}% ({inNumberOfDays})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
