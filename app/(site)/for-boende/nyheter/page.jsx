"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CTAbtn from "@/app/components/ui/CTAbtn";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/user";

export default function NewsCollectionPage() {
    const [news, setNews] = useState([]);
    const router = useRouter();
    const { user } = useUser();
    const role = user?.role || "guest";
    
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("/api/nyheter", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch news");
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };
        fetchNews();
    }, []);

    const handleCreateNews = () => {
       router.push("/for-boende/nyheter/skapa-nyhet");
    };

    return (
      <div className="news-collection">
        <h1 className="news-collection-page__title">Nyheter och händelser</h1>
        {role === "ADMIN" || role === "MODERATOR" ? (
          <CTAbtn type="publish" role={role} onClick={handleCreateNews} />
        ) : null}
        <ul className="news-collection__list">
          {news.map((item) => (
            <li key={item.id} className="news-collection__news-card">
              <Link
                href={`/for-boende/nyheter/${item.slug}`}
                className="news-card__link"
              >
                <div className="news-card__date">
                  <p>
                    {new Date(item.createdAt).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <div className="news-card__title">
                  <h2>{item.title}</h2>
                </div>
                <div className="news-card__author">
                  <p>
                    {item.author?.firstName} {item.author?.lastName}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
}