"use client";

import { toast } from "sonner";

export const showToast = ({
  title,
  description,
}: {
  title: string;
  description?: string;

}) => {
  toast(title, {
    description,
  });
};
