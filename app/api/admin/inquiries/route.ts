import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, isStaffSession, isAdminSession } from "@/lib/auth/server";
import { isDatabaseConfigured } from "@/lib/db/client";
import {
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  updateInquiryNotes,
  deleteInquiry,
  InquiryStatus,
} from "@/lib/db/inquiries";

/**
 * GET /api/admin/inquiries
 * Returns all inquiries and computed pipeline metrics for staff.
 */
export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access. Staff authentication required." },
      { status: 401 }
    );
  }

  // Check if a single inquiry ID was requested via search params
  const { searchParams } = new URL(req.url);
  const singleId = searchParams.get("id");

  if (singleId) {
    const inquiry = await getInquiryById(singleId);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  }

  try {
    const inquiries = await getInquiries();

    // Compute key metrics
    const stats = {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "NEW").length,
      contacted: inquiries.filter((i) => i.status === "CONTACTED").length,
      qualified: inquiries.filter((i) => i.status === "QUALIFIED").length,
      inProgress: inquiries.filter(
        (i) => i.status === "IN_PROGRESS" || i.status === "IN_DISCUSSION" || i.status === "PROPOSAL_SENT"
      ).length,
      converted: inquiries.filter((i) => i.status === "CONVERTED" || i.status === "WON").length,
      archived: inquiries.filter((i) => i.status === "ARCHIVED").length,
    };

    return NextResponse.json(
      {
        success: true,
        inquiries,
        stats,
        databaseConfigured: isDatabaseConfigured(),
        storageType: isDatabaseConfigured() ? "postgresql" : "file_fallback",
        user: {
          id: session!.userId,
          email: session!.email,
          name: session!.name,
          role: session!.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin Inquiries API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve inquiries from storage." },
      { status: 500 }
    );
  }
}


/**
 * PATCH /api/admin/inquiries
 * Updates status and/or internal notes for an inquiry.
 */
export async function PATCH(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required." },
        { status: 400 }
      );
    }

    let statusUpdated = false;
    let notesUpdated = false;

    if (status !== undefined) {
      statusUpdated = await updateInquiryStatus(String(id), status as InquiryStatus);
    }

    if (notes !== undefined) {
      notesUpdated = await updateInquiryNotes(String(id), String(notes));
    }

    const updated = await getInquiryById(String(id));

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

/**
 * DELETE /api/admin/inquiries
 * Permanently removes an inquiry (ADMIN role required).
 */
export async function DELETE(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!isStaffSession(session)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Deletion requires ADMIN role
  if (!isAdminSession(session)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. Admin role required to delete inquiries." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      // Ignored if query param only
    }
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Inquiry ID is required for deletion." },
      { status: 400 }
    );
  }

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
