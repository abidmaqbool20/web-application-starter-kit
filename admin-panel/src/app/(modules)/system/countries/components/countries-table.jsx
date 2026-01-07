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
    fetchCountries,
    openEditModal,
    deleteCountry,
    setSort,
    setPage,
    setSearchFilter,
    setStatusFilter,
    clearFilters,
} from "@/slices/countriesSlice";

export default function CountriesTable() {
    const dispatch = useDispatch();
    const fetchingRef = useRef(false);
    const {
        countries,
        loading,
        deleting,
        totalCount,
        pagination,
        filters,
        hasFetched,
        error,
    } = useSelector((state) => state.countries);

    const { page, limit, sortField, sortOrder } = pagination;
    const { search, status } = filters;

    useEffect(() => {
        // Only fetch if we haven't fetched yet and not currently fetching
        if (!hasFetched && !fetchingRef.current) {
            fetchingRef.current = true;
            dispatch(fetchCountries()).finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [dispatch, hasFetched]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        dispatch(setSort({ field, order: newOrder }));
    };

    const handleEdit = (country) => {
        dispatch(openEditModal(country));
    };

    const handleDelete = (id) => {
        dispatch(deleteCountry(id));
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchFilter(e.target.value));
    };

    const handleStatusChange = (value) => {
        dispatch(setStatusFilter(value));
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
        let result = [...countries];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (country) =>
                    country.name?.toLowerCase().includes(searchLower) ||
                    country.isoCode?.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (status !== "all") {
            const isActive = status === "active";
            result = result.filter((country) => country.isActive === isActive);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortField === "name") {
                aVal = a.name || "";
                bVal = b.name || "";
            } else if (sortField === "isoCode") {
                aVal = a.isoCode || "";
                bVal = b.isoCode || "";
            } else if (sortField === "isActive") {
                aVal = a.isActive ? 1 : 0;
                bVal = b.isActive ? 1 : 0;
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
    }, [countries, search, status, sortField, sortOrder]);

    // Paginate filtered data
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    }, [filteredData, page, limit]);
    const totalFilteredCount = filteredData.length;
    const totalPages = Math.ceil(totalFilteredCount / limit);

    const hasActiveFilters = search || status !== "all";

    if (error) {
        return (
            <Card className="mx-4">
                <CardContent className="p-6">
                    <div className="text-center text-destructive">
                        <p>Error loading countries: {error}</p>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(fetchCountries())}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading && countries.length === 0) {
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
        <Card>
            <CardContent className="p-0">
                {/* Filter Section */}
                <div className="flex flex-col md:flex-row gap-3 p-4 border-b">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or ISO code..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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

                <Table className="w-full">
                    <TableCaption>
                        {totalFilteredCount === 0
                            ? "No countries found."
                            : `Showing ${paginatedData.length} of ${totalFilteredCount} countries`}
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
                                onClick={() => handleSort("isoCode")}
                                className="cursor-pointer border-b"
                            >
                                ISO Code{renderSortIcon("isoCode")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("isActive")}
                                className="cursor-pointer border-b"
                            >
                                Status{renderSortIcon("isActive")}
                            </TableHead>
                            <TableHead className="text-right border-b w-[100px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {hasActiveFilters
                                        ? "No countries match your filters."
                                        : "No countries found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((country) => (
                                <TableRow key={country.id}>
                                    <TableCell className="font-medium">{country.id}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">{country.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono">
                                            {country.isoCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {country.isActive ? (
                                            <Badge variant="default">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
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
                                                <DropdownMenuItem onClick={() => handleEdit(country)}>
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
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently
                                                                delete the country "{country.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(country.id)}
                                                                disabled={deleting}
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
