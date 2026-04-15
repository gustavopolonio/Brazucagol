import { ActionButton } from "@/components/layout/ActionButton";
import type { ActionButtonData } from "@/components/layout/layoutTypes";

const actionButtons: ActionButtonData[] = [
  {
    label: "AUTO",
    primaryColor: "var(--action-auto-primary)",
    secondaryColor: "var(--action-auto-secondary)",
    cooldownRemainingSeconds: 0,
    cooldownTotalSeconds: 90,
  },
  {
    label: "PÊNALTI",
    primaryColor: "var(--action-penalty-primary)",
    secondaryColor: "var(--action-penalty-secondary)",
    cooldownRemainingSeconds: 87,
    cooldownTotalSeconds: 180,
  },
  {
    label: "FALTA",
    primaryColor: "var(--action-free-kick-primary)",
    secondaryColor: "var(--action-free-kick-secondary)",
    cooldownRemainingSeconds: 42,
    cooldownTotalSeconds: 150,
  },
  {
    label: "TIKI-TAKA",
    primaryColor: "var(--action-trail-primary)",
    secondaryColor: "var(--action-trail-secondary)",
    cooldownRemainingSeconds: 0,
    cooldownTotalSeconds: 120,
  },
];

export function ActionBar() {
  return (
    <section className="mx-auto w-115">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {actionButtons.map((actionButton) => (
          <ActionButton key={actionButton.label} actionButton={actionButton} />
        ))}
      </div>
    </section>
  );
}
