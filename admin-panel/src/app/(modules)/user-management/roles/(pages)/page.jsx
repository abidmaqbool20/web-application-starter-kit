"use client";

import RolesTable from "../components/roles-table";
import PageHeader from "../components/page-header";
import RolesModal from "../components/roles-modal";
export default function RolesPage() {
    return (
        <>
            <div>
                <div >
                    <PageHeader />
                </div>
                <div className="grid gap-4 w-full">
                    <RolesTable />
                </div>
            </div>
            {/* Create/Edit Modal */}
            <RolesModal />
        </>
    );
}
