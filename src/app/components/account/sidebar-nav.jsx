export default function SidebarNav() {
  return (
    <nav aria-label="Account sections" className="rounded-lg bg-card p-0 text-sm">
      <h2 className="mb-4 text-(--brand-maroon) font-semibold">{"My Realm"}</h2>

      <ul className="space-y-2">
        <li className="text-muted-foreground">{"My Palace"}</li>
        <li>
          <a href="#" aria-current="page" className="group flex items-center gap-2 text-(--brand-maroon) font-medium">
            <span
              aria-hidden="true"
              className="inline-block h-0 w-0 border-y-4 border-l-6 border-y-transparent border-l-(--brand-maroon)"
              style={{ borderLeftColor: "oklch(0.45 0.15 20)" }}
            />
            {"Prasthan"}
          </a>
        </li>
      </ul>
    </nav>
  )
}
