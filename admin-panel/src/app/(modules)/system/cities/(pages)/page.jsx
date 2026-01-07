'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const CityModal = dynamic(() => import("../components/city-modal"), { ssr: false });
import CitiesTable from "../components/cities-table";

export default function CitiesPage() {
    return (
        <>
            <PageHeader />
            <CityModal />
            <CitiesTable />
        </>
    );
}
