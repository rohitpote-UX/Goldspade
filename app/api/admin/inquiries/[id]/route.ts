import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isStaffSession, isAdminSession } from "@/lib/auth/server";
import {
  getInquiryById,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
  InquiryStatus,
} from "@/lib/db/inquiries";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(req);
  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const inquiry = await getInquiryById(id);

  if (!inquiry) {
    return NextResponse.json(
      { success: false, error: "Inquiry not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, inquiry }, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(req);
  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { status, notes } = body;

  try {
    let statusUpdated = false;
    let notesUpdated = false;

    if (status !== undefined) {
      statusUpdated = await updateInquiryStatus(id, status as InquiryStatus);
    }

    if (notes !== undefined) {
      notesUpdated = await updateInquiryNotes(id, String(notes));
    }

    const updated = await getInquiryById(id);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry updated successfully.",
        inquiry: updated,
        statusUpdated,
        notesUpdated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Inquiry Update Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = getSessionFromRequest(req);
  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Destruction requires ADMIN role
  if (!isAdminSession(session)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. Admin role required to delete inquiries." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const success = await deleteInquiry(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found or could not be deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Inquiry deleted permanently." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Inquiry Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}
