
import Link from "next/link";
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  SquareKanban,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: BriefcaseBusiness,
  },
  {
    label: "Board",
    href: "/board",
    icon: SquareKanban,
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BriefcaseBusiness className="size-5" />
        </div>

        <div>
          <p className="text-lg font-semibold tracking-tight">JobTrack</p>
          <p className="text-xs text-muted-foreground">
            Your career workspace
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const isOverview = item.href === "/";

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isOverview ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isOverview
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="size-4" />
          Settings
        </Link>

        <div className="mt-3 flex items-center gap-3 rounded-lg p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Job Seeker</p>
            <p className="truncate text-xs text-muted-foreground">
              Personal workspace
            </p>
          </div>
          <ChartNoAxesCombined className="ml-auto size-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
