import { ClipboardCheck, FileSearch, ShieldCheck, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ASSURANCE_POINTS, SECTIONS } from "../../data/companyData";
import { Section } from "../ui/Section";

const ICONS: Record<string, LucideIcon> = {
  gates: UserCheck,
  evidence: ClipboardCheck,
  adversarial: ShieldCheck,
  boundaries: FileSearch,
};

/**
 * Assurance section for buyers who get audited (reference pattern G).
 *
 * Deliberately makes no certification claims. The reference sites list SOC 2
 * and ISO 27001; VipraTech holds neither, so this section lists practices we
 * actually follow instead (docs/01-brand-guidelines.md §6.1).
 */
export function Assurance() {
  return (
    <Section id="assurance" intro={SECTIONS.assurance}>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {ASSURANCE_POINTS.map((point) => {
          const Icon = ICONS[point.id] ?? ShieldCheck;
          return (
            <li
              key={point.id}
              className="flex gap-4 rounded-2xl border border-hairline bg-surface/70 p-6"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-h3 font-bold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{point.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
