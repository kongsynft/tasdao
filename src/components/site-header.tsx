import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container mx-auto max-w-screen-xl flex h-14 items-center justify-between px-4 lg:px-8">
          {/* Leftmost: Link to Home */}
          <Link href="/" className="flex items-center gap-2">
            <Icons.tas_crown className="h-8 w-8 fill-current" />
            <span className="hidden font-bold lg:inline-block">
              {siteConfig.name}
            </span>
          </Link>

          {/* Rightmost: Twitter Button and Dark Mode Toggle */}
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.twitter className="h-8 w-8 fill-current" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <DarkModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
