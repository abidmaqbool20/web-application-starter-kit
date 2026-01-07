"use client";

import BreadcrumbComponent from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openCreateModal, fetchRoles } from "@/slices/rolesSlice";
import { usePermission } from "@/hooks/usePermission";

export default function PageHeader() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.roles);
    const { hasPermission } = usePermission();
    const canCreate = hasPermission("role-create");

    const handleCreate = () => {
        dispatch(openCreateModal());
    };

    const handleRefresh = () => {
        dispatch(fetchRoles());
    };

    return (
        <div className="flex flex-col">
            {/* Page Title and Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">Roles</h1>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="gap-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    {canCreate && (
                        <Button
                            onClick={handleCreate}
                            className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                        >
                            <Plus className="h-4 w-4" />
                            Add Role
                        </Button>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            <BreadcrumbComponent />
        </div>
    );
}
