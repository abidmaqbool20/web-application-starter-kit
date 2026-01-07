'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const PermissionsModal = dynamic(() => import("../components/permissions-modal"), { ssr: false });
import PermissionsTable from "../components/permissions-table";

export default function PermissionsPage() {
    return (
        <>
            <PageHeader />
            <PermissionsModal />
            <PermissionsTable />
        </>
    );
}
