import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolumeTransformedData } from "@/lib/constants";
import { Icons } from "@/lib/icons";
import { ResponsiveBar, BarTooltipProps } from "@nivo/bar";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HistogramProps = {
  data: VolumeTransformedData[];
};

export function setTickValues(
  data: VolumeTransformedData[],
  numberOfValues: number,
) {
  let interval;
  switch (numberOfValues) {
    case 180:
      interval = 20;
      break;
    case 90:
      interval = 10;
      break;
    case 30:
      interval = 5;
      break;
    case 7:
      interval = 1;
      break;
    default:
      interval = 5;
  }

  const tickValues = [];
  for (let i = 0; i < data.length; i += interval) {
    tickValues.push(data[i].date);
  }
  return tickValues;
}

const CustomTooltip = ({
  indexValue,
  data,
}: BarTooltipProps<VolumeTransformedData>) => {
  const date = new Date(indexValue as string);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedDate = formatter.format(date);

  const formatVolume = (volume: number) => {
    return volume ? Math.round(volume).toLocaleString() : "0";
  };

  const { apes, cabins, cotas } = data;

  return (
    <div className="p-2 bg-secondary text-muted-foreground text-sm rounded-md shadow-lg">
      <div className="font-bold mb-1">{formattedDate}</div>
      <div>
        Cotas: {formatVolume(cotas)}{" "}
        <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
      </div>
      <div>
        Cabins: {formatVolume(cabins)}{" "}
        <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
      </div>
      <div>
        Apes: {formatVolume(apes)}{" "}
        <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
      </div>
    </div>
  );
};

export function Histogram({ data }: HistogramProps) {
  const [selectedRange, setSelectedRange] = useState<number>(180);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth <= 750) {
      handleTabChange("30days");
    }
  }, [windowWidth]);

  const filterDataByRange = (data: VolumeTransformedData[], range: number) => {
    return data.slice(Math.max(data.length - range, 0));
  };

  const handleTabChange = (value: string) => {
    const range = parseInt(value.replace("days", ""), 10);
    setSelectedRange(range);
  };

  const formatYAxisValue = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    } else {
      return value.toString();
    }
  };

  const filteredVolumeData = data ? filterDataByRange(data, selectedRange) : [];
  const tickValues = setTickValues(
    filteredVolumeData,
    filteredVolumeData.length,
  );
  const tabDaysValues = ["180days", "30days"];

  return (
    <Card>
      <CardHeader className="relative flex flex-row items-center justify-start">
        <div className="absolute left-0 ml-4 hidden md:block">
          <Tabs
            defaultValue="180days"
            onValueChange={handleTabChange}
            className="absolute left-0 justify-start ml-4"
          >
            <TabsList>
              {tabDaysValues.map((value) => (
                <TabsTrigger key={value} value={value}>
                  {value.replace("days", " days")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-grow justify-center items-center">
          <div className="flex flex-col items-center">
            <CardTitle>Daily Volume</CardTitle>
            <CardDescription>in ADA, past 6 months</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-[350px] w-full">
          <ResponsiveBar
            data={filteredVolumeData}
            margin={{ top: 10, right: 60, bottom: 20, left: 50 }}
            keys={["apes", "cabins", "cotas"]}
            indexBy={"date"}
            groupMode={"stacked"}
            layout={"vertical"}
            colors={{ scheme: "category10" }}
            minValue={0}
            maxValue={"auto"}
            enableLabel={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: tickValues,
              format: (value) => {
                const date = new Date(value);
                const formatter = new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                });
                return formatter.format(date);
              },
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: 5,
              format: formatYAxisValue,
            }}
            animate={true}
            motionConfig="gentle"
            tooltip={CustomTooltip}
            legends={[
              {
                dataFrom: "keys",
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 3,
                itemWidth: 0,
                itemHeight: 10,
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 10,
              },
            ]}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                  },
                },
              },
              legends: {
                text: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                },
              },
              grid: {
                line: {
                  stroke: "hsl(var(--muted))",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
