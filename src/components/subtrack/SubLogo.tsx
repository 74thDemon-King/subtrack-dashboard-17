import type { Subscription } from "@/types/subscription";

export function SubLogo({ sub, size = 40 }: { sub: Pick<Subscription, "name" | "color" | "logo">; size?: number }) {
  const label = sub.logo && sub.logo.length > 0 ? sub.logo : sub.name.charAt(0).toUpperCase();
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
