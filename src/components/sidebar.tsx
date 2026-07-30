import { Button } from "@/components/ui/button";
import { Shield, MapPin, Search, FileCheck, LucideIcon } from "lucide-react";

export interface StepItem {
    id: number;
    icon: LucideIcon;
    label: string;
}

export const DEFAULT_STEPS: StepItem[] = [
    {
        id: 1,
        icon: MapPin,
        label: "Find Address\n& Weather Date",
    },
    {
        id: 2,
        icon: Search,
        label: "Gather\nClaim Details",
    },
    {
        id: 3,
        icon: FileCheck,
        label: "Unlock Damage\n& Get Report",
    },
];

interface SidebarProps {
    steps?: StepItem[];
    onGetStarted?: () => void;
}

export default function Sidebar({ steps = DEFAULT_STEPS, onGetStarted }: SidebarProps) {
    return (
        <aside className="w-full lg:w-[480px] xl:w-[540px] bg-brand-olive text-white flex flex-col min-h-screen lg:h-screen lg:sticky lg:top-0 shrink-0">
            {/* Header Info inside Sidebar */}
            <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-white" />
                    <span className="font-bold text-lg tracking-tight">
                        ClaimDefender
                        <span className="font-normal text-sm ml-1 text-white/80">AI</span>
                    </span>
                </div>
                <Button
                    onClick={onGetStarted}
                    variant="outline"
                    className="bg-brand-lime text-brand-olive border-none hover:bg-brand-limeLight hover:text-brand-oliveDark h-8 text-xs font-semibold px-4 rounded-md cursor-pointer"
                >
                    Get Started
                </Button>
            </div>

            <div className="px-8 pb-8 pt-4 sm:pt-12 flex-1 flex flex-col justify-center">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-tight leading-[1.05] text-[#FAFAFA] mb-6">
                    Claim Denied<br />
                    Unfairly? It&apos;s Time<br />
                    To Fight Back.
                </h1>
                <p className="text-[#EBEBEB]/80 text-[15px] sm:text-base leading-relaxed max-w-[420px] mb-12">
                    Insurance companies are using AI and satellite imagery to unfairly deny claims more than ever. It&apos;s time to even the playing field.
                </p>

                <div className="mb-4">
                    <span className="text-brand-lime text-sm font-semibold tracking-wide uppercase">Three Simple Steps</span>
                </div>

                {/* 3 Steps Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                className="bg-[#464f33] rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center text-center aspect-square border border-white/10 shadow-lg group hover:bg-brand-lime hover:text-brand-olive transition-colors cursor-default"
                            >
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-3 text-brand-lime group-hover:text-brand-olive opacity-80 shrink-0" />
                                <span className="text-[10px] sm:text-xs font-medium leading-tight whitespace-pre-line">
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Links in Sidebar */}
            <div className="p-8 pt-0 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Social</a>
                <a href="#" className="hover:text-white transition-colors">Address</a>
                <a href="#" className="hover:text-white transition-colors">Legal Terms</a>
            </div>
        </aside>
    );
}

