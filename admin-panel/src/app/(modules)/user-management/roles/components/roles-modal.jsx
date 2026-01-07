"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { PermissionTree } from "@/components/ui/permission-tree";
import {
    closeModal,
    setFormData,
    createRole,
    updateRole,
    fetchPermissionsForDropdown,
} from "@/slices/rolesSlice";

export default function RolesModal() {
    const dispatch = useDispatch();
    const {
        isModalOpen,
        modalMode,
        formData,
        permissions,
        permissionsLoading,
        creating,
        updating,
        error,
    } = useSelector((state) => state.roles);

    const isLoading = creating || updating;
    const isEditMode = modalMode === "edit";

    // Cleanup body styles when modal closes or component unmounts
    useEffect(() => {
        if (!isModalOpen) {
            document.body.style.pointerEvents = "";
            document.body.style.overflow = "";
            document.body.removeAttribute("data-scroll-locked");
        }
        return () => {
            document.body.style.pointerEvents = "";
            document.body.style.overflow = "";
            document.body.removeAttribute("data-scroll-locked");
        };
    }, [isModalOpen]);

    // Fetch permissions when modal opens if not already loaded
    useEffect(() => {
        if (isModalOpen) {
            if (permissions.length === 0 && !permissionsLoading) {
                dispatch(fetchPermissionsForDropdown());
            }
        }
    }, [isModalOpen, permissions.length, permissionsLoading, dispatch]);

    const handleClose = () => {
        if (!isLoading) {
            dispatch(closeModal());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ field: name, value }));
    };

    const handlePermissionsChange = (selectedPermissions) => {
        dispatch(setFormData({ field: "permissions", value: selectedPermissions }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name?.trim()) {
            return;
        }

        const submitData = {
            ...formData,
            permissions: formData.permissions || [],
        };

        if (isEditMode) {
            dispatch(updateRole(submitData));
        } else {
            dispatch(createRole(submitData));
        }
    };

    const formatError = (err) => {
        if (typeof err === "string") return err;
        if (err?.message) return err.message;
        if (Array.isArray(err?.message)) return err.message.join(", ");
        return "An error occurred. Please try again.";
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="sm:max-w-[600px] overflow-visible"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Role" : "Add New Role"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Update the role details below."
                                : "Fill in the details to create a new role."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{formatError(error)}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Role Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Administrator"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>
                                Permissions <span className="text-destructive">*</span>
                            </Label>
                            {permissionsLoading ? (
                                <div className="flex items-center justify-center p-8 border rounded-md">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <PermissionTree
                                    permissions={permissions}
                                    selectedPermissions={formData.permissions}
                                    onSelectionChange={handlePermissionsChange}
                                    disabled={isLoading}
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.name?.trim()}
                            className="gap-2"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditMode
                                ? updating
                                    ? "Saving..."
                                    : "Save Changes"
                                : creating
                                    ? "Creating..."
                                    : "Create Role"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
