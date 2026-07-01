import { Link } from "@tanstack/react-router";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span
        className={`grid h-10 w-10 place-items-center rounded-lg font-display text-lg font-bold shadow-soft transition group-hover:scale-[1.03] ${
          inverse ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        }`}
        aria-hidden
      >
        RK
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display text-base font-bold ${inverse ? "text-white" : "text-foreground"}`}>
          Royal King
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
            inverse ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          Insurance Agencies
        </span>
      </span>
    </Link>
  );
}
