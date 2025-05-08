"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

type FetchedPasswordsData = {
  _id: number;
  website: string;
  name: string;
  username: string;
  password: string;
  note?: string;
};

const fetchedPasswordsData: FetchedPasswordsData[] = [
  { _id: 111, website: "www.facebook.com", name: "Facebook", username: "muhammadsaif7717", password: "password12345", note: "" },
  { _id: 222, website: "www.google.com", name: "Google", username: "muhammadsaif7717", password: "password12345", note: "" },
  { _id: 333, website: "www.twitter.com", name: "Twitter", username: "muhammadsaif7717", password: "password12345", note: "" },
  { _id: 444, website: "www.facebook.com", name: "Facebook", username: "muhammadsaif7717", password: "password12345", note: "" },
  { _id: 555, website: "www.google.com", name: "Google", username: "muhammadsaif7717", password: "password12345", note: "" },
  { _id: 666, website: "www.twitter.com", name: "Twitter", username: "muhammadsaif7717", password: "password12345", note: "" },
];

const PasswordsList = () => {
  const router = useRouter();

  const handleClick = (name: string) => {
    router.push(`/passwords/${name.toLowerCase()}`);
  };

  // Remove duplicates by name
  const uniquePasswords = Array.from(
    new Map(fetchedPasswordsData.map((item) => [item.name.toLowerCase(), item])).values()
  );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-5 lg:p-6 bg-white dark:border-[2px] dark:bg-zinc-900 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
        Saved Passwords
      </h2>
      <Table>
        <TableBody>
          {uniquePasswords.map((item) => (
            <TableRow
              onClick={() => handleClick(item.name)}
              key={item._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <TableCell className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {item.name}
              </TableCell>
              <TableCell className="text-gray-800 dark:text-gray-200">
                {item.website}
              </TableCell>
              <TableCell className="text-right">
                <ChevronRight className="text-gray-500 dark:text-gray-300" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PasswordsList;
