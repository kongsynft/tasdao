import { StatsNav } from "@/components/stats/StatsNav";
import { Announcement } from "@/components/ui/announcement";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";

type StatsLayoutProps = {
  children: React.ReactNode;
};

export default function StatsLayout({ children }: StatsLayoutProps) {
  return (
    <div className="md:container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading className="hidden md:block">
          Chart your course through TAS
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">
          The Ape Society Charts
        </PageHeaderHeading>
        <PageHeaderDescription className="hidden md:block">
          Your ultimate vantage point for all TAS assets, with data updated
          every 5 minutes. Track trends and witness price swings!
        </PageHeaderDescription>
        <PageHeaderDescription className="md:hidden">
          Data updated every 5 minutes.
        </PageHeaderDescription>
      </PageHeader>
      <section>
        <StatsNav />
        <div className="overflow-hidden rounded-[0.5rem] md:border bg-background shadow-md md:shadow-xl">
          {children}
        </div>
      </section>
    </div>
  );
}
