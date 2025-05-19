"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { CardsData, PasswordsData } from "@/types";
import axios from "axios";
import getURL from "@/lib/getURL";
import { showToast } from "@/lib/toast";

export default function PostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [newPassword, setNewPassword] = useState<PasswordsData>({
    user: {
      email: user?.emailAddresses[0]?.emailAddress || "",
      username: user?.username || "",
    },
    createdAt: new Date().toISOString(),
    website: "",
    name: "",
    username: "",
    password: "",
    note: "",
  });

  const [newCard, setNewCard] = useState<CardsData>({
    user: {
      email: user?.emailAddresses[0]?.emailAddress || "",
      username: user?.username || "",
    },
    createdAt: new Date().toISOString(),
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    note: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to view this page</div>;

  // === Handle Password Submit ===
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await getURL();

    try {
      await axios.post(`${url}/passwords/post`, newPassword);
      showToast({
        title: "Password Saved Successfully",
        description: "Your password has been stored securely.",
      });
    } catch (error) {
      console.error("Error saving password:", error);
      showToast({
        title: "Error Saving Password",
        description: "Please try again.",
      });
    }

    setNewPassword({
      user: { email: "", username: "" },
      createdAt: "",
      website: "",
      name: "",
      username: "",
      password: "",
      note: "",
    });
  };

  // === Handle Card Submit ===
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await getURL();

    try {
      await axios.post(`${url}/cards/post`, newCard);
      showToast({
        title: "Card Saved Successfully",
        description: "Your card info has been stored securely.",
      });
    } catch (error) {
      console.error("Error saving card:", error);
      showToast({
        title: "Error Saving Card",
        description: "Please try again.",
      });
    }

    setNewCard({
      user: { email: "", username: "" },
      createdAt: "",
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      note: "",
    });
  };

  return (
    <div className="space-y-10 p-6">
      {/* Password Form */}
      <Card className="mx-auto max-w-xl shadow-md">
        <CardHeader>
          <CardTitle>Add New Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              placeholder="Website (e.g. https://gmail.com)"
              value={newPassword.website}
              onChange={(e) =>
                setNewPassword({ ...newPassword, website: e.target.value })
              }
              required
            />
            <Input
              placeholder="Name (e.g. Gmail Account)"
              value={newPassword.name}
              onChange={(e) =>
                setNewPassword({ ...newPassword, name: e.target.value })
              }
              required
            />
            <Input
              placeholder="Username"
              value={newPassword.username}
              onChange={(e) =>
                setNewPassword({ ...newPassword, username: e.target.value })
              }
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newPassword.password}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <Textarea
              placeholder="Note (optional)"
              value={newPassword.note}
              onChange={(e) =>
                setNewPassword({ ...newPassword, note: e.target.value })
              }
            />
            <Button type="submit" className="w-full">
              Save Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Card Form */}
      <Card className="mx-auto max-w-xl shadow-md">
        <CardHeader>
          <CardTitle>Add New Credit Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <Input
              placeholder="Cardholder Name"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              required
            />
            <Input
              placeholder="Card Number"
              value={newCard.cardNumber}
              onChange={(e) =>
                setNewCard({ ...newCard, cardNumber: e.target.value })
              }
              required
            />
            <div className="flex gap-4">
              <Input
                placeholder="MM/YY"
                value={newCard.expiry}
                onChange={(e) =>
                  setNewCard({ ...newCard, expiry: e.target.value })
                }
                required
              />
              <Input
                placeholder="CVV"
                value={newCard.cvv}
                onChange={(e) =>
                  setNewCard({ ...newCard, cvv: e.target.value })
                }
                required
              />
            </div>
            <Textarea
              placeholder="Note (optional)"
              value={newCard.note}
              onChange={(e) => setNewCard({ ...newCard, note: e.target.value })}
            />
            <Button type="submit" className="w-full">
              Save Card
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
