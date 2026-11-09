
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  BriefcaseBusiness,
  ChevronDown,
  Trash2,
  Search,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ApplicationStatus } from "@/lib/models/application";
import {
  getApplications,
  deleteApplication,
  type JobApplication,
} from "@/lib/api/applications";


type SortOption = "newest" | "oldest" | "company";

const statuses: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

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

function formatDate(date: string | null | undefined) {
  if (!date) return "—";

  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  const parsedDate = new Date(year, month - 1, day, 12);

  return parsedDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sort, setSort] = useState<SortOption>("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  
  async function handleDelete(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application? This action cannot be undone."
  );

  if (!confirmed) return;

  setDeletingId(id);

  try {
    await deleteApplication(id);

    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  } catch (error) {
    window.alert(
      error instanceof Error
        ? error.message
        : "Failed to delete application."
    );
  } finally {
    setDeletingId(null);
  }
}


  useEffect(() => {
  async function loadApplications() {
    try {
      setIsLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  loadApplications();
}, []);


  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications
      .filter((application) => {
        const matchesSearch =
          application.company.toLowerCase().includes(query) ||
          application.jobTitle.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All statuses" ||
          application.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "company") {
          return a.company.localeCompare(b.company);
        }

        if (!a.appliedAt) return 1;
        if (!b.appliedAt) return -1;

        return sort === "newest"
  ? new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  : new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      });
  }, [applications, search, statusFilter, sort]);

  const submittedCount = applications.filter(
    (application) => application.status !== "Wishlist",
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1 space-y-7 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Keep every opportunity organized.
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                All applications
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {submittedCount} submitted{" "}
                {submittedCount === 1 ? "application" : "applications"} in
                your job search.
              </p>
            </div>

            <Button
                onClick={() => {
                window.location.href = "/applications/new";
                }}
            >
            <BriefcaseBusiness className="size-4" />
            Add application
            </Button>
          </div>

          {isLoading && (
  <p className="text-sm text-muted-foreground">
    Loading your applications...
  </p>
)}

{error && (
  <p className="text-sm text-destructive">
    {error}
  </p>
)}
          <Card className="gap-0 py-0 shadow-none">
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search company or job title..."
                    aria-label="Search company or job title"
                    className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by status"
                    className="h-10 w-full appearance-none rounded-md border bg-background py-2 pl-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-48"
                  >
                    <option>All statuses</option>
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as SortOption)
                    }
                    aria-label="Sort applications"
                    className="h-10 w-full appearance-none rounded-md border bg-background py-2 pl-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-44"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="company">Company A–Z</option>
                  </select>
                  <ArrowDownUp className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredApplications.length} of{" "}
                  {applications.length} records
                </span>
                {(search || statusFilter !== "All statuses") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All statuses");
                    }}
                    className="font-medium text-foreground hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </CardContent>

            <div className="overflow-x-auto border-t">
              <table className="w-full text-left text-sm">
  <thead className="bg-muted/40 text-xs text-muted-foreground">
    <tr>
      <th className="px-5 py-3 font-medium">Company</th>
      <th className="px-5 py-3 font-medium">Position</th>
      <th className="px-5 py-3 font-medium">Status</th>
      <th className="px-5 py-3 font-medium">Location</th>
      <th className="px-5 py-3 font-medium">Applied</th>
      <th className="px-5 py-3 text-right font-medium">Actions</th>
    </tr>
  </thead>

  <tbody className="divide-y">
    {filteredApplications.map((application) => (
      <tr
        key={application.id}
        className="transition-colors hover:bg-muted/30"
      >
        <td className="whitespace-nowrap px-5 py-4 font-medium">
          {application.company}
        </td>

        <td className="min-w-48 px-5 py-4">
          {application.jobTitle}
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
          {application.location}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
          {formatDate(application.appliedAt)}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-right">
          <div className="flex justify-end gap-2">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() =>
      router.push(`/applications/${application.id}/edit`)
    }
  >
    <Pencil className="mr-2 size-4" />
    Edit
  </Button>

  <Button
    type="button"
    variant="outline"
    size="sm"
    disabled={deletingId === application.id}
    onClick={() => handleDelete(application.id)}
  >
    <Trash2 className="mr-2 size-4" />
    {deletingId === application.id ? "Deleting..." : "Delete"}
  </Button>
</div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

              {!isLoading && filteredApplications.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <Search className="mx-auto size-8 text-muted-foreground/60" />
                  <p className="mt-3 font-medium">No applications found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another search term or change your filters.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
