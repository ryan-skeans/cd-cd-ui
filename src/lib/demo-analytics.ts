export type DemoProductEvent =
    | "shared_home_viewed"
    | "homeowner_path_selected"
    | "professional_path_selected"
    | "homeowner_search_started"
    | "homeowner_search_completed"
    | "professional_workspace_opened"
    | "professional_package_created"
    | "professional_search_completed"
    | "report_preview_opened"
    | "demo_pdf_downloaded";

export function trackDemoEvent(event: DemoProductEvent, metadata?: Record<string, string | number | boolean>) {
    if (process.env.NODE_ENV === "development") {
        console.info("[ClaimDefender demo event]", event, metadata ?? {});
    }
}
