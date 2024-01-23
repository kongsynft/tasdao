import React from "react";
import { ResponsiveLine, Point } from "@nivo/line";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/lib/icons";

type PriceLineChartProps = {
  prices: { date: string; price: number }[];
  title: string;
};

const CustomTooltip = ({ point }: { point: Point }) => {
  const date = new Date(point.data.xFormatted);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  });
  const formattedDate = formatter.format(date);

  return (
    <div className="flex items-center text-muted-foreground bg-secondary">
      {formattedDate}: {point.data.yFormatted}{" "}
      <Icons.cardano className="h-[14px] w-[14px] fill-current" />
    </div>
  );
};

function setTickValues(numberOfValues: number) {
  let tickValues;
  switch (numberOfValues) {
    case 180:
      tickValues = "every 20 days";
      break;
    case 90:
      tickValues = "every 10 days";
      break;
    case 30:
      tickValues = "every 5 days";
      break;
    case 7:
      tickValues = "every day";
      break;
    default:
      tickValues = "every 5 days";
  }
  return tickValues;
}

export const PriceLineChart: React.FC<PriceLineChartProps> = ({
  title,
  prices,
}) => {
  const transformedData = [
    {
      id: "Prices",
      data: prices.map((item) => ({
        x: new Date(item.date).toISOString(),
        y: item.price,
      })),
    },
  ];

  const yMaxValue = Math.max(...transformedData[0].data.map((item) => item.y));
  const yMinValue = Math.min(...transformedData[0].data.map((item) => item.y));
  const margin = (yMaxValue - yMinValue) * 0.15;
  const yMinChart = yMinValue - margin;
  const yMaxChart = yMaxValue + margin;
  const tickValues = setTickValues(prices.length);

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
              legend: "Floor price (ADA)",
              legendOffset: -45,
              legendPosition: "middle",
              tickValues: 5,
            }}
            enablePoints={true}
            pointSize={6}
            pointBorderWidth={2}
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

export default PriceLineChart;
