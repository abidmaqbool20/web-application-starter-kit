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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import {
    fetchMasterDataList,
    openEditModal,
    deleteMasterData,
    setSort,
    setPage,
    setSearchFilter,
    setCategoryFilter,
    setActiveFilter,
    clearFilters,
} from "@/slices/masterDataSlice";

export default function MasterDataTable() {
    const dispatch = useDispatch();
    const fetchingRef = useRef(false);
    const {
        masterDataList,
        loading,
        deleting,
        totalCount,
        pagination,
        filters,
        hasFetched,
        error,
    } = useSelector((state) => state.masterData);

    const { page, limit, sortField, sortOrder } = pagination;
    const { search, category, isActive } = filters;

    useEffect(() => {
        if (!hasFetched && !fetchingRef.current) {
            fetchingRef.current = true;
            dispatch(fetchMasterDataList()).finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [dispatch, hasFetched]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        dispatch(setSort({ field, order: newOrder }));
    };

    const handleEdit = (item) => {
        dispatch(openEditModal(item));
    };

    const handleDelete = (id) => {
        dispatch(deleteMasterData(id));
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchFilter(e.target.value));
    };

    const handleCategoryChange = (value) => {
        dispatch(setCategoryFilter(value));
    };

    const handleActiveChange = (value) => {
        dispatch(setActiveFilter(value));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const renderSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === "asc" ? " ↑" : " ↓";
    };

    // Get unique categories for filter dropdown
    const categories = useMemo(() => {
        const unique = [...new Set(masterDataList.map((item) => item.category))];
        return unique.sort();
    }, [masterDataList]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...masterDataList];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.value?.toLowerCase().includes(searchLower) ||
                    item.key?.toLowerCase().includes(searchLower) ||
                    item.label?.toLowerCase().includes(searchLower) ||
                    item.category?.toLowerCase().includes(searchLower)
            );
        }

        // Apply category filter
        if (category !== "all") {
            result = result.filter((item) => item.category === category);
        }

        // Apply active filter
        if (isActive !== "all") {
            const activeValue = isActive === "true";
            result = result.filter((item) => item.isActive === activeValue);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortField === "parent") {
                aVal = a.parent?.value || "";
                bVal = b.parent?.value || "";
            } else {
                aVal = a[sortField] ?? "";
                bVal = b[sortField] ?? "";
            }

            // Handle numbers
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
            }

            // Handle strings
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [masterDataList, search, category, isActive, sortField, sortOrder]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    }, [filteredData, page, limit]);

    const totalPages = Math.ceil(filteredData.length / limit);

    const hasActiveFilters = search || category !== "all" || isActive !== "all";

    if (error) {
        return (
            <Card className="mx-4">
                <CardContent className="p-6">
                    <div className="text-center text-destructive">
                        <p>Error loading master data: {error}</p>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(fetchMasterDataList())}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                {/* Filters */}
                <div className="p-4 border-b flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by value, key, label, or category..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </div>
                    <Select value={category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={isActive} onValueChange={handleActiveChange}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
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

                {/* Table */}
                <Table>
                    <TableCaption className="py-4">
                        {loading
                            ? "Loading master data..."
                            : `Showing ${paginatedData.length} of ${filteredData.length} entries`}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("category")}
                            >
                                Category{renderSortIcon("category")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("key")}
                            >
                                Key{renderSortIcon("key")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("value")}
                            >
                                Value{renderSortIcon("value")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("label")}
                            >
                                Label{renderSortIcon("label")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("sortOrder")}
                            >
                                Order{renderSortIcon("sortOrder")}
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSort("parent")}
                            >
                                Parent{renderSortIcon("parent")}
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    {hasActiveFilters
                                        ? "No entries match your filters."
                                        : "No master data entries yet. Click 'Add Entry' to create one."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {item.category?.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {item.key || "-"}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.value}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.label || "-"}
                                    </TableCell>
                                    <TableCell className="text-center">{item.sortOrder}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.parent?.value || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.isActive ? "default" : "secondary"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
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
                                                            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{item.value}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                {deleting ? "Deleting..." : "Delete"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
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
