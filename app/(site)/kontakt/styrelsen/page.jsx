import { members } from "@/app/api/boardMembers/route";
import CardGrid from "@/app/components/cards/CardGrid";
import Head from "next/head";

export default function StyrelsenPage() {
  return (
    <div className="styrelsen-page">
      <Head>
        <title>Styrelsen</title>
        <meta name="description" content="Information about styrelsen." />
      </Head>
      <h1>Styrelsen</h1>
      <p>Information om styrelsen.</p>
      /*
      <CardGrid people={members} />
      */
    </div>
  );
}
