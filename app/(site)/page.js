"use client";
import DynamicPage from "../components/layout/DynamicPage";
import LatestNews from "../components/layout/LatestNews";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <Head>
          <title>Brf Kavalleristen 2009</title>
          <meta
            name="description"
            content="Välkommen till Brf Kavalleristen 2009 i Upplands Väsby. Här hittar du information om föreningen, nyheter och kontaktuppgifter."
          />
        </Head>
        <h1 id="hero-title" className="home-page__title">
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
                alt="Ikon som föreställer en bok – länk till föreningens stadgar"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Föreningens stadgar</h2>
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
                alt="Ikon som föreställer en tidning – länk till samtliga nyheter"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Nyheter</h2>
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
                alt="Ikon som föreställer en grupp människor – länk till styrelsen"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Styrelsen</h2>
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
        <p className="sr-only"> Information från föreningen</p>
        <DynamicPage slug="/" />
      </section>

      <section className="home-page__info" aria-labelledby="home-page__title">
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
                alt="Bild på Upplands Väsby kommun - länk till kommunens hemsida"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Visit Upplands Väsby</h2>
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
                alt="Bild på Väsby Nya Gymnasium - länk till gymnasiets hemsida"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>

            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Väsby Nya Gymansium</h2>
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
                alt="Bild på Väsby centrum - länk till centrumets hemsida"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Väsby centrum</h2>
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
                alt="Bild på Väsby konsthall - länk till konsthallens hemsida"
                width={300}
                height={120}
                className="home-page__link-image"
              />
            </div>
            <div className="home-page__link-content">
              <h2 className="home-page__link-title">Väsby konsthall</h2>
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
