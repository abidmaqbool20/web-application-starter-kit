"use client";

import { useEffect, useMemo } from "react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import {
    closeModal,
    setFormData,
    createState,
    updateState,
    fetchCountriesForDropdown,
} from "@/slices/statesSlice";

export default function StateModal() {
    const dispatch = useDispatch();
    const {
        isModalOpen,
        modalMode,
        formData,
        countries,
        countriesLoading,
        creating,
        updating,
        error,
    } = useSelector((state) => state.states);

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

    // Fetch countries when modal opens if not already loaded
    useEffect(() => {
        if (isModalOpen && countries.length === 0 && !countriesLoading) {
            dispatch(fetchCountriesForDropdown());
        }
    }, [isModalOpen, countries.length, countriesLoading, dispatch]);

    // Convert countries to combobox options
    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            value: country.id,
            label: country.name,
        }));
    }, [countries]);

    const handleClose = () => {
        if (!isLoading) {
            dispatch(closeModal());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ field: name, value }));
    };

    const handleCountryChange = (value) => {
        dispatch(setFormData({ field: "countryId", value: value ? parseInt(value, 10) : "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name?.trim()) {
            return;
        }
        if (!formData.countryId) {
            return;
        }

        // Ensure countryId is an integer
        const submitData = {
            ...formData,
            countryId: parseInt(formData.countryId, 10),
        };

        if (isEditMode) {
            dispatch(updateState(submitData));
        } else {
            dispatch(createState(submitData));
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
                className="sm:max-w-[425px] overflow-visible"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit State" : "Add New State"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Update the state details below."
                                : "Fill in the details to create a new state."}
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
                            <Label htmlFor="countryId">
                                Country <span className="text-destructive">*</span>
                            </Label>
                            <SearchableSelect
                                options={countryOptions}
                                value={formData.countryId}
                                onValueChange={handleCountryChange}
                                placeholder="Select a country..."
                                searchPlaceholder="Search countries..."
                                emptyText="No countries found."
                                disabled={isLoading || countriesLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                State Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., California"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.checked } })}
                                disabled={isLoading}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="isActive">Active</Label>
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
                            disabled={isLoading || !formData.name?.trim() || !formData.countryId}
                            className="gap-2"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditMode
                                ? updating
                                    ? "Saving..."
                                    : "Save Changes"
                                : creating
                                    ? "Creating..."
                                    : "Create State"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
