"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Enrollment = {
  id: string;
  courseName: string;
  amount: number;
  orderId: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session && (session.user as any).role !== "ADMIN")) {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchEnrollments();
    }
  }, [status, session, router]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch("/api/enrollments");
      const data = await res.json();
      setEnrollments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchEnrollments();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage course enrollments and approvals.</p>
        </div>
        <a 
          href="/admin/videos" 
          className="inline-flex items-center gap-2 rounded-xl bg-gold/10 text-gold px-4 py-2 font-medium hover:bg-gold/20 transition"
        >
          Manage Videos
        </a>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#14171d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No enrollments found.
                  </td>
                </tr>
              )}
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">{e.user?.email || "Unknown"}</td>
                  <td className="px-6 py-4 font-medium text-gold-light">{e.courseName}</td>
                  <td className="px-6 py-4">₹{e.amount}</td>
                  <td className="px-6 py-4 font-mono text-xs">{e.orderId}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        e.status === "APPROVED"
                          ? "bg-green-500/10 text-green-500"
                          : e.status === "REJECTED"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {e.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(e.id, "APPROVED")}
                          className="inline-flex h-8 items-center gap-1 rounded bg-green-500/20 px-3 text-xs font-medium text-green-500 hover:bg-green-500/30 transition"
                          title="Approve"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, "REJECTED")}
                          className="inline-flex h-8 items-center gap-1 rounded bg-red-500/20 px-3 text-xs font-medium text-red-500 hover:bg-red-500/30 transition"
                          title="Reject"
                        >
                          <X className="h-3 w-3" /> Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
