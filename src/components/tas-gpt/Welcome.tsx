import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";

export default function Welcome({}) {
  return (
    <div className="md:container relative">
      <PageHeader>
        <PageHeaderHeading className="hidden md:block">
          {"Welcome, to The Ape Society's custom GPT."}
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">
          {"How can I help you today?"}
        </PageHeaderHeading>
        <PageHeaderDescription className="hidden md:block">
          {
            "Ask me anything. Whether it's coding guidance, culinary inspirations, or a dash of creative genius, ask away and let's solve it together."
          }
        </PageHeaderDescription>
        <PageHeaderDescription className="md:hidden">
          {"The Ape Society's custom GPT."}
        </PageHeaderDescription>
      </PageHeader>
    </div>
  );
}
