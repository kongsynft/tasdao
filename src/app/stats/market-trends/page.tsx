"use client";

import { useEffect, useState } from "react";
import { DatePrice } from "@/lib/constants";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import Content from "@/components/stats/market-trends/PriceContent";

export default function Page() {
  const [societyPrices, setSocietyPrices] = useState<DatePrice[]>();
  const [apePrices, setApePrices] = useState<DatePrice[]>();
  const [cabinPrices, setCabinPrices] = useState<DatePrice[]>();
  const [cotasPrices, setCotasPrices] = useState<DatePrice[]>();
  const [selectedRange, setSelectedRange] = useState<number>(180);

  const filterDataByRange = (data: DatePrice[], range: number) => {
    return data.slice(Math.max(data.length - range, 0));
  };

  const handleTabChange = (value: string) => {
    const range = parseInt(value.replace("days", ""), 10);
    setSelectedRange(range);
  };

  async function getData() {
    const response = await fetch("/api/taptools/prices", {
      next: {
        revalidate: 300,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { society, apes, cabins, cotas } = await response.json();
    setSocietyPrices(society);
    setApePrices(apes);
    setCabinPrices(cabins);
    setCotasPrices(cotas);
  }

  useEffect(() => {
    getData();
  }, []);

  const filteredSocietyPrices = societyPrices
    ? filterDataByRange(societyPrices, selectedRange)
    : [];
  const filteredApePrices = apePrices
    ? filterDataByRange(apePrices, selectedRange)
    : [];
  const filteredCabinPrices = cabinPrices
    ? filterDataByRange(cabinPrices, selectedRange)
    : [];
  const filteredCotasPrices = cotasPrices
    ? filterDataByRange(cotasPrices, selectedRange)
    : [];

  const tabDaysValues = ["180days", "90days", "30days", "7days"];

  return (
    <Tabs defaultValue="180days" onValueChange={handleTabChange}>
      <TabsList>
        {tabDaysValues.map((value) => (
          <TabsTrigger key={value} value={value}>
            {value.replace("days", " days")}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex items-center justify-center">
        <div className="max-w-7xl w-full md:p-2">
          {tabDaysValues.map((value) => (
            <TabsContent key={value} value={value} className="space-y-4">
              {apePrices && (
                <Content
                  apePrices={filteredApePrices}
                  cabinPrices={filteredCabinPrices}
                  cotasPrices={filteredCotasPrices}
                  socPrices={filteredSocietyPrices}
                />
              )}
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
