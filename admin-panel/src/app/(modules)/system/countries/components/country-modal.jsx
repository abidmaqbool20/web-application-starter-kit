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
import {
    closeModal,
    setFormData,
    createCountry,
    updateCountry,
} from "@/slices/countriesSlice";

export default function CountryModal() {
    const dispatch = useDispatch();
    const {
        isModalOpen,
        modalMode,
        formData,
        creating,
        updating,
        error,
    } = useSelector((state) => state.countries);

    const isLoading = creating || updating;
    const isEditMode = modalMode === "edit";

    // Cleanup body styles when modal closes or component unmounts
    useEffect(() => {
        if (!isModalOpen) {
            // Remove any stale Radix dialog styles from body
            document.body.style.pointerEvents = "";
            document.body.style.overflow = "";
            document.body.removeAttribute("data-scroll-locked");
        }
        return () => {
            // Cleanup on unmount
            document.body.style.pointerEvents = "";
            document.body.style.overflow = "";
            document.body.removeAttribute("data-scroll-locked");
        };
    }, [isModalOpen]);

    const handleClose = () => {
        if (!isLoading) {
            dispatch(closeModal());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ field: name, value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name?.trim()) {
            return;
        }
        if (!formData.isoCode?.trim()) {
            return;
        }

        if (isEditMode) {
            dispatch(updateCountry(formData));
        } else {
            dispatch(createCountry(formData));
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
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Country" : "Add New Country"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Update the country details below."
                                : "Fill in the details to create a new country."}
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
                                Country Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., United States"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="isoCode">
                                ISO Code <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="isoCode"
                                name="isoCode"
                                placeholder="e.g., US"
                                value={formData.isoCode}
                                onChange={handleChange}
                                disabled={isLoading}
                                maxLength={5}
                                className="uppercase"
                            />
                            <p className="text-xs text-muted-foreground">
                                2-5 letter ISO country code
                            </p>
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
                            disabled={isLoading || !formData.name?.trim() || !formData.isoCode?.trim()}
                            className="gap-2"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditMode
                                ? updating
                                    ? "Saving..."
                                    : "Save Changes"
                                : creating
                                    ? "Creating..."
                                    : "Create Country"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
