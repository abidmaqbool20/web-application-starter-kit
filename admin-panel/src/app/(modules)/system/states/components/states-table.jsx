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
    fetchStates,
    fetchCountriesForDropdown,
    openEditModal,
    deleteState,
    setSort,
    setPage,
    setSearchFilter,
    setCountryFilter,
    clearFilters,
} from "@/slices/statesSlice";

export default function StatesTable() {
    const dispatch = useDispatch();
    const fetchingRef = useRef(false);
    const {
        states,
        countries,
        loading,
        deleting,
        totalCount,
        pagination,
        filters,
        hasFetched,
        error,
    } = useSelector((state) => state.states);

    const { page, limit, sortField, sortOrder } = pagination;
    const { search, countryId } = filters;

    useEffect(() => {
        // Only fetch if we haven't fetched yet and not currently fetching
        if (!hasFetched && !fetchingRef.current) {
            fetchingRef.current = true;
            Promise.all([
                dispatch(fetchStates()),
                dispatch(fetchCountriesForDropdown()),
            ]).finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [dispatch, hasFetched]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        dispatch(setSort({ field, order: newOrder }));
    };

    const handleEdit = (state) => {
        dispatch(openEditModal(state));
    };

    const handleDelete = (id) => {
        dispatch(deleteState(id));
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchFilter(e.target.value));
    };

    const handleCountryChange = (value) => {
        dispatch(setCountryFilter(value));
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
        let result = [...states];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (state) =>
                    state.name?.toLowerCase().includes(searchLower)
            );
        }

        // Apply country filter
        if (countryId !== "all") {
            result = result.filter(
                (state) => String(state.country?.id) === String(countryId) || String(state.countryId) === String(countryId)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortField === "country") {
                aVal = a.country?.name || "";
                bVal = b.country?.name || "";
            } else if (sortField === "name") {
                aVal = a.name || "";
                bVal = b.name || "";
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
    }, [states, search, countryId, sortField, sortOrder]);

    // Paginate filtered data
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    }, [filteredData, page, limit]);
    const totalFilteredCount = filteredData.length;
    const totalPages = Math.ceil(totalFilteredCount / limit);

    const hasActiveFilters = search || countryId !== "all";

    if (error) {
        return (
            <Card className="mx-4">
                <CardContent className="p-6">
                    <div className="text-center text-destructive">
                        <p>Error loading states: {error}</p>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(fetchStates())}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading && states.length === 0) {
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
                            placeholder="Search by name..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                    <Select value={countryId} onValueChange={handleCountryChange}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Countries</SelectItem>
                            {countries.map((country) => (
                                <SelectItem key={country.id} value={String(country.id)}>
                                    {country.name}
                                </SelectItem>
                            ))}
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
                            ? "No states found."
                            : `Showing ${paginatedData.length} of ${totalFilteredCount} states`}
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
                                onClick={() => handleSort("country")}
                                className="cursor-pointer border-b"
                            >
                                Country{renderSortIcon("country")}
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
                                        ? "No states match your filters."
                                        : "No states found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((state) => (
                                <TableRow key={state.id}>
                                    <TableCell className="font-medium">{state.id}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">{state.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        {state.country?.name || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {state.isActive ? (
                                            <Badge variant="default" className="bg-green-500">
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
                                                <DropdownMenuItem onClick={() => handleEdit(state)}>
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
                                                                delete the state "{state.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(state.id)}
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
