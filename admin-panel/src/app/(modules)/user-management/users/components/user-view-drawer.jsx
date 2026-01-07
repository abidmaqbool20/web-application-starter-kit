"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Calendar, Shield, Key, Clock } from "lucide-react";
import { closeViewDrawer } from "@/slices/usersSlice";
import { formatDistanceToNow } from "date-fns";

export default function UserViewDrawer() {
    const dispatch = useDispatch();
    const { isViewDrawerOpen, viewUser, loadingView } = useSelector(
        (state) => state.users
    );

    const handleClose = () => {
        dispatch(closeViewDrawer());
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "active":
                return "default";
            case "inactive":
                return "secondary";
            case "suspended":
                return "outline";
            case "banned":
                return "destructive";
            default:
                return "default";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Sheet open={isViewDrawerOpen} onOpenChange={handleClose}>
            <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-background px-6 py-6">
                {loadingView ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <span className="text-muted-foreground">Loading user profile…</span>
                    </div>
                ) : viewUser ? (
                    <div className="space-y-8 pb-10">

                        {/* ================= HEADER ================= */}
                        <div className="flex items-start gap-4 border-b pb-6">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/80 to-primary text-white flex items-center justify-center text-xl font-semibold">
                                {viewUser.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        {viewUser.name}
                                    </h2>
                                    <Badge
                                        variant={getStatusBadgeVariant(viewUser.status)}
                                        className="capitalize"
                                    >
                                        {viewUser.status}
                                    </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {viewUser.email}
                                </p>

                                <p className="text-xs text-muted-foreground mt-1">
                                    User ID: {viewUser.id}
                                </p>
                            </div>
                        </div>

                        {/* ================= STATS ================= */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border p-4 bg-muted/40">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Member Since
                                </p>
                                <p className="text-sm font-medium mt-1">
                                    {formatDate(viewUser.created_at)}
                                </p>
                            </div>

                            <div className="rounded-xl border p-4 bg-muted/40">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Last Updated
                                </p>
                                <p className="text-sm font-medium mt-1">
                                    {formatDate(viewUser.updated_at)}
                                </p>
                            </div>
                        </div>

                        {/* ================= ROLES ================= */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Roles
                            </h3>

                            {viewUser.roles?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {viewUser.roles.map(role => (
                                        <Badge key={role.id} variant="default" className="px-3 py-1">
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No roles assigned</p>
                            )}
                        </div>

                        {/* ================= PERMISSIONS ================= */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Additional Permissions
                            </h3>

                            {viewUser.additional_permissions?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {viewUser.additional_permissions.map(perm => (
                                        <Badge
                                            key={perm.id}
                                            variant="secondary"
                                            className="gap-1 px-3 py-1"
                                        >
                                            <Key className="h-3 w-3" />
                                            {perm.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No additional permissions
                                </p>
                            )}
                        </div>

                        {/* ================= TIMELINE ================= */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Status Timeline
                            </h3>

                            {viewUser.statuses?.length ? (
                                <div className="space-y-4 relative pl-6">
                                    <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

                                    {viewUser.statuses.map((entry, index) => (
                                        <div key={entry.id} className="relative">
                                            <div
                                                className={`absolute -left-[1.45rem] top-2 h-3 w-3 rounded-full border-2 ${index === 0
                                                    ? "bg-primary border-primary"
                                                    : "bg-background border-border"
                                                    }`}
                                            />

                                            <div className="rounded-xl border p-4 bg-muted/40 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <Badge
                                                        variant={getStatusBadgeVariant(entry.status)}
                                                        className="capitalize"
                                                    >
                                                        {entry.status}
                                                    </Badge>

                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(
                                                            new Date(entry.created_at),
                                                            { addSuffix: true }
                                                        )}
                                                    </span>
                                                </div>

                                                {entry.note && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {entry.note}
                                                    </p>
                                                )}

                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(entry.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No status history available
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-muted-foreground">No user data available</p>
                    </div>
                )}
            </SheetContent>

        </Sheet>
    );
}
