import type { ApplicationStatus } from "@/lib/models/application";

export type JobApplication = {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  status: ApplicationStatus;
  location?: string;
  jobUrl?: string;
  appliedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationInput = {
  company: string;
  jobTitle: string;
  status: ApplicationStatus;
  location?: string;
  jobUrl?: string;
  appliedAt?: string;
  notes?: string;
};

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch("/api/applications");

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  const data = await response.json();

  return data.applications;
}

export async function getApplication(
  id: string
): Promise<JobApplication> {
  const response = await fetch(`/api/applications/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch application.");
  }

  return data.application;
}

export async function createApplication(
  application: ApplicationInput
): Promise<JobApplication> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  if (!response.ok) {
    throw new Error("Failed to create application");
  }

  const data = await response.json();

  return data.application;
}

export async function updateApplication(
  id: string,
  updates: Partial<ApplicationInput>
): Promise<JobApplication> {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update application");
  }

  const data = await response.json();

  return data.application;
}

export async function deleteApplication(id: string): Promise<void> {
  const response = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }
}