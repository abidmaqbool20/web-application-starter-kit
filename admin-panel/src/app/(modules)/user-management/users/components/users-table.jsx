"use client";

import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
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
import { MoreHorizontal, Pencil, Trash2, Search, X, Eye } from "lucide-react";
import {
    fetchUsers,
    deleteUser,
    setPage,
    setSearchFilter,
    setSort,
    clearFilters,
    setEditMode,
    openModal,
    fetchUserById,
    fetchUserWithStatusHistory,
} from "@/slices/usersSlice";
import { usePermission } from "@/hooks/usePermission";

export default function UsersTable() {
    const dispatch = useDispatch();
    const fetchingRef = useRef(false);
    const { hasPermission } = usePermission();
    const canEdit = hasPermission("user-edit");
    const canDelete = hasPermission("user-delete");
    const {
        users,
        loading,
        error,
        deleting,
        pagination,
        filters,
        hasFetched,
    } = useSelector((state) => state.users);

    const { page, limit, sortField, sortOrder } = pagination;
    const { search } = filters;

    useEffect(() => {
        if (!hasFetched && !fetchingRef.current) {
            fetchingRef.current = true;
            dispatch(fetchUsers()).finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [dispatch, hasFetched]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        dispatch(setSort({ field, order: newOrder }));
    };

    const handleView = (user) => {
        dispatch(fetchUserWithStatusHistory(user.id));
    };

    const handleEdit = (user) => {
        dispatch(fetchUserById(user.id)).then((action) => {
            if (action.meta && action.meta.requestStatus === "fulfilled" && action.payload) {
                dispatch(setEditMode(action.payload));
                // Do NOT call openModal here
            }
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteUser(id));
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchFilter(e.target.value));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const renderSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === "asc" ? " ↑" : " ↓";
    };

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...users];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter((user) =>
                user.name?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortField === "name" || sortField === "email") {
                aVal = a[sortField] || "";
                bVal = b[sortField] || "";
            } else if (sortField === "roles") {
                aVal = a.roles?.length || 0;
                bVal = b.roles?.length || 0;
            } else {
                aVal = a[sortField] || "";
                bVal = b[sortField] || "";
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
            }
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        return result;
    }, [users, search, sortField, sortOrder]);

    // Paginate filtered data
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    }, [filteredData, page, limit]);
    const totalFilteredCount = filteredData.length;
    const totalPages = Math.ceil(totalFilteredCount / limit);

    const hasActiveFilters = search;

    if (error) {
        return (
            <Card className="mx-4">
                <CardContent className="p-6">
                    <div className="text-center text-destructive">
                        <p>Error loading users: {error}</p>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(fetchUsers())}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading && users.length === 0) {
        return (
            <Card className="w-full py-0 rounded-none">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card >
            <CardContent className="p-0">
                {/* Filter Section */}
                <div className="flex flex-col md:flex-row gap-3 p-4 border-b">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={handleClearFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                <Table className="w-full">
                    <TableCaption>
                        {totalFilteredCount === 0
                            ? "No users found."
                            : `Showing ${paginatedData.length} of ${totalFilteredCount} users`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                onClick={() => handleSort("id")}
                                className="cursor-pointer border-b w-[80px]"
                            >
                                ID{renderSortIcon("id")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("name")}
                                className="cursor-pointer border-b"
                            >
                                Name{renderSortIcon("name")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("email")}
                                className="cursor-pointer border-b"
                            >
                                Email{renderSortIcon("email")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("status")}
                                className="cursor-pointer border-b w-[120px]"
                            >
                                Status{renderSortIcon("status")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("roles")}
                                className="cursor-pointer border-b"
                            >
                                Roles{renderSortIcon("roles")}
                            </TableHead>
                            <TableHead className="border-b">
                                Additional Permissions
                            </TableHead>
                            <TableHead className="text-right border-b w-[100px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    {hasActiveFilters
                                        ? "No users match your filters."
                                        : "No users found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleView(user)}
                                            className="font-medium text-primary hover:underline cursor-pointer text-left"
                                        >
                                            {user.name}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-muted-foreground">{user.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === "active" ? "default" :
                                                    user.status === "inactive" ? "secondary" :
                                                        user.status === "suspended" ? "outline" :
                                                            "destructive"
                                            }
                                            className="text-xs capitalize"
                                        >
                                            {user.status || "active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.roles && user.roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.slice(0, 2).map((role) => (
                                                    <Badge key={role.id} variant="default" className="text-xs">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                                {user.roles.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{user.roles.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">No roles</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.additional_permissions && user.additional_permissions.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {user.additional_permissions.slice(0, 2).map((perm) => (
                                                    <Badge key={perm.id} variant="secondary" className="text-xs">
                                                        {perm.name}
                                                    </Badge>
                                                ))}
                                                {user.additional_permissions.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{user.additional_permissions.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(user)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {canEdit && (
                                                    <DropdownMenuItem onClick={() => handleEdit(user)}>
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
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently
                                                                    delete the user "{user.name}".
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(user.id)}
                                                                    disabled={deleting}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    {deleting ? "Deleting..." : "Delete"}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalFilteredCount > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch(setPage(page - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dispatch(setPage(page + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
