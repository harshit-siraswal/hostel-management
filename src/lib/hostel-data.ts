// Local demo data fallback for the hostel management frontend.
// Mirrors the shape suggested by the backend API contract.

export type Role = "student" | "guest" | "warden" | "admin";

export type Status =
  | "open" | "assigned" | "in_progress" | "resolved" | "closed"
  | "pending" | "approved" | "rejected"
  | "paid" | "due" | "overdue"
  | "active" | "expired"
  | "matched" | "manual_review" | "failed" | "low_confidence";

export interface Student {
  id: string; name: string; roll: string;
  hostel: string; room: string; bed: string;
  course: string; year: number;
}

export interface Room {
  id: string; block: string; number: string;
  capacity: number; occupancy: number;
  status: "available" | "partial" | "full" | "maintenance";
}

export interface Bill {
  id: string; period: string;
  hostelFee: number; electricity: number; mess: number;
  total: number; dueDate: string; status: "paid" | "due" | "overdue";
}

export interface Complaint {
  id: string; title: string; category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed";
  createdAt: string; updatedAt: string; submittedBy: string;
  description?: string; assignee?: string;
}

export interface LeaveRequest {
  id: string; student: string; from: string; to: string;
  reason: string; destination: string;
  status: "pending" | "approved" | "rejected";
}

export interface VisitorRequest {
  id: string; visitor: string; relation: string;
  host: string; hostRoom: string;
  validFrom: string; validTo: string;
  status: "pending" | "approved" | "rejected" | "expired";
  passCode?: string;
}

export interface GateEvent {
  id: string; name: string; direction: "in" | "out";
  time: string; verification: "matched" | "manual_review" | "failed" | "low_confidence";
  confidence: number;
}

export interface Notice {
  id: string; title: string; body: string; date: string;
  level: "info" | "warning" | "danger";
}

export const currentStudent: Student = {
  id: "stu_001", name: "Aarav Mehta", roll: "CS21B042",
  hostel: "Block C — Tagore", room: "C-214", bed: "B2",
  course: "B.Tech CSE", year: 3,
};

export const bills: Bill[] = [
  { id: "b1", period: "Oct 2026", hostelFee: 18000, electricity: 820, mess: 4200, total: 23020, dueDate: "2026-06-25", status: "due" },
  { id: "b2", period: "Sep 2026", hostelFee: 18000, electricity: 740, mess: 4200, total: 22940, dueDate: "2026-05-25", status: "paid" },
  { id: "b3", period: "Aug 2026", hostelFee: 18000, electricity: 690, mess: 4200, total: 22890, dueDate: "2026-04-25", status: "paid" },
  { id: "b4", period: "Jul 2026", hostelFee: 18000, electricity: 1200, mess: 4200, total: 23400, dueDate: "2026-03-25", status: "overdue" },
];

export const complaints: Complaint[] = [
  { id: "c-2041", title: "Geyser not heating in C-214", category: "Plumbing", priority: "high", status: "in_progress", createdAt: "2026-06-09", updatedAt: "2026-06-12", submittedBy: "Aarav Mehta", assignee: "Maintenance Team B", description: "Hot water unavailable since Monday morning." },
  { id: "c-2039", title: "Wi-Fi drops on 2nd floor", category: "Networking", priority: "medium", status: "assigned", createdAt: "2026-06-08", updatedAt: "2026-06-10", submittedBy: "Aarav Mehta", assignee: "IT Cell" },
  { id: "c-2032", title: "Broken study chair", category: "Furniture", priority: "low", status: "resolved", createdAt: "2026-05-28", updatedAt: "2026-06-02", submittedBy: "Aarav Mehta" },
  { id: "c-2050", title: "Mess water leakage", category: "Plumbing", priority: "urgent", status: "open", createdAt: "2026-06-13", updatedAt: "2026-06-13", submittedBy: "Riya Shah" },
  { id: "c-2049", title: "Bulb fused — corridor B2", category: "Electrical", priority: "medium", status: "open", createdAt: "2026-06-13", updatedAt: "2026-06-13", submittedBy: "Dev Khanna" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "lr-771", student: "Aarav Mehta", from: "2026-06-20", to: "2026-06-24", reason: "Family wedding", destination: "Pune", status: "pending" },
  { id: "lr-770", student: "Riya Shah", from: "2026-06-15", to: "2026-06-17", reason: "Medical", destination: "Mumbai", status: "approved" },
  { id: "lr-769", student: "Dev Khanna", from: "2026-06-12", to: "2026-06-13", reason: "Conference", destination: "Bangalore", status: "rejected" },
  { id: "lr-768", student: "Neha Iyer", from: "2026-06-22", to: "2026-06-28", reason: "Festival", destination: "Chennai", status: "pending" },
];

export const visitors: VisitorRequest[] = [
  { id: "v-301", visitor: "Sunita Mehta", relation: "Mother", host: "Aarav Mehta", hostRoom: "C-214", validFrom: "2026-06-13 10:00", validTo: "2026-06-13 18:00", status: "approved", passCode: "GP-9241" },
  { id: "v-302", visitor: "Karan Patel", relation: "Cousin", host: "Riya Shah", hostRoom: "A-118", validFrom: "2026-06-14 14:00", validTo: "2026-06-14 20:00", status: "pending" },
  { id: "v-298", visitor: "R. Krishnan", relation: "Uncle", host: "Dev Khanna", hostRoom: "B-302", validFrom: "2026-06-10 09:00", validTo: "2026-06-10 17:00", status: "expired", passCode: "GP-9118" },
];

export const gateEvents: GateEvent[] = [
  { id: "g1", name: "Aarav Mehta", direction: "out", time: "08:42", verification: "matched", confidence: 0.97 },
  { id: "g2", name: "Sunita Mehta (visitor)", direction: "in", time: "10:04", verification: "manual_review", confidence: 0.71 },
  { id: "g3", name: "Riya Shah", direction: "in", time: "11:18", verification: "matched", confidence: 0.94 },
  { id: "g4", name: "Unknown subject", direction: "in", time: "11:43", verification: "failed", confidence: 0.32 },
  { id: "g5", name: "Dev Khanna", direction: "out", time: "12:02", verification: "low_confidence", confidence: 0.62 },
];

export const rooms: Room[] = Array.from({ length: 18 }).map((_, i) => {
  const blocks = ["A — Nehru", "B — Bose", "C — Tagore"];
  const block = blocks[i % 3];
  const number = `${block[0]}-${100 + i * 7}`;
  const capacity = 3;
  const occupancy = [3, 2, 3, 1, 3, 2, 0, 3, 2][i % 9];
  const status: Room["status"] =
    occupancy === 0 ? "maintenance" : occupancy >= capacity ? "full" : "partial";
  return { id: `r-${i}`, block, number, capacity, occupancy, status };
});

export const notices: Notice[] = [
  { id: "n1", title: "Mess timings revised", body: "Dinner now served until 21:30 from 16 June.", date: "2026-06-12", level: "info" },
  { id: "n2", title: "Water supply maintenance", body: "Block C water lines off 14 June, 11:00–14:00.", date: "2026-06-11", level: "warning" },
  { id: "n3", title: "Fire drill — Saturday 07:00", body: "Mandatory attendance for all residents.", date: "2026-06-10", level: "danger" },
];

export const kpis = {
  student: [
    { label: "Outstanding dues", value: "₹23,020", hint: "Due 25 Jun", tone: "warning" as const },
    { label: "Open complaints", value: "2", hint: "1 in progress", tone: "info" as const },
    { label: "Leave status", value: "Pending", hint: "lr-771", tone: "warning" as const },
    { label: "Active visitor pass", value: "1", hint: "Valid today", tone: "success" as const },
  ],
  warden: [
    { label: "Urgent complaints", value: "4", hint: "+2 since 06:00", tone: "danger" as const },
    { label: "Leave approvals", value: "9", hint: "Pending review", tone: "warning" as const },
    { label: "Occupancy", value: "87%", hint: "Block C nearing cap", tone: "info" as const },
    { label: "Gate events / hr", value: "42", hint: "Peak 11:00–12:00", tone: "success" as const },
  ],
  admin: [
    { label: "Collection rate", value: "92.4%", hint: "Jun cycle", tone: "success" as const },
    { label: "Occupancy trend", value: "+3.1%", hint: "QoQ", tone: "info" as const },
    { label: "Open escalations", value: "7", hint: "2 SLA breach", tone: "danger" as const },
    { label: "AI verification", value: "96.1%", hint: "Match rate", tone: "success" as const },
  ],
};
