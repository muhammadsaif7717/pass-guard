"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import getPasswords from "@/lib/getPasswords";
import { useQuery } from "@tanstack/react-query";
import { PasswordsData } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";
import getURL from "@/lib/getURL";
import axios from "axios";

const loadPasswordsData = async () => {
  const data = await getPasswords();
  return data;
};

export default function PasswordPageClient({ name }: { name: string }) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editableData, setEditableData] = useState<PasswordsData | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery<PasswordsData[]>({
    queryKey: ["passwords"],
    queryFn: loadPasswordsData,
  });

  const fetchedPasswordsData = data ?? [];

  if (isLoading) {
    return (
      <div className="mt-10 text-center font-medium text-blue-500">
        Loading...
      </div>
    );
  }

  const toggleVisibility = (id: string) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password);
    showToast({
      title: "✅ Copied to clipboard",
      description: "Password has been copied successfully.",
    });
  };

  const filteredPassData = fetchedPasswordsData.filter(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableData) return;

    const EditedData = {
      username: editableData.username,
      password: editableData.password,
      note: editableData.note,
    };

    const id = editableData._id;
    const url = await getURL();
    console.log(url);

    try {
      const response = await axios.put(
        `${url}/passwords/update/${id}`,
        EditedData
      );

      if (!response.data) {
        throw new Error("Failed to update password");
      }

      showToast({
        title: "✅ Password updated successfully",
        description: "Your password has been updated.",
      });

      setIsDialogOpen(false);
      await refetch();
    } catch (err) {
      showToast({
        title: err instanceof Error ? err.message : "Error",
        description: "Failed to update password.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const url = await getURL();
    try {
      const response = await axios.delete(
        `${url}/passwords/delete/${deleteId}`
      );
      if (!response.data) {
        throw new Error("Failed to delete password");
      }

      showToast({
        title: "✅ Password deleted successfully",
        description: "Your password has been deleted.",
      });

      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      await refetch();
    } catch (err) {
      showToast({
        title: err instanceof Error ? err.message : "Error",
        description: "Failed to delete password.",
      });
    }
  };

  if (filteredPassData.length === 0) {
    return (
      <div className="mt-10 text-center font-medium text-red-500">
        No password data found.
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-xl p-6">
        <h2 className="text-foreground mb-6 flex items-center gap-2 text-2xl font-bold">
          <Lock className="h-6 w-6" />
          <span className="capitalize">{name}</span> Passwords
        </h2>

        {filteredPassData.map((item) => (
          <Card
            key={item._id}
            className="bg-muted text-muted-foreground mb-6 space-y-4 rounded-xl p-6 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Username</Label>
                <Input
                  value={item.username}
                  readOnly
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Site </Label>
                <a
                  href={`https://${item.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 hover:underline dark:text-blue-400"
                >
                  {item.website}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={visible[item._id as string] ? "text" : "password"}
                    value={item.password}
                    readOnly
                    className="bg-background text-foreground pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item._id as string)}
                    className="text-muted-foreground absolute top-2.5 right-10"
                  >
                    {visible[item._id as string] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.password)}
                    className="text-muted-foreground absolute top-2.5 right-2"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Note</Label>
                <Input
                  placeholder={item.note || "No note available"}
                  readOnly
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <Button
                variant="outline"
                className="w-1/4"
                onClick={() => {
                  setEditableData(item);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>

              <Button
                onClick={() => {
                  setDeleteId(item._id as string);
                  setIsDeleteDialogOpen(true);
                }}
                variant="destructive"
                className="w-1/4"
              >
                Delete
              </Button>
              <Button variant="secondary" className="w-1/4">
                Share
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Update your password details below.
            </DialogDescription>
          </DialogHeader>

          {editableData && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editableData.username}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={editableData.password}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Input
                  id="note"
                  value={editableData.note}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      note: e.target.value,
                    })
                  }
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this password? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
