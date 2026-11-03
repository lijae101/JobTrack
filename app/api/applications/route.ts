
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getApplicationsCollection } from "@/lib/models/application-collection";
import { applicationSchema } from "@/lib/validations/application";
import type { JobApplication } from "@/lib/models/application";


export async function GET() {
  try {
    // 1. Verify that the user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get the applications collection
    const collection = await getApplicationsCollection();

    // 3. Retrieve only this user's applications
    const applications = await collection
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // 4. Convert MongoDB ObjectIds into strings
    const formattedApplications = applications.map(
      ({ _id, ...application }) => ({
        id: _id?.toString(),
        ...application,
      })
    );

    return NextResponse.json({
      applications: formattedApplications,
    });
  } catch (error) {
    console.error("Failed to retrieve applications:", error);

    return NextResponse.json(
      { error: "Failed to retrieve applications" },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    // 1. Verify the user's session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read and validate the submitted data
    const body = await request.json();
    const validation = applicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid application data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    // 3. Prepare the new application
    const now = new Date();

    const application: JobApplication = {
      userId: session.user.id,
      company: validation.data.company,
      jobTitle: validation.data.jobTitle,
      status: validation.data.status,
      location: validation.data.location,
      jobUrl: validation.data.jobUrl,
      appliedAt: validation.data.appliedAt
        ? new Date(validation.data.appliedAt)
        : undefined,
      notes: validation.data.notes,
      createdAt: now,
      updatedAt: now,
    };

    // 4. Save it to MongoDB
    const collection = await getApplicationsCollection();
    const result = await collection.insertOne(application);

    // 5. Return the created application
    return NextResponse.json(
      {
        application: {
          id: result.insertedId.toString(),
          ...application,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create application:", error);

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
