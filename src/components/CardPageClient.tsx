"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { CardsData } from "@/types";
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
import getCards from "@/lib/getCards";

const loadCardsData = async (): Promise<CardsData[]> => {
  const res = await getCards();
  return res;
};

export default function CardPageClient({ name }: { name: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editableData, setEditableData] = useState<CardsData | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery<CardsData[]>({
    queryKey: ["cards"],
    queryFn: loadCardsData,
  });

  const fetchedPasswordsData = data ?? [];

  if (isLoading) {
    return (
      <div className="mt-10 text-center font-medium text-blue-600 dark:text-blue-400">
        Loading...
      </div>
    );
  }

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

    const updatedCardData = {
      cardNumber: editableData.cardNumber,
      expiry: editableData.expiry,
      cvv: editableData.cvv,
      note: editableData.note,
    };

    try {
      const url = await getURL();
      const response = await axios.put(
        `${url}/cards/update/${editableData._id}`,
        updatedCardData
      );

      if (!response.data) {
        throw new Error("Failed to update card");
      }

      showToast({
        title: "✅ Card updated successfully",
        description: "Your card has been updated.",
      });

      setIsDialogOpen(false);
      await refetch(); // Refresh the data after update
    } catch (err) {
      showToast({
        title: err instanceof Error ? err.message : "Error",
        description: "Failed to update card.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const url = await getURL();
    try {
      const response = await axios.delete(`${url}/cards/delete/${deleteId}`);
      if (!response.data) throw new Error("Failed to delete card");

      showToast({
        title: "✅ Card deleted successfully",
        description: "Your card has been deleted.",
      });

      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      await refetch();
    } catch (err) {
      showToast({
        title: err instanceof Error ? err.message : "Error",
        description: "Failed to delete card.",
      });
    }
  };

  if (filteredPassData.length === 0) {
    return (
      <div className="mt-10 text-center font-medium text-red-600 dark:text-red-400">
        No password data found.
      </div>
    );
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-10 dark:bg-gray-900">
      {filteredPassData.map((card) => (
        <div
          key={card._id}
          className="w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {card.name}
          </h2>
          <p className="truncate text-gray-700 dark:text-gray-300">
            <span className="font-medium">Card Number:</span> {card.cardNumber}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(card.cardNumber)}
              className="ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Copy size={16} />
            </Button>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Expiry:</span> {card.expiry}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">CVV:</span> {card.cvv}
          </p>
          {card.note && (
            <p className="truncate text-gray-700 dark:text-gray-300">
              <span className="font-medium">Note:</span> {card.note}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Added on: {new Date(card.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditableData(card);
                setIsDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleteId(card._id as string);
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>
              Update your card details below.
            </DialogDescription>
          </DialogHeader>

          {editableData && (
            <form onSubmit={handleEdit} className="space-y-5">
              <div>
                <Label htmlFor="cardNumber" className="dark:text-gray-200">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  value={editableData.cardNumber}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      cardNumber: e.target.value,
                    })
                  }
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="expiry" className="dark:text-gray-200">
                  Expiry
                </Label>
                <Input
                  id="expiry"
                  value={editableData.expiry}
                  onChange={(e) =>
                    setEditableData({ ...editableData, expiry: e.target.value })
                  }
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="dark:text-gray-200">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  value={editableData.cvv}
                  onChange={(e) =>
                    setEditableData({ ...editableData, cvv: e.target.value })
                  }
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="note" className="dark:text-gray-200">
                  Note
                </Label>
                <Input
                  id="note"
                  value={editableData.note || ""}
                  onChange={(e) =>
                    setEditableData({ ...editableData, note: e.target.value })
                  }
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this password? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
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
