
import { ObjectId } from "mongodb";

export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export type JobApplication = {
  _id?: ObjectId;
  userId: string;
  company: string;
  jobTitle: string;
  status: ApplicationStatus;
  location?: string;
  jobUrl?: string;
  appliedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};
