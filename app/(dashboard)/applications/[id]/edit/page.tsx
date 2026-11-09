"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getApplication,
  updateApplication,
} from "@/lib/api/applications";
import type { JobApplication } from "@/lib/api/applications";
import type { ApplicationStatus } from "@/lib/models/application";

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        const data = await getApplication(id);
        setApplication(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load application."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadApplication();
  }, [id]);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setIsSubmitting(true);
  setError(null);

  const formData = new FormData(event.currentTarget);

  const updates = {
    company: formData.get("company") as string,
    jobTitle: formData.get("jobTitle") as string,
    status: formData.get("status") as ApplicationStatus,
    location: formData.get("location") as string,
    jobUrl: formData.get("jobUrl") as string,
    appliedAt: formData.get("appliedAt") as string,
    notes: formData.get("notes") as string,
  };

  try {
    await updateApplication(id, updates);
    router.push("/applications");
    router.refresh();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to update application."
    );
  } finally {
    setIsSubmitting(false);
  }
}

  
    if (isLoading) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Loading application...</p>
      </main>
    </div>
  );
}

if (!application) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Application not found</h1>
        <p className="mt-2 text-muted-foreground">
          {error || "This application could not be loaded."}
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/applications")}
        >
          Back to Applications
        </Button>
      </main>
    </div>
  );
}

return (
  <div className="flex min-h-screen bg-background">
    <Sidebar />

    <main className="flex-1 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Application
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update the details of your job application.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company *
                  </label>
                  <input
                    id="company"
                    name="company"
                    required
                    defaultValue={application.company}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job title *
                  </label>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    required
                    defaultValue={application.jobTitle}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    defaultValue={application.status}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    defaultValue={application.location || ""}
                    placeholder="e.g. Vancouver, BC (or Remote)"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="jobUrl" className="text-sm font-medium">
                    Job posting URL
                  </label>
                  <input
                    id="jobUrl"
                    name="jobUrl"
                    type="url"
                    defaultValue={application.jobUrl || ""}
                    placeholder="https://..."
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="appliedAt" className="text-sm font-medium">
                    Application date
                  </label>
                  <input
                    id="appliedAt"
                    name="appliedAt"
                    type="date"
                    defaultValue={application.appliedAt?.slice(0, 10) || ""}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  defaultValue={application.notes || ""}
                  placeholder="Add any notes about this application..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/applications")}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
);




}