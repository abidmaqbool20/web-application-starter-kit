'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const MasterDataModal = dynamic(() => import("../components/master-data-modal"), { ssr: false });
import MasterDataTable from "../components/master-data-table";

export default function MasterDataPage() {
    return (
        <>
            <PageHeader />
            <MasterDataModal />
            <MasterDataTable />
        </>
    );
}
