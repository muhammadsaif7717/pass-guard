import { use } from "react";
import PasswordPageClient from "@/components/PasswordPageClient";

export default function PasswordPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  return <PasswordPageClient name={name} />;
}
