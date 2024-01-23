import * as React from "react";
import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type CouncilApe = {
  image: string;
  member: string;
  title: string;
};

const councilApes: CouncilApe[] = [
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Bentley_Lavigne.jpg",
    member: "Ada Legend",
    title: "Council President",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Bonaventure_Green.jpg",
    member: "Kongsy",
    title: "Council Vice-President",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Carlos_King.jpg",
    member: "Devryn",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Edward_de_Medici.jpg",
    member: "Upwind Strategy",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Calhoun_Amato.jpg",
    member: "Bowjang",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/V%C3%A9nance_Baldwin.jpg",
    member: "Meta G",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Grayson_de_Balboa.jpg",
    member: "G. De Balboa",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Bradford_Rich.jpg",
    member: "Bradford Shield",
    title: "Council Member",
  },
  {
    image:
      "https://res.cloudinary.com/dj2tauktl/image/upload/v1/ape/Kipp_Taylor.jpg",
    member: "Professor Z",
    title: "Council Member",
  },
];

export function CouncilScrollArea() {
  return (
    <ScrollArea className="rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {councilApes.map((ape) => (
          <figure key={ape.member} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <Image
                src={ape.image}
                alt={`Photo by ${ape.member}`}
                className="aspect-square h-fit w-fit object-cover hover:scale-105"
                width={130}
                height={130}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              {ape.title}{" "}
              <span className="font-semibold text-foreground">
                {ape.member}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
