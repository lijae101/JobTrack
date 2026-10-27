
export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export type JobApplication = {
  id: string;
  company: string;
  jobTitle: string;
  status: ApplicationStatus;
  location: string;
  appliedAt: string | null;
};

export const sampleApplications: JobApplication[] = [
  {
    id: "1",
    company: "Acme Technologies",
    jobTitle: "Junior Software Developer",
    status: "Interview",
    location: "Vancouver, BC",
    appliedAt: "2026-10-24",
  },
  {
    id: "2",
    company: "Northstar Digital",
    jobTitle: "Frontend Developer",
    status: "Applied",
    location: "Remote",
    appliedAt: "2026-10-23",
  },
  {
    id: "3",
    company: "Evergreen Systems",
    jobTitle: "Full-Stack Developer",
    status: "Applied",
    location: "Burnaby, BC",
    appliedAt: "2026-10-21",
  },
  {
    id: "4",
    company: "Pixelwave",
    jobTitle: "React Developer",
    status: "Offer",
    location: "Vancouver, BC",
    appliedAt: "2026-10-18",
  },
  {
    id: "5",
    company: "Cloudline Software",
    jobTitle: "Software Developer I",
    status: "Wishlist",
    location: "Remote",
    appliedAt: null,
  },
  {
    id: "6",
    company: "Brightpath Labs",
    jobTitle: "Junior Web Developer",
    status: "Rejected",
    location: "Richmond, BC",
    appliedAt: "2026-10-15",
  },
];
