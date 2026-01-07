"use client";

import React from "react";
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
    createUser,
    updateUser,
} from "@/slices/usersSlice";
import { fetchRoles, fetchPermissionsForDropdown } from "@/slices/rolesSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserModal() {
    const dispatch = useDispatch();
    const [rolesPopoverOpen, setRolesPopoverOpen] = React.useState(false);

    const {
        isModalOpen,
        isEditMode,
        formData,
        creating,
        updating,
        error,
    } = useSelector((state) => state.users);

    const {
        roles,
        loading: rolesLoading,
        permissions,
        permissionsLoading,
    } = useSelector((state) => state.roles);

    const isLoading = creating || updating;
    const isEditLoading = isEditMode && (!formData.id || !formData.name);

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

    // Fetch roles and permissions when modal opens if not already loaded
    useEffect(() => {
        if (isModalOpen) {
            if (roles.length === 0 && !rolesLoading) {
                dispatch(fetchRoles());
            }
            if (permissions.length === 0 && !permissionsLoading) {
                dispatch(fetchPermissionsForDropdown());
            }
        }
    }, [isModalOpen, roles.length, permissions.length, rolesLoading, permissionsLoading, dispatch]);

    // Compute permissions already included in selected roles
    const rolePermissions = React.useMemo(() => {
        return roles
            .filter((role) => formData.roleIds.includes(role.id))
            .flatMap((role) => role.permissions?.map((p) => p.id) || []);
    }, [roles, formData.roleIds]);

    // Filter permissions for additional selection
    const filteredPermissions = React.useMemo(() => {
        if (!permissions || permissions.length === 0) return [];
        return permissions.filter((perm) => !rolePermissions.includes(perm.id));
    }, [permissions, rolePermissions]);

    // Remove additional permissions that are now covered by roles
    useEffect(() => {
        if (formData.additionalPermissionIds && formData.additionalPermissionIds.length > 0) {
            const filteredAdditional = formData.additionalPermissionIds.filter(
                (permId) => !rolePermissions.includes(permId)
            );
            if (filteredAdditional.length !== formData.additionalPermissionIds.length) {
                dispatch(setFormData({ additionalPermissionIds: filteredAdditional }));
            }
        }
    }, [rolePermissions, formData.additionalPermissionIds, dispatch]);

    const handleClose = () => {
        if (!isLoading) {
            dispatch(closeModal());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    };

    const handleRolesChange = (value, e) => {
        // Prevent default behavior that closes the popover
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        let newRoleIds;
        if (formData.roleIds.includes(value)) {
            newRoleIds = formData.roleIds.filter((id) => id !== value);
        } else {
            newRoleIds = [...formData.roleIds, value];
        }
        dispatch(setFormData({ roleIds: newRoleIds }));
    };

    const handleRemoveRole = (value, e) => {
        e.stopPropagation();
        dispatch(setFormData({ roleIds: formData.roleIds.filter((id) => id !== value) }));
    };

    const handleAdditionalPermissionsChange = (selectedPermissions) => {
        dispatch(setFormData({ additionalPermissionIds: selectedPermissions }));
    };

    // Ensure additionalPermissionIds are always strings before submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name?.trim() || !formData.email?.trim()) {
            return;
        }

        if (!isEditMode && !formData.password?.trim()) {
            return;
        }

        // Coerce additionalPermissionIds to strings
        const safeFormData = {
            ...formData,
            additionalPermissionIds: (formData.additionalPermissionIds || []).map(String),
        };

        if (isEditMode) {
            dispatch(updateUser({ id: formData.id, data: safeFormData }));
        } else {
            dispatch(createUser(safeFormData));
        }
    };

    const formatError = (err) => {
        if (typeof err === "string") return err;
        if (err?.message) return err.message;
        if (Array.isArray(err?.message)) return err.message.join(", ");
        return "An error occurred. Please try again.";
    };

    const roleOptions = roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {isEditLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <span className="text-muted-foreground">Loading user data...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {isEditMode ? "Edit User" : "Add New User"}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditMode
                                    ? "Update the user details below."
                                    : "Fill in the details to create a new user."}
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
                                    Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="e.g., john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Password {!isEditMode && <span className="text-destructive">*</span>}
                                    {isEditMode && <span className="text-muted-foreground text-xs">(Leave blank to keep unchanged)</span>}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={isEditMode ? "Enter new password" : "Enter password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">
                                    Status <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    name="status"
                                    value={formData.status || "active"}
                                    onValueChange={(value) => dispatch(setFormData({ status: value }))}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="banned">Banned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    Roles <span className="text-destructive">*</span>
                                </Label>
                                {rolesLoading ? (
                                    <div className="flex items-center justify-center p-4 border rounded-md">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <Popover open={rolesPopoverOpen} onOpenChange={setRolesPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between min-h-9 h-auto"
                                                disabled={isLoading}
                                            >
                                                <div className="flex flex-wrap gap-1 flex-1">
                                                    {formData.roleIds.length > 0 ? (
                                                        roles
                                                            .filter((role) => formData.roleIds.includes(role.id))
                                                            .map((role) => (
                                                                <Badge key={role.id} variant="secondary" className="mr-1 mb-1">
                                                                    {role.name}
                                                                    <button
                                                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === "Enter") handleRemoveRole(role.id, e);
                                                                        }}
                                                                        onMouseDown={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                        }}
                                                                        onClick={(e) => handleRemoveRole(role.id, e)}
                                                                    >
                                                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                                    </button>
                                                                </Badge>
                                                            ))
                                                    ) : (
                                                        <span>Select roles...</span>
                                                    )}
                                                </div>
                                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" side="bottom">
                                            <Command>
                                                <CommandInput placeholder="Search roles..." />
                                                <CommandEmpty>No roles found.</CommandEmpty>
                                                <CommandGroup className="max-h-64 overflow-auto">
                                                    {roles.map((role) => {
                                                        const isSelected = formData.roleIds.includes(role.id);
                                                        return (
                                                            <CommandItem
                                                                key={role.id}
                                                                value={role.name}
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                }}
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    handleRolesChange(role.id);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                                                {role.name}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    Additional Permissions
                                    <span className="text-muted-foreground text-xs ml-2">(Beyond role permissions)</span>
                                </Label>
                                {permissionsLoading ? (
                                    <div className="flex items-center justify-center p-8 border rounded-md">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <PermissionTree
                                        permissions={filteredPermissions}
                                        selectedPermissions={formData.additionalPermissionIds}
                                        onSelectionChange={handleAdditionalPermissionsChange}
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
                                disabled={isLoading || !formData.name?.trim() || !formData.email?.trim() || (!isEditMode && !formData.password?.trim())}
                                className="gap-2"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isEditMode
                                    ? updating
                                        ? "Saving..."
                                        : "Save Changes"
                                    : creating
                                        ? "Creating..."
                                        : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
