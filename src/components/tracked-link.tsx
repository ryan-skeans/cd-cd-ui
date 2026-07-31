"use client";

import Link, { LinkProps } from "next/link";
import { trackDemoEvent, DemoProductEvent } from "@/lib/demo-analytics";

export default function TrackedLink({ event, children, className, ...props }: LinkProps & { event: DemoProductEvent; children: React.ReactNode; className?: string }) {
    return <Link {...props} className={className} onClick={() => trackDemoEvent(event)}>{children}</Link>;
}
