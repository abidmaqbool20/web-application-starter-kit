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
    fetchCities,
    fetchCountriesForDropdown,
    fetchStatesForDropdown,
    openEditModal,
    deleteCity,
    setSort,
    setPage,
    setSearchFilter,
    setCountryFilter,
    setStateFilter,
    clearFilters,
} from "@/slices/citiesSlice";

export default function CitiesTable() {
    const dispatch = useDispatch();
    const fetchingRef = useRef(false);
    const {
        cities,
        countries,
        states,
        loading,
        deleting,
        totalCount,
        pagination,
        filters,
        hasFetched,
        error,
    } = useSelector((state) => state.cities);

    const { page, limit, sortField, sortOrder } = pagination;
    const { search, countryId, stateId } = filters;

    useEffect(() => {
        if (!hasFetched && !fetchingRef.current) {
            fetchingRef.current = true;
            Promise.all([
                dispatch(fetchCities()),
                dispatch(fetchCountriesForDropdown()),
                dispatch(fetchStatesForDropdown()),
            ]).finally(() => {
                fetchingRef.current = false;
            });
        }
    }, [dispatch, hasFetched]);

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        dispatch(setSort({ field, order: newOrder }));
    };

    const handleEdit = (city) => {
        dispatch(openEditModal(city));
    };

    const handleDelete = (id) => {
        dispatch(deleteCity(id));
    };

    const handleSearchChange = (e) => {
        dispatch(setSearchFilter(e.target.value));
    };

    const handleCountryChange = (value) => {
        dispatch(setCountryFilter(value));
    };

    const handleStateChange = (value) => {
        dispatch(setStateFilter(value));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const renderSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortOrder === "asc" ? " ↑" : " ↓";
    };

    // Get filtered states based on selected country
    const filteredStatesForFilter = useMemo(() => {
        if (countryId === "all") return states;
        return states.filter((s) => String(s.country?.id) === String(countryId));
    }, [states, countryId]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...cities];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter((city) =>
                city.name?.toLowerCase().includes(searchLower)
            );
        }

        // Apply country filter
        if (countryId !== "all") {
            result = result.filter(
                (city) => String(city.country?.id) === String(countryId)
            );
        }

        // Apply state filter
        if (stateId !== "all") {
            result = result.filter(
                (city) => String(city.state?.id) === String(stateId)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            if (sortField === "country") {
                aVal = a.country?.name || "";
                bVal = b.country?.name || "";
            } else if (sortField === "state") {
                aVal = a.state?.name || "";
                bVal = b.state?.name || "";
            } else if (sortField === "name") {
                aVal = a.name || "";
                bVal = b.name || "";
            } else if (sortField === "isActive") {
                aVal = a.isActive ? 1 : 0;
                bVal = b.isActive ? 1 : 0;
            } else {
                aVal = a[sortField] || "";
                bVal = a[sortField] || "";
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
    }, [cities, search, countryId, stateId, sortField, sortOrder]);

    // Paginate filtered data
    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredData.slice(start, end);
    }, [filteredData, page, limit]);
    const totalFilteredCount = filteredData.length;
    const totalPages = Math.ceil(totalFilteredCount / limit);

    const hasActiveFilters = search || countryId !== "all" || stateId !== "all";

    if (error) {
        return (
            <Card className="mx-4">
                <CardContent className="p-6">
                    <div className="text-center text-destructive">
                        <p>Error loading cities: {error}</p>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(fetchCities())}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading && cities.length === 0) {
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
                            placeholder="Search by name..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-9"
                        />
                    </div>
                    <Select value={countryId} onValueChange={handleCountryChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
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
                    <Select value={stateId} onValueChange={handleStateChange}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by state" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {filteredStatesForFilter.map((state) => (
                                <SelectItem key={state.id} value={String(state.id)}>
                                    {state.name}
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
                            ? "No cities found."
                            : `Showing ${paginatedData.length} of ${totalFilteredCount} cities`}
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
                                onClick={() => handleSort("state")}
                                className="cursor-pointer border-b"
                            >
                                State{renderSortIcon("state")}
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
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {hasActiveFilters
                                        ? "No cities match your filters."
                                        : "No cities found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((city) => (
                                <TableRow key={city.id}>
                                    <TableCell className="font-medium">{city.id}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">{city.name}</span>
                                    </TableCell>
                                    <TableCell>{city.country?.name || "-"}</TableCell>
                                    <TableCell>{city.state?.name || "-"}</TableCell>
                                    <TableCell>
                                        {city.isActive ? (
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
                                                <DropdownMenuItem onClick={() => handleEdit(city)}>
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
                                                                delete the city "{city.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(city.id)}
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
