import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownDisplay = ({ content }: { content: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: ({
          inline,
          className,
          children,
        }: {
          inline?: boolean; // inlineをオプショナルに変更
          className?: string; // classNameをオプショナルに変更
          children?: React.ReactNode;
        }) => {
          const language = className ? className.replace("language-", "") : "";
          return inline ? (
            <code className="bg-gray-200 rounded px-1">{children}</code>
          ) : (
            <pre
              className={`bg-gray-800 text-white p-4 rounded-lg overflow-auto`}
            >
              <code className={`language-${language}`}>{children}</code>
            </pre>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownDisplay;
