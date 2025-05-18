"use client";
import PasswordsList from "@/components/PasswordsList";
import React from "react";

export default function PasswordsPage() {
  return (
    <div className="flex h-screen justify-center">
      <div className="w-full p-4 md:w-7/12 lg:w-5/12">
        <PasswordsList />
      </div>
    </div>
  );
}
