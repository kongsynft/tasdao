import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsDepthResponse } from "@/lib/constants";
import { Icons } from "@/lib/icons";
import { ResponsiveLine, Point } from "@nivo/line";

interface CustomGraphData {
  x: number;
  y: number;
  xFormatted: number;
  yFormatted: number;
  avg: number;
  total: number;
}

const CustomTooltip = ({ point }: { point: Point }) => {
  const customData = point.data as CustomGraphData;

  const formatNumber = (n: number) => {
    return n ? Math.round(n).toLocaleString() : "0";
  };

  return (
    <div className="p-2 bg-secondary text-muted-foreground text-sm rounded-md shadow-lg">
      <div className="flex justify-between items-center">
        <span>Price:</span>
        <span className="flex items-center ml-2">
          {formatNumber(customData.xFormatted)}
          <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span>Average:</span>
        <span className="flex items-center ml-2">
          {formatNumber(customData.avg)}
          <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span>Count:</span>
        <span>{formatNumber(customData.yFormatted as number)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Total:</span>
        <span className="flex items-center ml-2">
          {formatNumber(customData.total)}
          <Icons.cardano className="inline-block h-[14px] w-[14px] fill-current" />
        </span>
      </div>
    </div>
  );
};

type ListingsDepthLineChartProps = {
  data: ListingsDepthResponse[];
  title: string;
};

export function ListingsDepthLineChart({
  data,
  title,
}: ListingsDepthLineChartProps) {
  const transformedData = [
    {
      id: "Listing depth",
      data: data.map((item) => ({
        x: item.price,
        y: item.count,
        avg: item.avg,
        total: item.total,
      })),
    },
  ];

  function linspace(tickValues: number[], interval: number): number[] {
    const numberOfValues = tickValues.length;
    const result = new Array(interval);

    for (let i = 0; i < interval; i++) {
      const idx = Math.floor((i * (numberOfValues - 1)) / (interval - 1));
      result[i] = tickValues[idx];
    }
    return result;
  }

  const selectedTicks = linspace(
    data.map((item) => item.price),
    7,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-[350px] w-full">
          <ResponsiveLine
            data={transformedData}
            margin={{ top: 5, right: 15, bottom: 45, left: 45 }}
            colors={"hsl(var(--primary))"}
            yFormat=" >-.2f"
            curve="stepAfter"
            axisTop={null}
            axisRight={null}
            enablePoints={false}
            isInteractive={true}
            useMesh={true}
            enableCrosshair={true}
            crosshairType="x"
            enableArea={true}
            areaBaselineValue={0}
            areaOpacity={0.5}
            areaBlendMode="normal"
            tooltip={({ point }) => <CustomTooltip point={point} />}
            enableGridX={true}
            enableGridY={false}
            gridXValues={selectedTicks}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: selectedTicks,
              legend: "Floor price (ADA)",
              legendOffset: 35,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: 5,
              legend: "Number of listings",
              legendOffset: -35,
              legendPosition: "middle",
            }}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                  },
                },
                legend: {
                  text: {
                    fill: "hsl(var(--muted-foreground))",
                  },
                },
              },
              grid: {
                line: {
                  stroke: "hsl(var(--muted))",
                },
              },
              crosshair: {
                line: {
                  stroke: "hsl(var(--muted-foreground))",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
