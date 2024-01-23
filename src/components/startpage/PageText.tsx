import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import { Announcement } from "@/components/ui/announcement";

export const PageText = () => {
  return (
    <div className="md:container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading className="hidden md:block">
          The Ape Society Foundation
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">
          The Ape Society Foundation
        </PageHeaderHeading>
        <PageHeaderDescription className="hidden md:block">
          Powerful tools to shape your journey through TAS ecosystem. Created by
          the DAO, for the DAO.
        </PageHeaderDescription>
        <PageHeaderDescription className="md:hidden">
          By the DAO, for the DAO.
        </PageHeaderDescription>
      </PageHeader>
    </div>
  );
};
