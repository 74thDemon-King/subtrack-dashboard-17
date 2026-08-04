import type { Subscription } from "@/types/subscription";
import * as brandIcons from "simple-icons";

type BrandIcon = {
  title: string;
  hex: string;
  path: string;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const ICONS = Object.values(brandIcons) as BrandIcon[];

const BRAND_ALIASES: Record<string, string> = {
  googleone: "googlecloud",
  youtubepremium: "youtube",
  microsoft365: "microsoftoffice",
  icloudplus: "icloud",
};

function findBrandIcon(name: string) {
  const query = normalize(name);
  if (!query) return undefined;
  const expectedTitle = BRAND_ALIASES[query] ?? query;
  return ICONS.find((icon) => normalize(icon.title) === expectedTitle);
}

export function SubLogo({ sub, size = 40 }: { sub: Pick<Subscription, "name" | "color" | "logo">; size?: number }) {
  const brandIcon = findBrandIcon(sub.name);
  const label = sub.logo && sub.logo.length > 0 ? sub.logo : sub.name.charAt(0).toUpperCase();

  if (brandIcon) {
    return (
      <div
        className="grid shrink-0 place-items-center rounded-xl bg-card shadow-sm ring-1 ring-border"
        style={{ width: size, height: size, color: `#${brandIcon.hex}` }}
        aria-label={`${brandIcon.title} logo`}
        role="img"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-[55%] w-[55%] fill-current">
          <path d={brandIcon.path} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="grid shrink-0 place-items-center rounded-xl font-semibold text-white shadow-sm"
      style={{ width: size, height: size, backgroundColor: sub.color, fontSize: size * 0.42 }}
      aria-hidden
    >
      {label}
    </div>
  );
}
