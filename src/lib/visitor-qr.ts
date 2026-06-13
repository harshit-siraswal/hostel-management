import type { VisitorRequest } from "./hostel-data";

type VisitorQrSource = Pick<VisitorRequest, "id" | "passCode" | "visitor" | "host" | "hostRoom" | "validFrom" | "validTo">;

export function buildVisitorQrValue(visitor: VisitorQrSource) {
  const params = new URLSearchParams({
    code: visitor.passCode || visitor.id,
    visitor: visitor.visitor,
    host: visitor.host,
    room: visitor.hostRoom,
    from: visitor.validFrom,
    to: visitor.validTo,
  });

  return `bunkhaus://visitor-pass?${params.toString()}`;
}