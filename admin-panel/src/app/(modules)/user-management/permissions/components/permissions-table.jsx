"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Search, X } from "lucide-react";
import graphqlService from "@/services/graphqlService";
import { GET_PERMISSIONS } from "@/graphql/queries/permissions";
import { setPermissions, setLoading, setError, setPage, setModalOpen, setEditingPermission, setFilter } from "@/slices/permissionsSlice";
import { usePermission } from "@/hooks/usePermission";

export default function PermissionsTable() {
    const dispatch = useDispatch();
    const { permissions, loading, error, page, totalPages, filter } = useSelector((state) => state.permissions);
    const { hasPermission } = usePermission();
    const canEdit = hasPermission("permission-edit");
    const canDelete = hasPermission("permission-delete");
    const fetchingRef = useRef(false);

    // Fetch permissions from backend
    const fetchPermissions = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await graphqlService.query(GET_PERMISSIONS);
            dispatch(setPermissions(data.permissions));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!fetchingRef.current) {
            fetchingRef.current = true;
            fetchPermissions().finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [fetchPermissions]);

    // Filter/search logic
    const handleSearchChange = (e) => {
        dispatch(setFilter(e.target.value));
    };

    const handleEdit = useCallback((perm) => {
        dispatch(setEditingPermission(perm));
        dispatch(setModalOpen(true));
    }, [dispatch]);

    // Get parent name helper
    const getParentName = useCallback((parent_id) => {
        if (!parent_id) return '-';
        const parent = permissions.find(p => p.id === parent_id);
        return parent ? parent.name : parent_id;
    }, [permissions]);

    // Filter permissions based on search
    const filteredPermissions = useMemo(() => {
        if (!filter) return permissions;
        const lowerFilter = filter.toLowerCase();
        return permissions.filter(perm =>
            perm.name?.toLowerCase().includes(lowerFilter) ||
            perm.key?.toLowerCase().includes(lowerFilter)
        );
    }, [permissions, filter]);

    // Table UI (adapted from master-data-table)
    return (
        <Card>
            <CardContent className="p-0">
                <div className="p-4 border-b flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or key..."
                            value={filter}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Table>
                    <TableCaption className="py-4">
                        {loading
                            ? "Loading permissions..."
                            : `Showing ${filteredPermissions.length} of ${permissions.length} permissions`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredPermissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    {filter ? "No permissions match your search." : "No permissions found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPermissions.map((perm) => (
                                <TableRow key={perm.id}>
                                    <TableCell>{perm.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{perm.key}</TableCell>
                                    <TableCell>{getParentName(perm.parent_id)}</TableCell>
                                    <TableCell className="text-right">
                                        {(canEdit || canDelete) ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {canEdit && (
                                                        <DropdownMenuItem onClick={() => handleEdit(perm)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    {canDelete && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{perm.name}"? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        // onClick={() => handleDelete(perm.id)}
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No actions</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination can be added here if needed */}
            </CardContent>
        </Card>
    );
}
