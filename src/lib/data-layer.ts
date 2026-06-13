import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { readAuthSession } from "./auth";
import { api } from "./api-client";
import * as seed from "./hostel-data";
import type { Student, Bill, Complaint, LeaveRequest, VisitorRequest, Room, GateEvent, Notice } from "./hostel-data";

const isDemoMode = () => {
  const session = readAuthSession();
  return !session || session.provider === "demo";
};

function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const raw = window.localStorage.getItem(`bunkhaus-demo-${key}`);
  if (!raw) {
    window.localStorage.setItem(`bunkhaus-demo-${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`bunkhaus-demo-${key}`, JSON.stringify(value));
}

// 1. Current Student Info
export function useCurrentStudent() {
  const session = readAuthSession();
  return useQuery({
    queryKey: ["currentStudent", session?.email],
    queryFn: async () => {
      if (!session) return seed.currentStudent;
      if (session.provider === "demo") {
        return seed.currentStudent;
      }
      try {
        const students = await api<any[]>("/api/v1/students", []);
        const current = students.find(
          (s) => s.email?.toLowerCase() === session.email?.toLowerCase()
        );
        if (current) {
          return {
            id: current.id,
            name: current.name,
            roll: current.rollNumber || "STU-001",
            hostel: current.block || "Block C — Tagore",
            room: current.roomNumber || "C-214",
            bed: current.bed || "B2",
            course: current.department || "B.Tech CSE",
            year: current.academic_year || 3,
          } as Student;
        }
      } catch (e) {
        console.error("Error fetching student profile from backend", e);
      }
      return seed.currentStudent;
    },
    enabled: !!session,
  });
}

// 2. Bills
export function useBills() {
  const session = readAuthSession();
  const { data: student } = useCurrentStudent();
  return useQuery({
    queryKey: ["bills", session?.email, student?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<Bill[]>("bills", seed.bills);
      }
      try {
        const all = await api<any[]>("/api/v1/bills", []);
        const studentId = student?.id;
        const filtered = studentId ? all.filter((b) => b.studentId === studentId) : all;
        if (filtered.length === 0) {
          // Fallback if backend returned empty but we want some billing items
          return seed.bills;
        }
        return filtered.map((b) => ({
          id: b.id,
          period: b.month || "Current Cycle",
          hostelFee: b.category === "Hostel fee" ? Number(b.amount) : Number(b.amount) * 0.8,
          electricity: b.category === "Electricity" ? Number(b.amount) : Number(b.amount) * 0.1,
          mess: b.category === "Mess" ? Number(b.amount) : Number(b.amount) * 0.1,
          total: Number(b.amount),
          dueDate: b.dueDate ? b.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          status: b.status === "paid" ? "paid" : b.status === "overdue" ? "overdue" : "due",
        })) as Bill[];
      } catch (e) {
        console.error("Error fetching bills", e);
        return seed.bills;
      }
    },
  });
}

// 3. Complaints
export function useComplaints() {
  const session = readAuthSession();
  const { data: student } = useCurrentStudent();
  return useQuery({
    queryKey: ["complaints", session?.role, student?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<Complaint[]>("complaints", seed.complaints);
      }
      try {
        const all = await api<any[]>("/api/v1/complaints", []);
        let mapped = all.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          priority: c.priority || "medium",
          status: c.status || "open",
          createdAt: c.createdAt ? c.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          updatedAt: c.updatedAt ? c.updatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          submittedBy: c.studentName || c.studentId || "Student",
          description: c.description || "",
          assignee: c.assignedTo || "Unassigned",
        })) as Complaint[];

        if (session?.role === "student" && student) {
          mapped = mapped.filter((c) => c.submittedBy === student.name);
        }
        return mapped;
      } catch (e) {
        console.error("Error fetching complaints", e);
        return seed.complaints;
      }
    },
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { data: student } = useCurrentStudent();
  return useMutation({
    mutationFn: async (newC: { title: string; category: string; priority: string; description: string }) => {
      if (isDemoMode()) {
        const list = getLocalItem<Complaint[]>("complaints", seed.complaints);
        const item: Complaint = {
          id: `c-${Math.floor(Math.random() * 9000 + 1000)}`,
          title: newC.title,
          category: newC.category,
          priority: newC.priority as any,
          status: "open",
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
          submittedBy: student?.name || "Aarav Mehta",
          description: newC.description,
        };
        setLocalItem("complaints", [item, ...list]);
        return item;
      }
      return api<any>("/api/v1/complaints", null, {
        method: "POST",
        body: JSON.stringify({
          studentId: student?.id || "stu_001",
          title: newC.title,
          category: newC.category,
          priority: newC.priority,
          description: newC.description,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, assignee }: { id: string; status?: string; assignee?: string }) => {
      if (isDemoMode()) {
        const list = getLocalItem<Complaint[]>("complaints", seed.complaints);
        const updated = list.map((c) =>
          c.id === id
            ? {
                ...c,
                ...(status ? { status: status as any } : {}),
                ...(assignee ? { assignee } : {}),
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : c
        );
        setLocalItem("complaints", updated);
        return updated.find((c) => c.id === id);
      }
      return api<any>(`/api/v1/complaints/${id}`, null, {
        method: "PATCH",
        body: JSON.stringify({ status, assignedTo: assignee }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}

// 4. Leave Requests
export function useLeaveRequests() {
  const session = readAuthSession();
  const { data: student } = useCurrentStudent();
  return useQuery({
    queryKey: ["leaveRequests", session?.role, student?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<LeaveRequest[]>("leaveRequests", seed.leaveRequests);
      }
      try {
        const all = await api<any[]>("/api/v1/leave-requests", []);
        let mapped = all.map((l) => ({
          id: l.id,
          student: l.studentName || l.studentId || "Student",
          from: l.fromDate ? l.fromDate.slice(0, 10) : "",
          to: l.toDate ? l.toDate.slice(0, 10) : "",
          reason: l.reason,
          destination: l.destination || "Home",
          status: l.status || "pending",
        })) as LeaveRequest[];

        if (session?.role === "student" && student) {
          mapped = mapped.filter((l) => l.student === student.name);
        }
        return mapped;
      } catch (e) {
        console.error("Error fetching leave requests", e);
        return seed.leaveRequests;
      }
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  const { data: student } = useCurrentStudent();
  return useMutation({
    mutationFn: async (req: { from: string; to: string; reason: string; destination: string }) => {
      if (isDemoMode()) {
        const list = getLocalItem<LeaveRequest[]>("leaveRequests", seed.leaveRequests);
        const item: LeaveRequest = {
          id: `lr-${Math.floor(Math.random() * 900 + 100)}`,
          student: student?.name || "Aarav Mehta",
          from: req.from,
          to: req.to,
          reason: req.reason,
          destination: req.destination,
          status: "pending",
        };
        setLocalItem("leaveRequests", [item, ...list]);
        return item;
      }
      return api<any>("/api/v1/leave-requests", null, {
        method: "POST",
        body: JSON.stringify({
          studentId: student?.id || "stu_001",
          fromDate: req.from,
          toDate: req.to,
          reason: req.reason,
          destination: req.destination,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    },
  });
}

export function useDecideLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      if (isDemoMode()) {
        const list = getLocalItem<LeaveRequest[]>("leaveRequests", seed.leaveRequests);
        const updated = list.map((l) => (l.id === id ? { ...l, status } : l));
        setLocalItem("leaveRequests", updated);
        return updated.find((l) => l.id === id);
      }
      return api<any>(`/api/v1/leave-requests/${id}/decision`, null, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    },
  });
}

// 5. Visitors
export function useVisitors() {
  const session = readAuthSession();
  const { data: student } = useCurrentStudent();
  return useQuery({
    queryKey: ["visitors", session?.role, student?.id],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<VisitorRequest[]>("visitors", seed.visitors);
      }
      try {
        const all = await api<any[]>("/api/v1/visitor-requests", []);
        const passes = await api<any[]>("/api/v1/gate-passes", []);
        let mapped = all.map((v) => {
          const pass = passes.find((p) => p.visitorId === v.id);
          return {
            id: v.id,
            visitor: v.name,
            relation: v.relation || "Visitor",
            host: v.hostName || v.hostStudentId || "Host",
            hostRoom: "C-214",
            validFrom: v.requestedAt ? v.requestedAt.slice(0, 16).replace("T", " ") : "",
            validTo: pass
              ? pass.validUntil.slice(0, 16).replace("T", " ")
              : new Date(new Date(v.requestedAt || Date.now()).getTime() + 8 * 3600000)
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " "),
            status: v.status || "pending",
            passCode: pass ? pass.code : "",
          };
        }) as VisitorRequest[];

        if (session?.role === "student" && student) {
          mapped = mapped.filter((v) => v.host === student.name);
        }
        return mapped;
      } catch (e) {
        console.error("Error fetching visitors", e);
        return seed.visitors;
      }
    },
  });
}

export function useCreateVisitorRequest() {
  const queryClient = useQueryClient();
  const { data: student } = useCurrentStudent();
  return useMutation({
    mutationFn: async (req: { visitorName: string; relation: string; validFrom: string; validTo: string }) => {
      if (isDemoMode()) {
        const list = getLocalItem<VisitorRequest[]>("visitors", seed.visitors);
        const passCode = `GP-${Math.floor(Math.random() * 9000 + 1000)}`;
        const item: VisitorRequest = {
          id: `v-${Math.floor(Math.random() * 900 + 100)}`,
          visitor: req.visitorName,
          relation: req.relation,
          host: student?.name || "Aarav Mehta",
          hostRoom: student?.room || "C-214",
          validFrom: req.validFrom.replace("T", " "),
          validTo: req.validTo.replace("T", " "),
          status: "pending",
          passCode,
        };
        setLocalItem("visitors", [item, ...list]);
        return item;
      }
      return api<any>("/api/v1/visitor-requests", null, {
        method: "POST",
        body: JSON.stringify({
          hostStudentId: student?.id || "stu_001",
          name: req.visitorName,
          relation: req.relation,
          validUntil: req.validTo,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
}

// 6. Rooms
export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<Room[]>("rooms", seed.rooms);
      }
      try {
        const all = await api<any[]>("/api/v1/rooms", []);
        return all.map((r) => ({
          id: r.id,
          block: r.blockName || "Block",
          number: r.roomNumber || "000",
          capacity: r.capacity || 2,
          occupancy: r.occupancy || 0,
          status:
            r.status === "occupied"
              ? "full"
              : r.status === "partially-occupied"
              ? "partial"
              : r.status === "maintenance"
              ? "maintenance"
              : "available",
        })) as Room[];
      } catch (e) {
        console.error("Error fetching rooms", e);
        return seed.rooms;
      }
    },
  });
}

// 7. Notices
export function useNotices() {
  return useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      return getLocalItem<Notice[]>("notices", seed.notices);
    },
  });
}

// 8. Gate Events / Logs
export function useGateEvents() {
  return useQuery({
    queryKey: ["gateEvents"],
    queryFn: async () => {
      if (isDemoMode()) {
        return getLocalItem<GateEvent[]>("gateEvents", seed.gateEvents);
      }
      try {
        const passes = await api<any[]>("/api/v1/gate-passes", []);
        return passes.map((gp) => ({
          id: gp.id,
          name: gp.visitorName || `Visitor Pass ${gp.code}`,
          direction: gp.exitTime ? "out" : "in",
          time: new Date(gp.entryTime || gp.issuedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          verification: gp.verifiedBy ? "matched" : "manual_review",
          confidence: 0.95,
        })) as GateEvent[];
      } catch (e) {
        console.error("Error fetching gate events", e);
        return seed.gateEvents;
      }
    },
  });
}

// 9. KPIs
export function useKpis(role: string) {
  const { data: bills } = useBills();
  const { data: complaints } = useComplaints();
  const { data: leaves } = useLeaveRequests();
  const { data: visitors } = useVisitors();
  const { data: rooms } = useRooms();
  const { data: student } = useCurrentStudent();

  return useQuery({
    queryKey: [
      "kpis-summary",
      role,
      bills?.length,
      complaints?.length,
      leaves?.length,
      visitors?.length,
      rooms?.length,
      student?.id,
    ],
    queryFn: () => {
      if (role === "student") {
        const studentName = student?.name || "Aarav Mehta";
        const outstandingAmt =
          bills?.filter((b) => b.status !== "paid").reduce((s, b) => s + b.total, 0) || 0;
        const openComplaintsCount =
          complaints?.filter(
            (c) => c.status !== "resolved" && c.status !== "closed" && c.submittedBy === studentName
          ).length || 0;
        const activeLeaves = leaves?.find((l) => l.student === studentName && l.status === "pending")
          ? "Pending"
          : "None";
        const activeVisitorsCount =
          visitors?.filter((v) => v.host === studentName && v.status === "approved").length || 0;

        return [
          {
            label: "Outstanding dues",
            value: `₹${outstandingAmt.toLocaleString()}`,
            hint: "Due this cycle",
            tone: outstandingAmt > 0 ? ("warning" as const) : ("success" as const),
          },
          {
            label: "Open complaints",
            value: String(openComplaintsCount),
            hint: "Assigned or in progress",
            tone: openComplaintsCount > 0 ? ("info" as const) : ("success" as const),
          },
          {
            label: "Leave status",
            value: activeLeaves,
            hint: activeLeaves === "Pending" ? "Awaiting review" : "No active requests",
            tone: activeLeaves === "Pending" ? ("warning" as const) : ("neutral" as const),
          },
          {
            label: "Active visitor pass",
            value: String(activeVisitorsCount),
            hint: "Valid today",
            tone: activeVisitorsCount > 0 ? ("success" as const) : ("neutral" as const),
          },
        ];
      } else if (role === "warden") {
        const urgentCount =
          complaints?.filter((c) => c.priority === "urgent" || c.priority === "high").length || 0;
        const pendingLeavesCount = leaves?.filter((l) => l.status === "pending").length || 0;
        const totalBeds = rooms?.reduce((sum, r) => sum + r.capacity, 0) || 1;
        const occupiedBeds = rooms?.reduce((sum, r) => sum + r.occupancy, 0) || 0;
        const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

        return [
          {
            label: "Urgent complaints",
            value: String(urgentCount),
            hint: "Awaiting resolution",
            tone: urgentCount > 0 ? ("danger" as const) : ("success" as const),
          },
          {
            label: "Leave approvals",
            value: String(pendingLeavesCount),
            hint: "Pending review",
            tone: pendingLeavesCount > 0 ? ("warning" as const) : ("neutral" as const),
          },
          {
            label: "Occupancy",
            value: `${occupancyRate}%`,
            hint: "Across all blocks",
            tone: "info" as const,
          },
          { label: "Gate events / hr", value: "42", hint: "Peak 11:00–12:00", tone: "success" as const },
        ];
      } else if (role === "admin") {
        const totalAmt = bills?.reduce((s, b) => s + b.total, 0) || 1;
        const paidAmt = bills?.filter((b) => b.status === "paid").reduce((s, b) => s + b.total, 0) || 0;
        const collectionRate = Math.round((paidAmt / totalAmt) * 100);
        const escalationsCount = complaints?.filter((c) => c.priority === "urgent").length || 0;

        return [
          {
            label: "Collection rate",
            value: `${collectionRate}%`,
            hint: "June cycle",
            tone: "success" as const,
          },
          { label: "Occupancy trend", value: "+3.1%", hint: "QoQ", tone: "info" as const },
          {
            label: "Open escalations",
            value: String(escalationsCount),
            hint: "SLA alert",
            tone: escalationsCount > 0 ? ("danger" as const) : ("success" as const),
          },
          { label: "AI verification", value: "96.1%", hint: "Match rate", tone: "success" as const },
        ];
      }
      return [];
    },
  });
}
