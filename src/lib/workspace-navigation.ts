export const WORKSPACE_OVERVIEW_PATH = "/professionals/workspace";
export const WORKSPACE_PACKAGES_PATH = "/professionals/workspace/packages";
export const WORKSPACE_NEW_PACKAGE_PATH = "/professionals/workspace/packages/new";
export const WORKSPACE_ORGANIZATION_PATH = "/professionals/workspace/organization";

export function isWorkspaceLinkActive(pathname: string, href: string) {
    if (href === WORKSPACE_PACKAGES_PATH) {
        return pathname === href
            || (pathname.startsWith(`${href}/`) && !pathname.startsWith(WORKSPACE_NEW_PACKAGE_PATH));
    }
    return pathname === href;
}
