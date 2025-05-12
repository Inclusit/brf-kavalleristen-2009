"use client";
import DynamicPage from "../components/layout/DynamicPage";
import LatestNews from "../components/layout/LatestNews";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">
          Välkommen till Brf Kavalleristen 2009
        </h1>
        <div className="home-page__link-wrapper">
          <Link
            href="/for-boende/stadgar"
            className="home-page__link-card home-page__link-card--icon"
          >
            <div className="home-page__link-icon-wrapper">
              <Image
                src="/icons/book-icon.svg"
                alt="Väsby konsthall"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Föreningens stadgar</p>
              <p className="home-page__link-text">
                Läs om våra stadgar och regler för att bo i föreningen.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </Link>

          <Link
            href="/for-boende/nyheter"
            className="home-page__link-card home-page__link-card--icon"
          >
            <div className="home-page__link-icon-wrapper">
              <Image
                src="/icons/news-icon.svg"
                alt="Väsby konsthall"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Nyheter</p>
              <p className="home-page__link-text">
                Håll dig uppdaterad med de senaste nyheterna och evenemangen i
                vår förening.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </Link>

          <Link
            href="/kontakt/styrelsen"
            className="home-page__link-card home-page__link-card--icon"
          >
            <div className="home-page__link-icon-wrapper">
              <Image
                src="/icons/group-icon.svg"
                alt="Väsby konsthall"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Styrelsen</p>
              <p className="home-page__link-text">
                Möt styrelsen och få kontaktuppgifter till våra ledamöter.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <LatestNews />

      <section>
        <DynamicPage slug="/" />
      </section>

      <section className="home-page__info">
        <h2 className="home-page__title">
          Intresserad av att flytta till Upplands Väsby?
        </h2>

        <div className="home-page__link-wrapper">
          <a
            href="https://www.upplandsvasby.se/"
            className="home-page__link-card home-page__link-card--image"
          >
            <div className="home-page__link-image-wrapper">
              <Image
                src="/images/visit-vasby.jpg"
                alt="Upplands Väsby kommun"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Visit Upplands Väsby</p>
              <p className="home-page__link-text">
                Upptäck natur, kultur, aktiviteter och det vardagsnära livet i
                Väsby – både som boende och besökare.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </a>
          <a
            href="https://www.vasbygymnasium.se/"
            className="home-page__link-card home-page__link-card--image"
          >
            <div className="home-page__link-image-wrapper">
              <Image
                src="/images/vasby-gymnasium.jpeg"
                alt="Elever på Väsby Nya Gymnasium"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>

            <div className="home-page__link-content">
              <p className="home-page__link-title">Väsby Nya Gymansium</p>
              <p className="home-page__link-text">
                En modern skola med tydligt framtidsfokus – för dig som växer
                upp eller flyttar hit med tonåringar.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </a>

          <a
            href="https://vasbycentrum.se/"
            className="home-page__link-card home-page__link-card--image"
          >
            <div className="home-page__link-image-wrapper">
              <Image
                src="/images/vasby-centrum.jpg"
                alt="Väsby centrums skylt"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Väsby centrum</p>
              <p className="home-page__link-text">
                Shopping, vardagsservice och matbutiker – ett levande centrum
                bara minuter från hemmet.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </a>

          <a
            href="https://vasbykonsthall.se/"
            className="home-page__link-card home-page__link-card--image"
          >
            <div className="home-page__link-image-wrapper">
              <Image
                src="/images/vasby-konsthall.jpeg"
                alt="Väsby konsthall"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <p className="home-page__link-title">Väsby konsthall</p>
              <p className="home-page__link-text">
                Lokal konst, utställningar och kultur mitt i vardagen – öppen
                för alla som vill inspireras.
              </p>
              <div className="home-page__link-svg-wrapper">
                <div className="home-page__link-svg"></div>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
