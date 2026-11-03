
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Plus,
} from "lucide-react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  sampleApplications,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/sample-data";

const columns: ApplicationStatus[] = [
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

function formatDate(date: string | null) {
  if (!date) return "Not applied yet";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BoardPage() {
  const [applications, setApplications] =
    useState<JobApplication[]>(sampleApplications);

  function updateStatus(id: string, status: ApplicationStatus) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );
  }

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
                See your job search at a glance.
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Application board
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Track each opportunity as it moves through your job search.
              </p>
            </div>

            <Button
                onClick={() => {
                window.location.href = "/applications/new";
                }}
            >
            <Plus className="size-4" />
            Add application
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((status) => {
              const columnApplications = applications.filter(
                (application) => application.status === status,
              );

              return (
                <section
                  key={status}
                  className="w-72 shrink-0 rounded-xl bg-muted/40 p-3"
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold">{status}</h2>
                      <Badge variant="secondary">
                        {columnApplications.length}
                      </Badge>
                    </div>
                    <span className="size-2 rounded-full bg-muted-foreground/40" />
                  </div>

                  <div className="space-y-3">
                    {columnApplications.map((application) => (
                      <Card
                        key={application.id}
                        className="gap-3 py-4 shadow-none"
                      >
                        <CardContent className="space-y-3 px-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold leading-snug">
                                {application.jobTitle}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {application.company}
                              </p>
                            </div>
                            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {application.location}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            {formatDate(application.appliedAt)}
                          </div>

                          <div className="border-t pt-3">
                            <label
                              htmlFor={`status-${application.id}`}
                              className="mb-1.5 block text-xs font-medium text-muted-foreground"
                            >
                              Change status
                            </label>
                            <select
                              id={`status-${application.id}`}
                              value={application.status}
                              onChange={(event) =>
                                updateStatus(
                                  application.id,
                                  event.target.value as ApplicationStatus,
                                )
                              }
                              className="h-9 w-full rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {columns.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <Badge
                            variant="outline"
                            className={getStatusClasses(application.status)}
                          >
                            {application.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}

                    {columnApplications.length === 0 && (
                      <div className="rounded-lg border border-dashed bg-background/60 px-3 py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No applications here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Change a card&apos;s status to move it here.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="size-4" />
            Status changes update the board immediately. They are temporary
            until we connect the database.
          </div>
        </main>
      </div>
    </div>
  );
}
