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
    | "demo_pdf_downloaded"
    | "report_pdf_flow_opened"
    | "complete_report_pdf_generated"
    | "customize_report_pdf_opened"
    | "customized_report_recommendations_restored"
    | "customized_report_pdf_generated"
    | "customized_report_pdf_generation_failed";

export function trackDemoEvent(event: DemoProductEvent, metadata?: Record<string, string | number | boolean>) {
    if (process.env.NODE_ENV === "development") {
        console.info("[ClaimDefender demo event]", event, metadata ?? {});
    }
}
