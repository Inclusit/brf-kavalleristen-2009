"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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

    return(
        <div className="news-collection-page">
            <h1 className="news-collection-page__title">Nyheter</h1>
            {role === "ADMIN" || role === "MODERATOR" ? (<button className="news-collection-page__create-button" onClick={handleCreateNews}>
                Skapa nyhet
            </button>) : null}
            
            

            <ul className="news-collection-page__list">
                {news.map((item) => (
                    <li key={item.id} className="news-collection-page__item">
                        <Link href={`/for-boende/nyheter/${item.slug}`} className="news-collection-page__link">
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>   
        </div>
    );
}