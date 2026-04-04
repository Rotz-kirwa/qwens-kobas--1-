import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LinkCard } from "@/data/siteSeo";

interface ResourceGridProps {
  title: string;
  intro?: string;
  items: LinkCard[];
}

const ResourceGrid = ({ title, intro, items }: ResourceGridProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-primary">Related Resources</p>
        <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">{title}</h2>
        {intro ? <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{intro}</p> : null}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${item.to}-${item.title}`}
            className="rounded-[26px] border border-border/70 bg-card p-6 shadow-[0_14px_34px_rgba(24,17,8,0.06)]"
          >
            {item.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">{item.eyebrow}</p>
            ) : null}
            <h3 className="mt-3 font-display text-2xl font-light text-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            <Link
              to={item.to}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
            >
              {item.ctaLabel || "Explore"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ResourceGrid;
