import { QRCodeSVG } from "qrcode.react";

import { cn } from "@/lib/utils";
import { buildVisitorQrValue } from "@/lib/visitor-qr";
import type { VisitorRequest } from "@/lib/hostel-data";

type VisitorQrProps = {
  visitor: VisitorRequest;
  size?: number;
  caption?: string;
  className?: string;
};

export function VisitorQr({ visitor, size = 144, caption, className }: VisitorQrProps) {
  return (
    <figure className={cn("grid justify-items-center gap-3", className)}>
      <div className="grid place-items-center rounded-lg border border-border bg-background/60 p-3">
        <QRCodeSVG
          value={buildVisitorQrValue(visitor)}
          size={size}
          bgColor="transparent"
          fgColor="#f3b55a"
          level="M"
          includeMargin={false}
        />
      </div>
      {caption ? (
        <figcaption className="text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}