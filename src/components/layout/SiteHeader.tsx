"use client";

import { ModeToggle } from "@/components/layout/ModeToggle";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-9 px-0",
            )}
          >
            <Icons.tas_crown className="h-7 w-7 fill-current" />
          </div>
          <span className="hidden font-bold sm:inline-block">tasdao</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/heatmap"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/heatmap"
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Heatmap
          </Link>
          <Link
            href="/stats/market-trends"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/stats" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Stats
          </Link>
          <Link
            href="/tas-gpt"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/tas-gpt"
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            TAS-GPT
          </Link>
        </nav>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center">
            <Link
              href="https://twitter.com/kongsynft"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0",
                )}
              >
                <Icons.twitter className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
