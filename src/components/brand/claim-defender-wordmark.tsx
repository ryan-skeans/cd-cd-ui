import { cn } from "../../lib/utils";

export interface ClaimDefenderWordmarkProps {
    className?: string;
    showTagline?: boolean;
    taglineClassName?: string;
}

export function ClaimDefenderWordmark({ className, showTagline = false, taglineClassName }: ClaimDefenderWordmarkProps) {
    return (
        <span className={cn("min-w-0", className)}>
            <span className="block whitespace-nowrap font-semibold leading-none tracking-[-0.045em]">ClaimDefender</span>
            {showTagline && <span className={cn("mt-2 block whitespace-nowrap font-medium uppercase tracking-[0.16em] opacity-70", taglineClassName)}>Weather evidence. Clearly documented.</span>}
        </span>
    );
}
