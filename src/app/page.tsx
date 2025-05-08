"use client";

import { useSession } from "@clerk/nextjs";

export default function Home() {
  const data = useSession();
  console.log(data.session?.user);
  return <div>
  </div>;
}
