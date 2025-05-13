"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/user";
import UploadHandler from "../cms/UploadHandler";
import SkeletonLoader from "../ui/SkeletonLoader";
import FeedbackMessage from "../ui/FeedbackMessage";

export default function ProfileCard({ memberId }) {
  const { user } = useUser();
  const role = user?.role;

  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/board-members/${memberId}`);
        if (!response.ok) throw new Error("Failed to fetch member data");
        const data = await response.json();
        setData(data);
        setForm(data);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const response = await fetch(`/api/board-members/${memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setFeedbackMessage({
        type: "error",
        message: "Misslyckades att spara ändringar.",
      });
      return;
    }

    const updatedMember = await response.json();
    setData(updatedMember);
    setEdit(false);
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/board-members/${memberId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setFeedbackMessage({
        type: "error",
        message: "Misslyckades att ta bort medlem.",
      });
      return;
    }

    setData(null);
  };

  if (loading)
    <div aria-busy={loading} aria-live="polite">
      <SkeletonLoader count={7} />;
    </div>;

  return (
    <div className="profile-card">
      {feedbackMessage && (
        <FeedbackMessage
          type={feedbackMessage.type}
          message={feedbackMessage.message}
          className="profile-card__feedback-message"
        />
      )}
      {edit ? (
        <div className="profile-card__edit">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <UploadHandler
            image={form.image}
            setImage={(image) => setForm((prev) => ({ ...prev, image }))}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="profile-card__view">
          <img src={data.image} alt={`${data.name}'s profile`} />
          <h2>{data.name}</h2>
          <p>{data.role}</p>
          <p>{data.email}</p>
          <p>{data.phone}</p>
          {role === "admin" && (
            <>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
