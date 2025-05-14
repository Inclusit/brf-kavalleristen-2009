"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/user";
import ProfileCard from "./ProfileCard";
import AddMemberModal from "./AddMemberModal";
import FeedbackMessage from "../ui/FeedbackMessage";
import CTAbtn from "../ui/CTAbtn";
import SkeletonLoader from "../ui/SkeletonLoader";

export default function CardGrid() {
  const { user } = useUser();
  const role = user?.role;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("/api/board-members");
        if (!res.ok) throw new Error();
        setMembers(await res.json());
      } catch {
        setFeedback({ type: "error", message: "Kunde inte hämta medlemmar." });
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const onSaved = (newMember) => setMembers((m) => [...m, newMember]);
  const onDeleted = (id) => setMembers((m) => m.filter((x) => x.id !== id));
  const onUpdated = (updated) =>
    setMembers((m) => m.map((x) => (x.id === updated.id ? updated : x)));



  return (
    <article className="member-grid" aria-label="Styrelsemedlemmar">
      {feedback && <FeedbackMessage {...feedback} />}
      {loading && (
        <div aria-busy="true" aria-live="polite">
          <SkeletonLoader count={7} />
        </div>
      )}
      {role === "ADMIN" && (
        <div className="member-grid__controls">
          <button
            type="button"
            className="cta-btn cta-btn--post"
            aria-label="Lägg till ny styrelsemedlem"
            onClick={() => setAdding(true)}
          >
            ➕👤 Ny medlem
          </button>
        </div>
      )}

      {adding && (
        <AddMemberModal onClose={() => setAdding(false)} onSaved={onSaved} />
      )}

      <div className="member-grid__list" role="list">
        {members.length === 0 ? (
          <p>Inga medlemmar.</p>
        ) : (
          members.map((m) => (
            <div key={m.id} role="listitem">
              <ProfileCard
                memberId={m.id}
                onDeleted={onDeleted}
                onUpdated={onUpdated}
              />
            </div>
          ))
        )}
      </div>
    </article>
  );
}
