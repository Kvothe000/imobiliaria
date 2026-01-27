import { getProperties } from "@/app/actions/properties";
import { PropertiesViewClient } from "@/components/properties/properties-view-client";

export default async function PropertiesPage() {
    const result = await getProperties();
    const properties = result.success && result.data ? result.data : [];

    return (
        <PropertiesViewClient initialProperties={properties} />
    );
}
