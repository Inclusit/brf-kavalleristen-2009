import dynamic from "next/dynamic";
import ReadOnlyContent from "./ReadOnlyContent";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default function ContentRenderer({ role, html }) {
  if (role === "admin" || role === "moderator") {
    return <Editor />;
  } else {
    return <ReadOnlyContent html={html} />;
  }
}
