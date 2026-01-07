"use client";

import { useDispatch, useSelector } from "react-redux";
import { setModalOpen, setEditingPermission } from "@/slices/permissionsSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import graphqlService from "@/services/graphqlService";
import { GET_PERMISSIONS } from "@/graphql/queries/permissions";
import { CREATE_PERMISSION } from "@/graphql/mutations/permissions";

export default function PermissionsModal() {
    const dispatch = useDispatch();
    const modalOpen = useSelector((state) => state.permissions.modalOpen);
    const editingPermission = useSelector((state) => state.permissions.editingPermission);

    const [form, setForm] = useState({
        name: editingPermission?.name || "",
        key: editingPermission?.key || "",
        parent_id: editingPermission?.parent_id || "",
    });
    const [allPermissions, setAllPermissions] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        graphqlService.query(GET_PERMISSIONS).then(data => {
            setAllPermissions(data.permissions || []);
        });
    }, []);

    useEffect(() => {
        setForm({
            name: editingPermission?.name || "",
            key: editingPermission?.key || "",
            parent_id: editingPermission?.parent_id || "",
        });
    }, [editingPermission]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await graphqlService.mutate(CREATE_PERMISSION, { input: form });
            handleClose();
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        dispatch(setModalOpen(false));
        dispatch(setEditingPermission(null));
    };

    return (
        <Dialog open={modalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingPermission ? "Edit Permission" : "Add Permission"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Permission Name"
                    />
                    <Input
                        label="Key"
                        name="key"
                        value={form.key}
                        onChange={handleChange}
                        required
                        placeholder="Unique Key (e.g. user-create)"
                    />
                    <select
                        name="parent_id"
                        value={form.parent_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">No Parent (Module Level)</option>
                        {allPermissions.filter(p => !p.parent_id).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
