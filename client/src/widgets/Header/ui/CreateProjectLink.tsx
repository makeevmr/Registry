"use client";
import { useAuthQuery } from "@/entities/User";
import Link from "next/link";
import { FC } from "react";

// Renders the "Создать проект" nav entry only for employers.
const CreateProjectLink: FC = () => {
  const { data } = useAuthQuery();

  if (data?.userType !== "employer") return null;

  return (
    <li className="mr-4">
      <Link href="/create-project">Создать проект</Link>
    </li>
  );
};

export default CreateProjectLink;
