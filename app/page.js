import TestForm from "./components/TestForm";
import CMSField from "./components/cms/CMSField";

export default function Home() {
  return (
    <div>
        Hello from home
      <TestForm />
      <CMSField initialHtml="<p>Initial HTML content</p>" />
      
    </div>
  );
}
