"use client";
import { useUser } from "@/app/context/user";
import AdminNav from "./AdminNav";

export default function AdminNavWrapper() {
  const { user } = useUser();

   if (user?.role !== "ADMIN") return null;

  return <AdminNav />;
}