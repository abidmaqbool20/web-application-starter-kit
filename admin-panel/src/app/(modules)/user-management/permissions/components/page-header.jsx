"use client";

import BreadcrumbComponent from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen, setPermissions, setLoading, setError } from "@/slices/permissionsSlice";
import { usePermission } from "@/hooks/usePermission";
import graphqlService from "@/services/graphqlService";
import { GET_PERMISSIONS } from "@/graphql/queries/permissions";

export default function PageHeader() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.permissions);
    const { hasPermission } = usePermission();
    const canCreate = hasPermission("permission-create");

    const handleCreate = () => {
        dispatch(setModalOpen(true));
    };

    const handleRefresh = async () => {
        dispatch(setLoading(true));
        try {
            const data = await graphqlService.query(GET_PERMISSIONS);
            dispatch(setPermissions(data.permissions));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex flex-col">
            {/* Page Title and Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">Permissions</h1>
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
                            Add Permission
                        </Button>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            <BreadcrumbComponent />
        </div>
    );
}
