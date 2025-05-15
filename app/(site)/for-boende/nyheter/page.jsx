"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CTAbtn from "@/app/components/ui/CTAbtn";
import FeedbackMessage from "@/app/components/ui/FeedbackMessage";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/user";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";

export default function NewsCollectionPage() {
  const [news, setNews] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const router = useRouter();
  const { user } = useUser();
  const role = user?.role || "guest";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/nyheter?page=${currentPage}`);
        if (!res.ok) throw new Error("Misslyckades att hämta nyheter");
        const data = await res.json();
        setNews(data.newsPost);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error(err);
        setFeedbackMessage({
          type: "error",
          message: "Kunde inte hämta nyheter. Försök igen senare.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [currentPage]);

  const handleCreateNews = () => {
    router.push("/for-boende/nyheter/skapa-nyhet");
  };

  return (
    <article
      className="news-collection"
      aria-label="Nyheter och händelser"
    >
      <h1 className="news-collection__title">Nyheter och händelser</h1>

      {feedbackMessage && (
        <FeedbackMessage
          type={feedbackMessage.type}
          message={feedbackMessage.message}
        />
      )}

      {loading && (
        <div aria-busy="true" aria-live="polite">
          <SkeletonLoader lines={6} />
        </div>
      )}

      {role === "ADMIN" || role === "MODERATOR" ? (
        <div className="news-collection__controls">
          <CTAbtn
            type="publish"
            role={role}
            onClick={handleCreateNews}
            ariaLabel="Skapa nyhet"
          />
        </div>
      ) : null}

      {!loading && (
        <ul className="news-collection__list" role="list">
          {news.length === 0 ? (
            <p>Inga nyheter.</p>
          ) : (
            news.map((item) => (
              <li
                key={item.id}
                className="news-collection__news-card"
                role="listitem"
              >
                <article
                  className="news-card__article"
                  aria-labelledby={`news-title-${item.id}`}
                >
                  <Link
                    href={`/for-boende/nyheter/${item.slug}`}
                    className="news-card__link"
                  >
                    <header className="news-card__date" aria-hidden="true">
                      <p className="news-card__day">
                        {new Date(item.createdAt).getDate()}
                      </p>
                      <time
                        className="news-card__month"
                        dateTime={new Date(item.createdAt).toISOString()}
                      >
                        {new Date(item.createdAt).toLocaleDateString("sv-SE", {
                          month: "short",
                        })}
                      </time>
                    </header>

                    <div className="news-card__content">
                      <h2
                        id={`news-title-${item.id}`}
                        className="news-card__title"
                      >
                        {item.title}
                      </h2>
                      <p className="news-card__excerpt">
                        {item.content?.slice(0, 140) ||
                          "Ingen förhandsvisning tillgänglig"}
                        ...
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            ))
          )}
        </ul>
      )}

      {!loading && news.length > 0 && (
        <nav className="pagination" aria-label="Nyhetssidor">
          <ul className="pagination__list">
            {Array.from(
              { length: Math.ceil(totalCount / itemsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`pagination__button ${
                    page === currentPage ? "is-active" : ""
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
