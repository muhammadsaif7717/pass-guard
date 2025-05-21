import { use } from "react";
import CardPageClient from "@/components/CardPageClient";

export default function CardPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  return <CardPageClient name={name} />;
}
