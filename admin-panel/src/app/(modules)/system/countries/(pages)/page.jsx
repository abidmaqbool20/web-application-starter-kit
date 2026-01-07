'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const CountryModal = dynamic(() => import("../components/country-modal"), { ssr: false });
import CountriesTable from "../components/countries-table";

export default function CountriesPage() {
    return (
        <>
            <PageHeader />
            <CountryModal />
            <CountriesTable />
        </>
    );
}
