import { DemoWorkspaceProvider } from "@/components/demo-workspace-provider";
import WorkspaceShell from "@/components/workspace-shell";

export default function ProfessionalWorkspaceLayout({ children }: { children: React.ReactNode }) {
    return <DemoWorkspaceProvider><WorkspaceShell>{children}</WorkspaceShell></DemoWorkspaceProvider>;
}
