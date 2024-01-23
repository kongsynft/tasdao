"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    name: "Market Trends",
    href: "/stats/market-trends",
  },
  {
    name: "Collection Insights",
    href: "/stats/collection-insights",
  },
];

interface StatsNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StatsNav({ className, ...props }: StatsNavProps) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div className={cn("mb-4 flex items-center", className)} {...props}>
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
              pathname?.startsWith(item.href) ||
                (item.href.includes("market-trends") && pathname === "/stats")
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
