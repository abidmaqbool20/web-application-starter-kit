'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const StateModal = dynamic(() => import("../components/state-modal"), { ssr: false });
import StatesTable from "../components/states-table";

export default function StatesPage() {
    return (
        <>
            <PageHeader />
            <StateModal />
            <StatesTable />
        </>
    );
}
