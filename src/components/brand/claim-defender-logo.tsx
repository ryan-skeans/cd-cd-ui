import { ClaimDefenderMark } from "./claim-defender-mark";
import { ClaimDefenderWordmark } from "./claim-defender-wordmark";
import { cn } from "../../lib/utils";

export type ClaimDefenderLogoVariant = "primary" | "navigation" | "compact" | "mark";

export interface ClaimDefenderLogoProps {
    variant?: ClaimDefenderLogoVariant;
    className?: string;
    showTagline?: boolean;
    showWordmark?: boolean;
    inverted?: boolean;
}

export function ClaimDefenderLogo({
    variant = "navigation",
    className,
    showTagline = variant === "primary",
    showWordmark = variant !== "mark" && variant !== "compact",
    inverted = false,
}: ClaimDefenderLogoProps) {
    const markVariant = variant === "primary" ? "primary" : variant === "navigation" ? "navigation" : "compact";
    const markSize = variant === "primary" ? "h-16 w-16 sm:h-24 sm:w-24" : variant === "navigation" ? "h-9 w-9" : "h-8 w-8";
    const wordmarkSize = variant === "primary" ? "text-[1.65rem] sm:text-[2.75rem]" : variant === "navigation" ? "text-[1.05rem]" : "text-sm";

    return (
        <span
            className={cn("inline-flex max-w-full items-center", variant === "primary" ? "gap-4 sm:gap-5" : "gap-2.5", inverted ? "text-brand-offWhite" : "text-brand-forest", className)}
            role="img"
            aria-label="ClaimDefender"
        >
            <ClaimDefenderMark
                variant={markVariant}
                className={markSize}
            />
            {showWordmark && <ClaimDefenderWordmark className={wordmarkSize} showTagline={showTagline} taglineClassName={variant === "primary" ? "text-[0.44rem] sm:text-[0.7rem]" : "text-[0.5rem]"} />}
        </span>
    );
}
