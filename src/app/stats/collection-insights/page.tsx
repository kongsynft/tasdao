"use client";

import { Histogram } from "@/components/stats/collection-insights/Histogram";
import { HoldersLineChart } from "@/components/stats/collection-insights/HoldersLineChart";
import { ListingsLineChart } from "@/components/stats/collection-insights/ListingsLineChart";
import { ListingsDepthLineChart } from "@/components/stats/collection-insights/ListingsDepthLineChart";
import { PieChart } from "@/components/stats/collection-insights/PieChart";
import { TableData } from "@/components/stats/collection-insights/TableData";
import {
  HolderDistributions,
  TopHolderWithRank,
  VolumeTransformedData,
  ListingsDepthResponse,
  ListingsTrended,
  HoldersTrended,
} from "@/lib/constants";
import { useEffect, useState } from "react";

export default function Page() {
  const [apeDistributions, setApeDistributions] =
    useState<HolderDistributions>();
  const [cabinDistributions, setCabinDistributions] =
    useState<HolderDistributions>();
  const [cotasDistributions, setCotasDistributions] =
    useState<HolderDistributions>();
  const [apeTopHolders, setApeTopHolders] = useState<TopHolderWithRank[]>();
  const [cabinTopHolders, setCabinTopHolders] = useState<TopHolderWithRank[]>();
  const [cotasTopHolders, setCotasTopHolders] = useState<TopHolderWithRank[]>();
  const [apeListingsDepth, setApeListingsDepth] =
    useState<ListingsDepthResponse[]>();
  const [cabinListingsDepth, setCabinListingsDepth] =
    useState<ListingsDepthResponse[]>();
  const [cotasListingsDepth, setCotasListingsDepth] =
    useState<ListingsDepthResponse[]>();
  const [volumeData, setVolumeData] = useState<VolumeTransformedData[]>();
  const [apeListingsTrended, setApeListingsTrended] =
    useState<ListingsTrended[]>();
  const [cabinListingsTrended, setCabinListingsTrended] =
    useState<ListingsTrended[]>();
  const [cotasListingsTrended, setCotasListingsTrended] =
    useState<ListingsTrended[]>();
  const [apeHoldersTrended, setApeHoldersTrended] =
    useState<HoldersTrended[]>();
  const [cabinHoldersTrended, setCabinHoldersTrended] =
    useState<HoldersTrended[]>();
  const [cotasHoldersTrended, setCotasHoldersTrended] =
    useState<HoldersTrended[]>();

  async function getHolderDistributionsData() {
    const response = await fetch("/api/taptools/holders/distributions", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeDistributions(apes);
    setCabinDistributions(cabins);
    setCotasDistributions(cotas);
  }

  async function getTopHoldersData() {
    const response = await fetch("/api/taptools/holders/top", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeTopHolders(apes);
    setCabinTopHolders(cabins);
    setCotasTopHolders(cotas);
  }

  async function getVolumeData() {
    const response = await fetch("/api/taptools/volume", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { volumeData } = await response.json();
    setVolumeData(volumeData);
  }

  async function getHoldersData() {
    const response = await fetch("/api/taptools/holders/trended", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeHoldersTrended(apes);
    setCabinHoldersTrended(cabins);
    setCotasHoldersTrended(cotas);
  }

  async function getListingsData() {
    const response = await fetch("/api/taptools/listings/trended", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeListingsTrended(apes);
    setCabinListingsTrended(cabins);
    setCotasListingsTrended(cotas);
  }

  async function getListingsDepth() {
    const response = await fetch("/api/taptools/listings/depth", {
      next: {
        revalidate: 3600,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { apes, cabins, cotas } = await response.json();
    setApeListingsDepth(apes);
    setCabinListingsDepth(cabins);
    setCotasListingsDepth(cotas);
  }

  useEffect(() => {
    getHolderDistributionsData();
    getHoldersData();
    getListingsData();
    getListingsDepth();
    getTopHoldersData();
    getVolumeData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full md:p-2">
        <div className="md:grid md:mb-4 text-center">
          {volumeData && <Histogram data={volumeData} />}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeListingsTrended && apeListingsTrended && (
            <ListingsLineChart
              listings={apeListingsTrended}
              title="Ape listings"
            />
          )}
          {cabinListingsTrended && cabinListingsTrended && (
            <ListingsLineChart
              listings={cabinListingsTrended}
              title="Cabin listings"
            />
          )}
          {cotasListingsTrended && cotasListingsTrended && (
            <ListingsLineChart
              listings={cotasListingsTrended}
              title="COTAS listings"
            />
          )}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeHoldersTrended && apeListingsTrended && (
            <HoldersLineChart holders={apeHoldersTrended} title="Ape holders" />
          )}
          {cabinHoldersTrended && cabinListingsTrended && (
            <HoldersLineChart
              holders={cabinHoldersTrended}
              title="Cabin holders"
            />
          )}
          {cotasHoldersTrended && cotasListingsTrended && (
            <HoldersLineChart
              holders={cotasHoldersTrended}
              title="COTAS holders"
            />
          )}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeDistributions && (
            <PieChart data={apeDistributions} title="Ape distribution" />
          )}
          {cabinDistributions && (
            <PieChart data={cabinDistributions} title="Cabin distribution" />
          )}
          {cotasDistributions && (
            <PieChart data={cotasDistributions} title="COTAS distribution" />
          )}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeListingsDepth && (
            <ListingsDepthLineChart
              data={apeListingsDepth}
              title="Ape listings depth"
            />
          )}
          {cabinListingsDepth && (
            <ListingsDepthLineChart
              data={cabinListingsDepth}
              title="Cabin listings depth"
            />
          )}
          {cotasListingsDepth && (
            <ListingsDepthLineChart
              data={cotasListingsDepth}
              title="Cotas listings depth"
            />
          )}
        </div>
        <div className="md:grid md:grid-cols-3 gap-4 md:mb-4">
          {apeTopHolders && (
            <TableData data={apeTopHolders} title="The Infamous TAS60" />
          )}
          {cabinTopHolders && (
            <TableData data={cabinTopHolders} title="Cabin top holders" />
          )}
          {cotasTopHolders && (
            <TableData data={cotasTopHolders} title="COTAS top holders" />
          )}
        </div>
      </div>
    </div>
  );
}
