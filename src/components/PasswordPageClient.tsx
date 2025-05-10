"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import getPasswords from "@/lib/getPasswords";
import { useQuery } from "@tanstack/react-query";

type FetchedPasswordsData = {
  _id: number;
  website: string;
  name: string;
  username: string;
  password: string;
  note?: string;
};

const loadPasswordsData = async () => {
  const data = await getPasswords();
  return data;
};
//   {
//     _id: 111,
//     website: "www.facebook.com",
//     name: "Facebook",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
//   {
//     _id: 222,
//     website: "www.google.com",
//     name: "Google",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
//   {
//     _id: 333,
//     website: "www.twitter.com",
//     name: "Twitter",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
//   {
//     _id: 444,
//     website: "www.facebook.com",
//     name: "Facebook",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
//   {
//     _id: 555,
//     website: "www.google.com",
//     name: "Google",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
//   {
//     _id: 666,
//     website: "www.twitter.com",
//     name: "Twitter",
//     username: "muhammadsaif7717",
//     password: "password12345",
//     note: "",
//   },
// ];

export default function PasswordPageClient({ name }: { name: string }) {
  const [visible, setVisible] = useState<Record<number, boolean>>({});

  const { data, isLoading } = useQuery<FetchedPasswordsData[]>({
    queryKey: ["passwords"],
    queryFn: loadPasswordsData,
  });
  const fetchedPasswordsData = data ?? [];

  if (isLoading) {
    return (
      <div className="text-center text-blue-500 font-medium mt-10">
        Loading...
      </div>
    );
  }

  const toggleVisibility = (id: number) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  };

  const facebookPasswords = fetchedPasswordsData.filter(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (facebookPasswords.length === 0) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">
        No Facebook password data found.
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
          <Lock className="w-6 h-6" />
          Facebook Passwords
        </h2>

        {facebookPasswords.map((item) => (
          <Card
            key={item._id}
            className="p-6 space-y-4 mb-6 bg-muted dark:bg-zinc-900 text-muted-foreground dark:text-zinc-300 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={item.username}
                  readOnly
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Site: </label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={visible[item._id] ? "text" : "password"}
                    value={item.password}
                    readOnly
                    className="pr-20 bg-background text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item._id)}
                    className="absolute right-10 top-2.5 text-muted-foreground"
                  >
                    {visible[item._id] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.password)}
                    className="absolute right-2 top-2.5 text-muted-foreground"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Note</label>
                <Input
                  placeholder={item.note || "No note available"}
                  readOnly
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <Button variant="outline" className="w-1/4">
                Edit
              </Button>
              <Button variant="destructive" className="w-1/4">
                Delete
              </Button>
              <Button variant="secondary" className="w-1/4">
                Share
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
