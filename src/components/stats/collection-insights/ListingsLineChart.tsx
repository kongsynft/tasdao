import React from "react";
import { ResponsiveLine, Point } from "@nivo/line";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingsTrended } from "@/lib/constants";

type ListingsLineChartProps = {
  listings: ListingsTrended[];
  title: string;
};

const CustomTooltip = ({ point }: { point: Point }) => {
  const date = new Date(point.data.xFormatted);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  const formattedDate = formatter.format(date);

  return (
    <div className="flex px-2 py-1 items-center rounded-lg text-foreground bg-secondary">
      {formattedDate}: {Math.round(point.data.yFormatted as number)}
      {" listings"}
    </div>
  );
};

export const ListingsLineChart: React.FC<ListingsLineChartProps> = ({
  title,
  listings,
}) => {
  const transformedData = [
    {
      id: "Listings",
      data: listings.map((item) => ({
        x: new Date(item.date).toISOString(),
        y: item.listings,
      })),
    },
  ];

  const yMaxValue = Math.max(...transformedData[0].data.map((item) => item.y));
  const yMinValue = Math.min(...transformedData[0].data.map((item) => item.y));
  const margin = (yMaxValue - yMinValue) * 0.15;
  const yMinChart = yMinValue - margin;
  const yMaxChart = yMaxValue + margin;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-[350px] w-full">
          <ResponsiveLine
            data={transformedData}
            margin={{ top: 0, right: 5, bottom: 30, left: 50 }}
            colors={"hsl(var(--primary))"}
            xFormat="time:%Y-%m-%dT%H:%M:%S.%LZ"
            xScale={{
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              type: "time",
              precision: "hour",
              useUTC: true,
            }}
            yScale={{
              type: "linear",
              min: yMinChart,
              max: yMaxChart,
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="natural"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: "every 30 days",
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
              legend: "Number of listings",
              legendOffset: -45,
              legendPosition: "middle",
              tickValues: 5,
            }}
            enablePoints={false}
            enableGridX={false}
            enableGridY={true}
            isInteractive={true}
            useMesh={true}
            enableCrosshair={true}
            crosshairType="x"
            tooltip={({ point }) => <CustomTooltip point={point} />}
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
};

export default ListingsLineChart;
