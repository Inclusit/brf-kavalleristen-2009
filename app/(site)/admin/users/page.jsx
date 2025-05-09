"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";

const addressOptions = [
  "Kavallerigatan 1",
  "Kavallerigatan 3",
  "Kavallerigatan 5",
  "Kavallerigatan 7",
  "Kavallerigatan 9",
  "Kavallerigatan 11",
];

export default function AdminUserPanel() {
  const { user } = useUser();
  const role = user?.role;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = LocalStorageKit.get("@library/token");
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    if (role === "ADMIN") fetchUsers();
  }, [role]);

  const handleChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, [field]: value } : user))
    );
  };

  const handleSave = async (user) => {
    const token = LocalStorageKit.get("@library/token");
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
  };

  const handleDelete = async (id) => {
    const token = LocalStorageKit.get("@library/token");
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setUsers(users.filter((user) => user.id !== id));
    if(!confirm("är du säker på att du vill ta bort denna användare?")) return;
    setConfirmDelete(null);
  };

  if (role !== "ADMIN") return <p>Du har inte behörighet att se denna sida.</p>;
  if (loading) return <SkeletonLoader count={5} />;
  if (!users.length) return <p>Inga användare hittades.</p>;

  return (
    <div className="admin-user-panel">
      <h2>Användare</h2>
      {users.map((user) => (
        <div key={user.id} className="admin-user-panel__card">
          <label>Förnamn</label>
          <input
            value={user.firstName || ""}
            onChange={(e) => handleChange(user.id, "firstName", e.target.value)}
          />

          <label>Efternamn</label>
          <input
            value={user.lastName || ""}
            onChange={(e) => handleChange(user.id, "lastName", e.target.value)}
          />

          <label>E-post</label>
          <input
            value={user.email || ""}
            onChange={(e) => handleChange(user.id, "email", e.target.value)}
          />

          <label>Telefon</label>
          <input
            value={user.phone || ""}
            onChange={(e) => handleChange(user.id, "phone", e.target.value)}
          />

          <label>Adress</label>
          <select
            value={user.address || ""}
            onChange={(e) => handleChange(user.id, "address", e.target.value)}
          >
            {addressOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label>Roll</label>
          <select
            value={user.role}
            onChange={(e) => handleChange(user.id, "role", e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="MODERATOR">MODERATOR</option>
          </select>

          <div className="admin-user-panel__actions">
            <button onClick={() => handleSave(user)}>Spara</button>
            {confirmDelete === user.id ? (
              <>
                <button onClick={() => handleDelete(user.id)}>
                  Bekräfta radering
                </button>
                <button onClick={() => setConfirmDelete(null)}>Avbryt</button>
              </>
            ) : (
              <button onClick={() => setConfirmDelete(user.id)}>Radera</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
