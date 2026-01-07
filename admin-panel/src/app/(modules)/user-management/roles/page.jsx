'use client';
import dynamic from "next/dynamic";
import RolesPageHeader from "./components/page-header";
const RolesModal = dynamic(() => import("./components/roles-modal"), { ssr: false });
import RolesTable from "./components/roles-table";

export default function RolesPage() {
    return (
        <>
            <RolesPageHeader />
            <RolesModal />
            <RolesTable />
        </>
    );
}
