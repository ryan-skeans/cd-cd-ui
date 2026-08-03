import { cn } from "../../lib/utils";
import { CLAIM_DEFENDER_MARK_PATH } from "./claim-defender-path";

export type ClaimDefenderMarkVariant = "primary" | "navigation" | "compact";

export interface ClaimDefenderMarkProps {
    variant?: ClaimDefenderMarkVariant;
    className?: string;
    title?: string;
}

export function ClaimDefenderMark({ variant = "navigation", className, title }: ClaimDefenderMarkProps) {
    return (
        <svg
            viewBox="0 0 388 388"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("shrink-0", className)}
            role={title ? "img" : undefined}
            aria-label={title}
            aria-hidden={title ? undefined : true}
            data-logo-variant={variant}
        >
            <path d={CLAIM_DEFENDER_MARK_PATH} fill="currentColor" />
        </svg>
    );
}

