"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Calendar, Shield, Key, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import graphqlService from "@/services/graphqlService";
import { GET_USER_WITH_STATUS_HISTORY } from "@/graphql/queries/users";
import BreadcrumbComponent from "@/components/breadcrumb";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
    const currentUser = useSelector((state) => state.auth.user);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!currentUser?.id) return;

            try {
                setLoading(true);
                const data = await graphqlService.query(GET_USER_WITH_STATUS_HISTORY, {
                    id: currentUser.id.toString(),
                });
                setProfileData(data.userWithStatusHistory);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser?.id]);

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

    if (loading) {
        return (
            <div className="flex flex-col h-screen">
                <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                            <span className="text-muted-foreground">Loading your profile…</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex flex-col h-screen">
                <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <p className="text-muted-foreground">Unable to load profile data</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto p-6 max-w-5xl">
                    {/* Breadcrumb */}
                    <BreadcrumbComponent />

                    {/* Profile Card */}
                    <Card className="mt-4">
                        <CardHeader className="border-b">
                            <div className="flex items-start gap-4">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/80 to-primary text-white flex items-center justify-center text-3xl font-semibold">
                                    {profileData.name?.charAt(0)?.toUpperCase()}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-semibold tracking-tight">
                                            {profileData.name}
                                        </h1>
                                        <Badge
                                            variant={getStatusBadgeVariant(profileData.status)}
                                            className="capitalize"
                                        >
                                            {profileData.status}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                        <Mail className="h-4 w-4" />
                                        {profileData.email}
                                    </p>

                                    <p className="text-xs text-muted-foreground mt-1">
                                        User ID: {profileData.id}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-8">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border p-4 bg-muted/40">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Member Since
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        {formatDate(profileData.created_at)}
                                    </p>
                                </div>

                                <div className="rounded-xl border p-4 bg-muted/40">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Last Updated
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        {formatDate(profileData.updated_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Roles */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Roles
                                </h3>

                                {profileData.roles?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.roles.map(role => (
                                            <Badge key={role.id} variant="default" className="px-3 py-1">
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No roles assigned</p>
                                )}
                            </div>

                            <Separator />

                            {/* Permissions */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Additional Permissions
                                </h3>

                                {profileData.additional_permissions?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.additional_permissions.map(perm => (
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

                            <Separator />

                            {/* Timeline */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Status Timeline
                                </h3>

                                {profileData.statuses?.length ? (
                                    <div className="space-y-4 relative pl-6">
                                        <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

                                        {profileData.statuses.map((entry, index) => (
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
