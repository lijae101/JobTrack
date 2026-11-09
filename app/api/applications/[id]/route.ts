
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getApplicationsCollection } from "@/lib/models/application-collection";
import { applicationSchema } from "@/lib/validations/application";
import type { JobApplication } from "@/lib/models/application";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get and validate the application ID
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    // 3. Find the application belonging to this user
    const collection = await getApplicationsCollection();

    const application = await collection.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 4. Return the application
    return NextResponse.json({
      application: {
        ...application,
        id: application._id.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to fetch application:", error);

    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get and validate the application ID
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    // 3. Validate the submitted data
    const body = await request.json();
    const validation = applicationSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid application data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // 4. Prepare the update data
    const { appliedAt, ...otherUpdates } = validation.data;

    const updates: Partial<JobApplication> = {
      ...otherUpdates,
      updatedAt: new Date(),
    };

    if (appliedAt !== undefined) {
      updates.appliedAt = appliedAt
        ? new Date(appliedAt)
        : undefined;
    }

    // 5. Update only an application belonging to this user
    const collection = await getApplicationsCollection();

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
      },
      {
        $set: updates,
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 6. Return the updated application
    return NextResponse.json({
      application: {
        ...result,
        id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to update application:", error);

    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get and validate the application ID
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    // 3. Delete only an application belonging to this user
    const collection = await getApplicationsCollection();

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete application:", error);

    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}

