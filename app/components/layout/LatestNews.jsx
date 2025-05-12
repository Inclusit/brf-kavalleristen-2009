"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function LatestNews() {
    const [news, setNews] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await fetch("/api/nyheter?limit=5", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch news");
          const data = await response.json();
          setNews(data.newsPost);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };
      fetchNews();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!news || news.length === 0) return null;

    return (
      <section
        className="latest-news latest-news--fullbleed"
        aria-labelledby="latest-news-heading"
        id="latest-news"
      >
        <div className="latest-news__content">
          <h2 className="latest-news__heading">
            Senaste nyheter och händelser
          </h2>

          <div className="latest-news__scroll-wrapper">
            <div className="latest-news__arrow-container">
              <button
                className="latest-news__arrow left"
                onClick={() => scroll("left")}
                aria-label="Scrolla vänster"
              >
                <ChevronLeft />
              </button>
            </div>

            <ul
              className="latest-news--scroll"
              ref={scrollRef}
              aria-label="Nyhetsflöde"
            >
              {news.map((item) => (
                <li key={item.id} className="news-collection__news-card">
                  <article className="news-card__article">
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
                          {new Date(item.createdAt).toLocaleDateString(
                            "sv-SE",
                            {
                              month: "short",
                            }
                          )}
                        </time>
                      </header>
                      
                      <time
                        className="sr-only"
                        dateTime={new Date(item.createdAt).toISOString()}
                      >
                        {new Date(item.createdAt).toLocaleDateString("sv-SE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>

                      <div className="news-card__content">
                        <h2 className="news-card__title">{item.title}</h2>
                        <p className="news-card__excerpt">
                          {item.content?.slice(0, 140) ||
                            "Ingen förhandsvisning tillgänglig"}
                          ...
                        </p>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>

            <div className="latest-news__arrow-container">
              <button
                className="latest-news__arrow right"
                aria-label="Scrolla höger"
                onClick={() => scroll("right")}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
}