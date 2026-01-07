"use client";

import * as React from "react";
import { Check, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PermissionTree({
    permissions = [],
    selectedPermissions = [],
    onSelectionChange,
    disabled = false,
}) {
    const [expandedNodes, setExpandedNodes] = React.useState(new Set());

    // Build tree structure from flat permissions list
    const permissionTree = React.useMemo(() => {
        const tree = [];
        const map = new Map();

        // First pass: create nodes
        permissions.forEach(permission => {
            map.set(permission.id, {
                ...permission,
                children: [],
            });
        });

        // Second pass: build tree
        permissions.forEach(permission => {
            const node = map.get(permission.id);
            if (permission.parent_id) {
                const parent = map.get(permission.parent_id);
                if (parent) {
                    parent.children.push(node);
                } else {
                    tree.push(node);
                }
            } else {
                tree.push(node);
            }
        });

        return tree;
    }, [permissions]);

    const toggleExpanded = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const handleCheckboxChange = (permissionId, checked) => {
        let newSelection = [...selectedPermissions];

        if (checked) {
            // Add permission if not already selected
            if (!newSelection.includes(permissionId)) {
                newSelection.push(permissionId);
            }
            // Add all children recursively
            const node = permissions.find(p => p.id === permissionId);
            if (node) {
                const addChildren = (parentId) => {
                    const children = permissions.filter(p => p.parent_id === parentId);
                    children.forEach(child => {
                        if (!newSelection.includes(child.id)) {
                            newSelection.push(child.id);
                        }
                        addChildren(child.id);
                    });
                };
                addChildren(permissionId);
            }
        } else {
            // Remove permission
            newSelection = newSelection.filter(id => id !== permissionId);
            // Remove all children recursively
            const removeChildren = (parentId) => {
                const children = permissions.filter(p => p.parent_id === parentId);
                children.forEach(child => {
                    newSelection = newSelection.filter(id => id !== child.id);
                    removeChildren(child.id);
                });
            };
            removeChildren(permissionId);
        }

        onSelectionChange(newSelection);
    };

    const isChecked = (permissionId) => {
        return selectedPermissions.includes(permissionId);
    };

    const isIndeterminate = (node) => {
        if (node.children.length === 0) return false;

        const checkedChildren = node.children.filter(child => isChecked(child.id));
        return checkedChildren.length > 0 && checkedChildren.length < node.children.length;
    };

    const renderNode = (node, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const checked = isChecked(node.id);
        const indeterminate = isIndeterminate(node);

        return (
            <div key={node.id} className="select-none">
                <div
                    className={cn(
                        "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-accent",
                        level > 0 && "ml-6"
                    )}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            onClick={() => toggleExpanded(node.id)}
                            className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={disabled}
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    ) : (
                        <div className="h-4 w-4 shrink-0" />
                    )}

                    <div className="flex items-center gap-2 flex-1">
                        <Checkbox
                            id={`permission-${node.id}`}
                            checked={checked}
                            onCheckedChange={(checked) => handleCheckboxChange(node.id, checked)}
                            disabled={disabled}
                            className={cn(indeterminate && "data-[state=checked]:bg-primary/50")}
                        />
                        <Label
                            htmlFor={`permission-${node.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                        >
                            {node.name}
                        </Label>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="ml-4">
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (permissions.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground">
                No permissions available
            </div>
        );
    }

    return (
        <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
            {permissionTree.map(node => renderNode(node))}
        </div>
    );
}
