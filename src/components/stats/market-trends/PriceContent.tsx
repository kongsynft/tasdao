import { DatePrice } from "@/lib/constants";
import { PriceCard } from "@/components/stats/market-trends/PriceCards";
import { PriceLineChart } from "@/components/stats/market-trends/PriceLineChart";

type ContentProps = {
  apePrices: DatePrice[];
  cabinPrices: DatePrice[];
  cotasPrices: DatePrice[];
  socPrices: DatePrice[];
};

export default function Content({
  apePrices,
  cabinPrices,
  cotasPrices,
  socPrices,
}: ContentProps) {
  return (
    <>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:mb-4">
        <PriceCard title="$SOC Price" prices={socPrices} />
        <PriceCard title="Apes Floor Price" prices={apePrices} />
        <PriceCard title="Cabin Floor Price" prices={cabinPrices} />
        <PriceCard title="COTAS Floor Price" prices={cotasPrices} />
      </div>
      <div className="md:grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <PriceLineChart title="$SOC Price" prices={socPrices} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <PriceLineChart title="Cabin Floor Price" prices={cabinPrices} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <PriceLineChart title="Ape Floor Price" prices={apePrices} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <PriceLineChart title="COTAS Floor Price" prices={cotasPrices} />
        </div>
      </div>
    </>
  );
}
