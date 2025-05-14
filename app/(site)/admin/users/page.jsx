"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import CTAbtn from "@/app/components/ui/CTAbtn";
import { addressData } from "@/app/components/data/addressData";

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
    if (!confirm("är du säker på att du vill ta bort denna användare?")) return;
    setConfirmDelete(null);
  };

  if (role !== "ADMIN") return <p>Du har inte behörighet att se denna sida.</p>;
  if (loading)
    return (
      <div aria-busy={loading} aria-live="polite">
        <SkeletonLoader count={7} />;
      </div>
    );
  if (!users.length) return <p>Inga användare hittades.</p>;

  return (
    <fieldset className="admin-user-panel">
      <legend>Användare</legend>
      {users.map((user) => (
        <div key={user.id} className="admin-user-panel__card">
          <label htmlFor={`firstName-${user.id}`}>Förnamn</label>
          <input
            id={`firstName-${user.id}`}
            value={user.firstName || ""}
            onChange={(e) => handleChange(user.id, "firstName", e.target.value)}
          />

          <label htmlFor={`lastName-${user.id}`}>Efternamn</label>
          <input
            id={`lastName-${user.id}`}
            value={user.lastName || ""}
            onChange={(e) => handleChange(user.id, "lastName", e.target.value)}
          />

          <label htmlFor={`email-${user.id}`}>E-post</label>
          <input
            type="email"
            id={`email-${user.id}`}
            value={user.email || ""}
            onChange={(e) => handleChange(user.id, "email", e.target.value)}
          />

          <label htmlFor={`phone-${user.id}`}>Telefon</label>
          <input
            type="tel"
            id={`phone-${user.id}`}
            value={user.phone || ""}
            onChange={(e) => handleChange(user.id, "phone", e.target.value)}
          />

          <label htmlFor={`address-${user.id}`}>Adress</label>
          <select
            id={`address-${user.id}`}
            value={user.address || ""}
            onChange={(e) => handleChange(user.id, "address", e.target.value)}
          >
            {addressData.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <label htmlFor={`role-${user.id}`}>Roll</label>
          <select
            id={`role-${user.id}`}
            value={user.role}
            onChange={(e) => handleChange(user.id, "role", e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="MODERATOR">MODERATOR</option>
          </select>

          <div className="admin-user-panel__actions">
            <CTAbtn
              type="save"
              onClick={() => handleSave(user)}
              role={role}
              ariaLabel={`Spara ändringar för ${user.firstName} ${user.lastName}`}
            />

            {confirmDelete === user.id ? (
              <>
                <CTAbtn
                  type="delete"
                  onClick={() => handleDelete(user.id)}
                  role={role}
                  confirmMessage={`Är du säker på att du vill ta bort ${user.firstName} ${user.lastName}?`}
                  ariaLabel={`Bekräfta radering av ${user.firstName} ${user.lastName}`}
                />
                <CTAbtn
                  type="cancel"
                  onClick={() => setConfirmDelete(null)}
                  role={role}
                  confirmMessage={`Avbryt radering av ${user.firstName} ${user.lastName}?`}
                  ariaLabel={`Avbryt radering av ${user.firstName} ${user.lastName}`}
                />
              </>
            ) : (
              <CTAbtn
                type="delete"
                onClick={() => setConfirmDelete(user.id)}
                role={role}
                confirmMessage={`Vill du radera ${user.firstName} ${user.lastName}?`}
                ariaLabel={`Förbered radering av ${user.firstName} ${user.lastName}`}
              />
            )}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
