import React from "react";
import { Button } from "@/components/ui/button";
import { useControls } from "react-zoom-pan-pinch";
import { Card, CardContent } from "@/components/ui/card";
import { WalletConnect } from "@/components/heatmap/WalletConnect";
type HeatmapControlsProps = {};

const HeatmapControls = ({}: HeatmapControlsProps) => {
  const { centerView, zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <Card>
      <CardContent className="py-2">
        <div className="flex justify-start md:justify-center gap-1">
          <Button variant="secondary" onClick={() => zoomIn()}>
            Zoom In
          </Button>
          <Button variant="secondary" onClick={() => zoomOut()}>
            Zoom Out
          </Button>
          <Button variant="secondary" onClick={() => resetTransform()}>
            Reset
          </Button>
          <Button variant="secondary" onClick={() => centerView()}>
            Center
          </Button>
          <WalletConnect />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapControls;
