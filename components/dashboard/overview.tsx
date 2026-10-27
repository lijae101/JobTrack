
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  Clock3,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sampleApplications, type ApplicationStatus } from "@/lib/sample-data";

function getStatusClasses(status: ApplicationStatus) {
  switch (status) {
    case "Wishlist":
      return "border-slate-200 bg-slate-50 text-slate-700";
    case "Applied":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Interview":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "Offer":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Withdrawn":
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

const metrics = [
  {
    label: "Total applications",
    value: sampleApplications.filter(
      (application) => application.status !== "Wishlist",
    ).length,
    detail: "Applications submitted",
    icon: BriefcaseBusiness,
  },
  {
    label: "Interviews",
    value: sampleApplications.filter(
      (application) => application.status === "Interview",
    ).length,
    detail: "In the interview stage",
    icon: Users,
  },
  {
    label: "Offers",
    value: sampleApplications.filter(
      (application) => application.status === "Offer",
    ).length,
    detail: "Offers received",
    icon: CircleCheck,
  },
  {
    label: "Rejected",
    value: sampleApplications.filter(
      (application) => application.status === "Rejected",
    ).length,
    detail: "Applications declined",
    icon: Clock3,
  },
];

export function Overview() {
  const recentApplications = [...sampleApplications]
    .filter((application) => application.appliedAt !== null)
    .sort((a, b) => b.appliedAt!.localeCompare(a.appliedAt!))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Tuesday, October 27, 2026
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s how your job search is going.
          </p>
        </div>

        <a
          href="/applications"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <BriefcaseBusiness className="size-4" />
          Add application
        </a>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = index === 3 ? ArrowDownRight : ArrowUpRight;

          return (
            <Card key={metric.label} className="gap-4 py-5 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between gap-2 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent className="px-5">
                <p className="text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendIcon className="size-3.5" />
                  {metric.detail}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Recent applications</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of your latest submitted applications.
            </p>
          </div>

          <a
            href="/applications"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-4" />
          </a>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Position</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Applied</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {recentApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {application.company}
                    </td>
                    <td className="min-w-48 px-5 py-4 text-muted-foreground">
                      <div>{application.jobTitle}</div>
                      <div className="mt-1 text-xs">
                        {application.location}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge
                        variant="outline"
                        className={getStatusClasses(application.status)}
                      >
                        {application.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {application.appliedAt
                        ? new Date(
                            `${application.appliedAt}T12:00:00`,
                          ).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentApplications.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              No applications yet. Add your first application to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        Keep your applications updated to track your progress.
      </div>
    </div>
  );
}
