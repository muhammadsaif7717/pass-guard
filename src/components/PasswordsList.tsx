"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import getPasswords from "@/lib/getPasswords";
import { useQuery } from "@tanstack/react-query";
import { PasswordsData } from "@/types";

const loadPasswordsData = async () => {
  const data = await getPasswords();
  return data;
};

const PasswordsList = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery<PasswordsData[]>({
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

  const handleClick = (name: string) => {
    router.push(`/passwords/${name.toLowerCase()}`);
  };

  // Remove duplicates by name
  const uniquePasswords = Array.from(
    new Map(
      fetchedPasswordsData.map((item) => [item.name.toLowerCase(), item])
    ).values()
  );

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-4 shadow-lg md:p-5 lg:p-6 dark:border-[2px] dark:bg-zinc-900">
      <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Saved Passwords
      </h2>
      <Table>
        <TableBody>
          {uniquePasswords.map((item) => (
            <TableRow
              onClick={() => handleClick(item.name)}
              key={item._id}
              className="cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <TableCell className="font-semibold text-gray-800 capitalize dark:text-gray-200">
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
