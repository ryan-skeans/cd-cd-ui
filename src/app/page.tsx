import { redirect } from "next/navigation";
import HomepageLanding from "@/components/homepage/homepage-landing";
import { legacyHomeownerQuery, SearchParamValue } from "@/lib/routing";

export default function HomePage({ searchParams = {} }: { searchParams?: Record<string, SearchParamValue> }) {
    const legacyDestination = legacyHomeownerQuery(searchParams);
    if (legacyDestination) redirect(legacyDestination);

    return <HomepageLanding />;
}
