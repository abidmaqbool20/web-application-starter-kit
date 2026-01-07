"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SearchableSelect({
    options = [],
    value,
    onValueChange,
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    disabled = false,
    className,
}) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false)
                setSearch("")
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open])

    // Focus input when dropdown opens
    React.useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open])

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return options
        const lowerSearch = search.toLowerCase()
        return options.filter((opt) =>
            String(opt.label).toLowerCase().includes(lowerSearch)
        )
    }, [options, search])

    const selectedOption = options.find(
        (opt) => String(opt.value) === String(value)
    )

    const handleSelect = (option) => {
        onValueChange(String(option.value) === String(value) ? "" : option.value)
        setOpen(false)
        setSearch("")
    }

    const handleToggle = () => {
        if (!disabled) {
            setOpen(!open)
            if (!open) {
                setSearch("")
            }
        }
    }

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between font-normal"
                disabled={disabled}
                onClick={handleToggle}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    {/* Search input */}
                    <div className="flex items-center gap-2 border-b px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 opacity-50" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            autoComplete="off"
                        />
                    </div>

                    {/* Options list */}
                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {emptyText}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                        String(value) === String(option.value) &&
                                        "bg-accent text-accent-foreground"
                                    )}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            String(value) === String(option.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
