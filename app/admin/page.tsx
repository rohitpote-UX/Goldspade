"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Search,
  ArrowUpDown,
  Trash2,
  X,
  ExternalLink,
  LogOut,
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  Archive,
  ArchiveRestore,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { InquiryRecord, InquiryStatus } from "@/lib/db/inquiries";

const STATUS_OPTIONS: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CONVERTED",
  "ARCHIVED",
];

export default function ClientDeskDashboardPage() {
  const router = useRouter();

  // State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    inProgress: 0,
    converted: 0,
    archived: 0,
  });
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    name?: string;
    role: "ADMIN" | "TEAM";
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Selected Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaveFeedback, setNotesSaveFeedback] = useState("");

  // Fetch inquiries from server
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
        setStats(
          data.stats || {
            total: 0,
            new: 0,
            contacted: 0,
            inProgress: 0,
            converted: 0,
            archived: 0,
          }
        );
        setCurrentUser(data.user);
      } else {
        setError(data.error || "Failed to load inquiries");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Sync selected inquiry notes when opened
  useEffect(() => {
    if (selectedInquiry) {
      setEditingNotes(selectedInquiry.notes || "");
      setNotesSaveFeedback("");
    }
  }, [selectedInquiry]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // Handle Status Update
  const handleStatusChange = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        // Refresh overview stats
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Handle Save Internal Notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);
    setNotesSaveFeedback("");

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedInquiry.id, notes: editingNotes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === selectedInquiry.id ? { ...inq, notes: editingNotes } : inq
          )
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, notes: editingNotes } : null));
        setNotesSaveFeedback("Notes saved securely.");
        setTimeout(() => setNotesSaveFeedback(""), 3000);
      }
    } catch {
      setNotesSaveFeedback("Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Delete Inquiry (Admin Only)
  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(inquiryId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(null);
        }
        fetchDashboardData();
      } else {
        alert(data.error || "Failed to delete inquiry.");
      }
    } catch {
      alert("Error deleting inquiry.");
    }
  };

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        // Status filter
        if (statusFilter !== "ALL") {
          if (statusFilter === "IN_PROGRESS") {
            if (
              inq.status !== "IN_PROGRESS" &&
              inq.status !== "IN_DISCUSSION" &&
              inq.status !== "PROPOSAL_SENT"
            ) {
              return false;
            }
          } else if (statusFilter === "CONVERTED") {
            if (inq.status !== "CONVERTED" && inq.status !== "WON") {
              return false;
            }
          } else if (inq.status !== statusFilter) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = inq.name.toLowerCase().includes(q);
          const matchEmail = inq.email.toLowerCase().includes(q);
          const matchCompany = inq.companyProject?.toLowerCase().includes(q);
          const matchOverview = inq.overview?.toLowerCase().includes(q);
          return matchName || matchEmail || matchCompany || matchOverview;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === "NEWEST" ? timeB - timeA : timeA - timeB;
      });
  }, [inquiries, searchQuery, statusFilter, sortOrder]);

  const getStatusBadgeClass = (status: InquiryStatus) => {
    switch (status) {
      case "NEW":
        return "bg-mint/20 text-primary-dark border-mint";
      case "CONVERTED":
      case "WON":
        return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40";
      case "IN_PROGRESS":
      case "IN_DISCUSSION":
      case "PROPOSAL_SENT":
        return "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40";
      case "CONTACTED":
        return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40";
      case "ARCHIVED":
        return "bg-secondary-dark/20 text-secondary-dark border-editorial-border";
      default:
        return "bg-secondary-dark/15 text-primary-dark border-editorial-border";
    }
  };

  const formatDisplayStatus = (status: InquiryStatus) => {
    if (status === "IN_DISCUSSION" || status === "PROPOSAL_SENT") return "IN PROGRESS";
    if (status === "WON") return "CONVERTED";
    return status.replace("_", " ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas text-primary-dark flex items-center justify-center pt-24">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-full border-2 border-mint border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-secondary-dark">
            Loading Client Desk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-primary-dark pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-editorial-border">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark">
                CLIENT DESK
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-mint text-[#171515]">
                INTERNAL
              </span>
            </div>
            <p className="text-xs font-mono text-secondary-dark mt-1">
              Private lead management and client inquiry pipeline &bull; Goldspade Studio
            </p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {currentUser && (
              <div className="flex items-center space-x-2 bg-white dark:bg-black/60 border border-editorial-border px-3.5 py-1.5 rounded-full text-xs font-mono">
                <Shield className="w-3.5 h-3.5 text-mint" />
                <span className="font-bold">{currentUser.name || currentUser.email}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.2 bg-mint/20 text-primary-dark rounded font-bold">
                  {currentUser.role}
                </span>
              </div>
            )}

            <button
              onClick={fetchDashboardData}
              aria-label="Refresh inquiries"
              className="p-2 rounded-full border border-editorial-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-secondary-dark hover:text-primary-dark"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:text-red-700 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </header>

        {/* Error Alert if any */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 text-xs font-mono rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="text-xs font-bold underline hover:text-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Overview Metric Cards (Linear / Agency Style) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-secondary-dark tracking-wider block mb-1">
              TOTAL INQUIRIES
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.total).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-mint tracking-wider block mb-1 font-bold">
              NEW
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.new).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 tracking-wider block mb-1 font-bold">
              CONTACTED
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.contacted).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-sky-600 dark:text-sky-400 tracking-wider block mb-1 font-bold">
              IN PROGRESS
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.inProgress).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block mb-1 font-bold">
              CONVERTED
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.converted).padStart(2, "0")}
            </span>
          </div>

          <div className="bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-secondary-dark tracking-wider block mb-1">
              ARCHIVED
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-dark">
              {String(stats.archived).padStart(2, "0")}
            </span>
          </div>
        </section>

        {/* Filter, Search & Sort Control Bar */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-black/60 border border-editorial-border rounded-2xl p-4">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, company, or project keyword..."
              className="w-full bg-canvas border border-editorial-border rounded-xl px-4 py-2.5 text-sm text-primary-dark placeholder:text-secondary-dark/50 pl-10 focus:outline-none focus:border-mint transition-all"
            />
            <Search className="w-4 h-4 text-secondary-dark/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark hover:text-primary-dark"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shrink-0",
                statusFilter === "ALL"
                  ? "bg-primary-dark text-canvas"
                  : "bg-canvas text-secondary-dark hover:text-primary-dark border border-editorial-border"
              )}
            >
              All ({inquiries.length})
            </button>
            {STATUS_OPTIONS.map((st) => {
              let count = 0;
              if (st === "IN_PROGRESS") {
                count = stats.inProgress;
              } else if (st === "CONVERTED") {
                count = stats.converted;
              } else if (st === "NEW") {
                count = stats.new;
              } else if (st === "CONTACTED") {
                count = stats.contacted;
              } else if (st === "ARCHIVED") {
                count = stats.archived;
              } else {
                count = inquiries.filter((i) => i.status === st).length;
              }

              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shrink-0",
                    statusFilter === st
                      ? "bg-primary-dark text-canvas"
                      : "bg-canvas text-secondary-dark hover:text-primary-dark border border-editorial-border"
                  )}
                >
                  {formatDisplayStatus(st)} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {/* Sort Order Selector */}
          <button
            onClick={() => setSortOrder((p) => (p === "NEWEST" ? "OLDEST" : "NEWEST"))}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-canvas border border-editorial-border text-xs font-mono uppercase font-bold text-secondary-dark hover:text-primary-dark transition-colors shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === "NEWEST" ? "Newest First" : "Oldest First"}</span>
          </button>
        </section>

        {/* Inquiries Content Area */}
        <section className="bg-white dark:bg-black/60 border border-editorial-border rounded-3xl overflow-hidden shadow-xs">
          {filteredInquiries.length === 0 ? (
            /* Polished Empty State */
            <div className="py-24 px-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-mint/15 border border-mint/40 text-primary-dark flex items-center justify-center mx-auto">
                <Inbox className="w-6 h-6 text-primary-dark" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-primary-dark">
                NO INQUIRIES YET.
              </h3>
              <p className="text-xs font-mono text-secondary-dark max-w-sm mx-auto leading-relaxed">
                &ldquo;Quiet studio. Big things coming.&rdquo;
                <br />
                {searchQuery || statusFilter !== "ALL"
                  ? "No submissions matched your search criteria."
                  : "Client inquiries submitted through the contact page will appear here."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-editorial-border bg-canvas/50 text-[11px] font-mono uppercase tracking-wider text-secondary-dark">
                      <th className="py-4 px-6 font-bold">Client Name</th>
                      <th className="py-4 px-6 font-bold">Email</th>
                      <th className="py-4 px-6 font-bold">Company / Project</th>
                      <th className="py-4 px-6 font-bold">Budget</th>
                      <th className="py-4 px-6 font-bold">Status</th>
                      <th className="py-4 px-6 font-bold">Submitted</th>
                      <th className="py-4 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-border/60">
                    {filteredInquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="font-bold text-primary-dark group-hover:text-mint transition-colors">
                            {inq.name}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <a
                            href={`mailto:${inq.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-xs text-secondary-dark hover:text-primary-dark hover:underline inline-flex items-center"
                          >
                            <span>{inq.email}</span>
                            <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                          </a>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-xs font-mono text-secondary-dark font-medium">
                            {inq.companyProject || "—"}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-semibold">
                            {inq.budget || "—"}
                          </span>
                        </td>

                        <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleStatusChange(inq.id, e.target.value as InquiryStatus)
                            }
                            className={cn(
                              "text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer",
                              getStatusBadgeClass(inq.status)
                            )}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-black text-primary-dark"
                              >
                                {formatDisplayStatus(opt)}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-4 px-6 text-xs font-mono text-secondary-dark">
                          {new Date(inq.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="text-xs font-mono font-bold text-primary-dark hover:text-mint p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                              VIEW ↗
                            </button>
                            {inq.status === "ARCHIVED" ? (
                              <button
                                onClick={() => handleStatusChange(inq.id, "NEW")}
                                aria-label="Restore inquiry"
                                title="Restore from archive"
                                className="text-secondary-dark hover:text-mint p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              >
                                <ArchiveRestore className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(inq.id, "ARCHIVED")}
                                aria-label="Archive inquiry"
                                title="Archive inquiry"
                                className="text-secondary-dark hover:text-amber-500 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                            {currentUser?.role === "ADMIN" && (
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                aria-label="Delete inquiry permanently"
                                title="Delete inquiry"
                                className="text-secondary-dark hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="lg:hidden divide-y divide-editorial-border">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="p-5 space-y-3 active:bg-black/5 dark:active:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-primary-dark">{inq.name}</h4>
                        {inq.companyProject && (
                          <p className="text-xs font-mono text-secondary-dark">
                            {inq.companyProject}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                          getStatusBadgeClass(inq.status)
                        )}
                      >
                        {formatDisplayStatus(inq.status)}
                      </span>
                    </div>

                    <p className="text-xs text-secondary-dark line-clamp-2 leading-relaxed font-sans">
                      {inq.overview}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono text-secondary-dark pt-1">
                      <span>{inq.budget || "Budget Unspecified"}</span>
                      <span>
                        {new Date(inq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Inquiry Detail Modal Drawer */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white dark:bg-black border border-editorial-border rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-editorial-border flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-mint bg-primary-dark px-2.5 py-0.5 rounded-full inline-block">
                    CLIENT INQUIRY
                  </span>
                  <span className="text-xs font-mono text-secondary-dark">
                    ID: {selectedInquiry.id}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-primary-dark">
                  {selectedInquiry.name}
                </h2>
                {selectedInquiry.companyProject && (
                  <p className="text-sm font-mono text-secondary-dark font-semibold">
                    {selectedInquiry.companyProject}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-full border border-editorial-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close detail modal"
              >
                <X className="w-5 h-5 text-secondary-dark" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-canvas rounded-2xl border border-editorial-border text-xs font-mono">
                <div>
                  <span className="uppercase text-secondary-dark block mb-1 font-bold">
                    CLIENT EMAIL
                  </span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm font-bold text-primary-dark hover:text-mint hover:underline inline-flex items-center"
                  >
                    <span>{selectedInquiry.email}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>
                </div>

                <div>
                  <span className="uppercase text-secondary-dark block mb-1 font-bold">
                    ESTIMATED BUDGET
                  </span>
                  <span className="text-sm font-bold text-primary-dark">
                    {selectedInquiry.budget || "Not Specified"}
                  </span>
                </div>

                <div>
                  <span className="uppercase text-secondary-dark block mb-1 font-bold">
                    SUBMITTED DATE
                  </span>
                  <span className="text-xs text-primary-dark font-semibold">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="uppercase text-secondary-dark block mb-1 font-bold">
                    PIPELINE STATUS
                  </span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) =>
                      handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)
                    }
                    className={cn(
                      "text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border focus:outline-none cursor-pointer",
                      getStatusBadgeClass(selectedInquiry.status)
                    )}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        className="bg-white dark:bg-black text-primary-dark"
                      >
                        {formatDisplayStatus(opt)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Overview & Objectives */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-secondary-dark mb-2">
                  Project Overview & Objectives
                </h4>
                <div className="p-5 bg-white dark:bg-black/60 border border-editorial-border rounded-2xl text-sm leading-relaxed text-primary-dark whitespace-pre-wrap font-sans">
                  {selectedInquiry.overview}
                </div>
              </div>

              {/* Private Internal Notes (Staff Only) */}
              <div className="space-y-2 pt-2 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-secondary-dark flex items-center">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-mint" />
                    <span>Private Internal Notes (Staff Only &bull; Never Sent to Client)</span>
                  </h4>
                  {notesSaveFeedback && (
                    <span className="text-[11px] font-mono text-mint font-bold animate-in fade-in">
                      {notesSaveFeedback}
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add private team notes, proposal links, meeting minutes, or follow-up milestones..."
                  className="w-full bg-canvas border border-editorial-border rounded-xl p-3 text-xs font-mono text-primary-dark placeholder:text-secondary-dark/50 focus:outline-none focus:border-mint transition-all"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="inline-flex items-center text-xs font-mono font-bold uppercase bg-primary-dark text-canvas hover:bg-mint hover:text-[#171515] px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    <span>{isSavingNotes ? "SAVING..." : "SAVE NOTES"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-editorial-border bg-canvas/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                {selectedInquiry.status === "ARCHIVED" ? (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, "NEW")}
                    className="text-xs font-mono text-mint hover:underline font-bold inline-flex items-center"
                  >
                    <ArchiveRestore className="w-3.5 h-3.5 mr-1" />
                    Restore Inquiry
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, "ARCHIVED")}
                    className="text-xs font-mono text-secondary-dark hover:text-amber-500 font-bold inline-flex items-center"
                  >
                    <Archive className="w-3.5 h-3.5 mr-1" />
                    Archive Inquiry
                  </button>
                )}

                {currentUser?.role === "ADMIN" && (
                  <button
                    onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                    className="text-xs font-mono text-red-600 hover:text-red-700 dark:text-red-400 font-bold inline-flex items-center ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete Permanently
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Button
                  onClick={() => setSelectedInquiry(null)}
                  variant="secondary"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  CLOSE
                </Button>
                <Button
                  href={`mailto:${selectedInquiry.email}?subject=Re:%20Project%20Inquiry%20—%20Goldspade`}
                  variant="mint"
                  size="sm"
                  className="flex-1 sm:flex-initial inline-flex items-center space-x-1.5"
                >
                  <span>REPLY TO CLIENT</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
