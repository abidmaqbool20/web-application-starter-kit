'use client';
import dynamic from "next/dynamic";
import PageHeader from "../components/page-header";
const UserModal = dynamic(() => import("../components/user-modal"), { ssr: false });
const UserViewDrawer = dynamic(() => import("../components/user-view-drawer"), { ssr: false });
import UsersTable from "../components/users-table";

export default function UsersPage() {
    return (
        <>
            <PageHeader />
            <UserModal />
            <UserViewDrawer />
            <UsersTable />
        </>
    );
}
