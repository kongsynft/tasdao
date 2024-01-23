import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HolderDistributions } from "@/lib/constants";
import { Datum } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

type PieChartProps = {
  data: HolderDistributions;
  title: string;
};

const CustomTooltip = ({ datum }: { datum: Datum }) => (
  <div className="flex items-center text-muted-foreground bg-secondary">
    {datum.label} NFT&apos;s: {datum.value} wallets
  </div>
);

export function PieChart({ data, title }: PieChartProps) {
  const transformedData = Object.entries(data).map(([id, value]) => ({
    id,
    value,
    label: id,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-[200px] w-full">
          <ResponsivePie
            data={transformedData}
            margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
            innerRadius={0.5}
            padAngle={0.6}
            cornerRadius={10}
            colors={{ scheme: "category10" }}
            enableArcLabels={false}
            arcLinkLabelsOffset={-5}
            arcLinkLabelsDiagonalLength={8}
            arcLinkLabelsStraightLength={15}
            arcLinkLabelsTextOffset={3}
            arcLinkLabelsTextColor="hsl(var(--muted-foreground))"
            isInteractive={true}
            activeInnerRadiusOffset={2}
            activeOuterRadiusOffset={2}
            tooltip={({ datum }) => <CustomTooltip datum={datum} />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
