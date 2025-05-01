  export default function ReadOnlyContent({ html }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
