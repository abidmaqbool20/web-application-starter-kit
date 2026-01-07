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
    createMasterData,
    updateMasterData,
    fetchParentItems,
} from "@/slices/masterDataSlice";

// Common categories used in the system
const COMMON_CATEGORIES = [
    { value: "employment_type", label: "Employment Type" },
    { value: "education_level", label: "Education Level" },
    { value: "marital_status", label: "Marital Status" },
    { value: "gender", label: "Gender" },
    { value: "religion", label: "Religion" },
    { value: "caste", label: "Caste" },
    { value: "blood_group", label: "Blood Group" },
    { value: "body_type", label: "Body Type" },
    { value: "complexion", label: "Complexion" },
    { value: "diet", label: "Diet" },
    { value: "drinking_habit", label: "Drinking Habit" },
    { value: "smoking_habit", label: "Smoking Habit" },
    { value: "family_type", label: "Family Type" },
    { value: "family_status", label: "Family Status" },
    { value: "income_range", label: "Income Range" },
    { value: "mother_tongue", label: "Mother Tongue" },
    { value: "zodiac_sign", label: "Zodiac Sign" },
];

export default function MasterDataModal() {
    const dispatch = useDispatch();
    const {
        isModalOpen,
        modalMode,
        formData,
        masterDataList,
        parentItems,
        parentItemsLoading,
        creating,
        updating,
        error,
    } = useSelector((state) => state.masterData);

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

    // Fetch parent items when modal opens
    useEffect(() => {
        if (isModalOpen && parentItems.length === 0 && !parentItemsLoading) {
            dispatch(fetchParentItems());
        }
    }, [isModalOpen, parentItems.length, parentItemsLoading, dispatch]);

    // Category options for the dropdown
    const categoryOptions = useMemo(() => {
        // Get existing categories from master data list
        const existingCategories = [...new Set(masterDataList.map((item) => item.category))];

        // Merge with common categories and remove duplicates
        const allCategories = [...new Set([...COMMON_CATEGORIES.map(c => c.value), ...existingCategories])];

        return allCategories.sort().map((cat) => {
            const predefined = COMMON_CATEGORIES.find((c) => c.value === cat);
            return {
                value: cat,
                label: predefined ? predefined.label : cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            };
        });
    }, [masterDataList]);

    // Parent options - filter out current item if editing
    const parentOptions = useMemo(() => {
        let options = parentItems;

        // If editing, exclude current item and its children from parent options
        if (isEditMode && formData.id) {
            options = options.filter((item) => String(item.id) !== String(formData.id));
        }

        // Filter by same category if one is selected
        if (formData.category) {
            options = options.filter((item) => item.category === formData.category);
        }

        return options.map((item) => ({
            value: item.id,
            label: `${item.value} (${item.category.replace(/_/g, " ")})`,
        }));
    }, [parentItems, isEditMode, formData.id, formData.category]);

    const handleClose = () => {
        if (!isLoading) {
            dispatch(closeModal());
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFormData({ field: name, value }));

        // Auto-generate key from value if key is empty
        if (name === "value" && !formData.key) {
            const generatedKey = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "_");
            dispatch(setFormData({ field: "key", value: generatedKey }));
        }
    };

    const handleCategoryChange = (value) => {
        dispatch(setFormData({ field: "category", value: value || "" }));
        // Reset parent when category changes
        dispatch(setFormData({ field: "parentId", value: "" }));
    };

    const handleParentChange = (value) => {
        dispatch(setFormData({ field: "parentId", value: value || "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.category?.trim()) {
            return;
        }
        if (!formData.value?.trim()) {
            return;
        }

        if (isEditMode) {
            dispatch(updateMasterData(formData));
        } else {
            dispatch(createMasterData(formData));
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
                className="sm:max-w-[500px] overflow-visible"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Master Data" : "Add New Master Data"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Update the master data entry below."
                                : "Fill in the details to create a new master data entry."}
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
                            <Label htmlFor="category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <SearchableSelect
                                options={categoryOptions}
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                                placeholder="Select or type a category..."
                                searchPlaceholder="Search categories..."
                                emptyText="No categories found. Type to create new."
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Select an existing category or type a new one (use snake_case).
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="value">
                                    Value <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="value"
                                    name="value"
                                    placeholder="e.g., Full Time"
                                    value={formData.value}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Display value for the dropdown.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="key">Key</Label>
                                <Input
                                    id="key"
                                    name="key"
                                    placeholder="e.g., full_time"
                                    value={formData.key}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Machine-readable identifier.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="label">Label (Optional)</Label>
                            <Input
                                id="label"
                                name="label"
                                placeholder="e.g., Full-Time Employment"
                                value={formData.label}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Alternative display text. Defaults to value if not provided.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="parentId">Parent (Optional)</Label>
                                <SearchableSelect
                                    options={parentOptions}
                                    value={formData.parentId}
                                    onValueChange={handleParentChange}
                                    placeholder="Select a parent..."
                                    searchPlaceholder="Search parents..."
                                    emptyText={formData.category ? "No parents available." : "Select a category first."}
                                    disabled={isLoading || parentItemsLoading || !formData.category}
                                />
                                <p className="text-xs text-muted-foreground">
                                    For hierarchical data (e.g., caste under religion).
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Input
                                    id="sortOrder"
                                    name="sortOrder"
                                    type="number"
                                    placeholder="0"
                                    value={formData.sortOrder}
                                    onChange={(e) =>
                                        dispatch(setFormData({ field: "sortOrder", value: parseInt(e.target.value, 10) || 0 }))
                                    }
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Display order in dropdowns.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    dispatch(setFormData({ field: "isActive", value: e.target.checked }))
                                }
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
                            disabled={isLoading || !formData.category?.trim() || !formData.value?.trim()}
                            className="gap-2"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isEditMode
                                ? updating
                                    ? "Saving..."
                                    : "Save Changes"
                                : creating
                                    ? "Creating..."
                                    : "Create Entry"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
