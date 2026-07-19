import { useMemo } from "react";

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "code"; language: string; text: string }
  | { kind: "table"; rows: string[][] };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function inlineMarkdown(value: string) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const target = href.endsWith(".md")
      ? `/docs/${href.split("/").pop()?.replace(/\.md$/, "") ?? ""}`
      : href;
    const external = target.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
    return `<a href="${escapeHtml(target)}"${external}>${label}</a>`;
  });
  return html;
}

function parseTableRow(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push({ kind: "code", language, text: code.join("\n") });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (line.startsWith("> ") || line === ">") {
      const quote: string[] = [];
      while (index < lines.length && (lines[index].startsWith("> ") || lines[index] === ">")) {
        quote.push(lines[index].replace(/^> ?/, ""));
        index += 1;
      }
      blocks.push({ kind: "quote", text: quote.join(" ") });
      continue;
    }

    const listMatch = line.match(/^\s*([-*+] |\d+\. )(.+)/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[1]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-*+] |\d+\. )(.+)/);
        if (!item || /^\d/.test(item[1]) !== ordered) break;
        items.push(item[2]);
        index += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const rows = [parseTableRow(line)];
      index += 2;
      while (index < lines.length && lines[index].includes("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ kind: "table", rows });
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,6}\s/.test(lines[index]) &&
      !lines[index].startsWith("```") &&
      !/^\s*([-*+] |\d+\. |>|\|)/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

export function MarkdownDocument({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <article className="prose-document">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "heading") {
          const Tag = `h${Math.min(block.level, 4)}` as "h1" | "h2" | "h3" | "h4";
          return <Tag key={key} dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }} />;
        }
        if (block.kind === "paragraph") {
          return <p key={key} dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }} />;
        }
        if (block.kind === "quote") {
          return <blockquote key={key} dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }} />;
        }
        if (block.kind === "code") {
          return <pre key={key}><code data-language={block.language}>{block.text}</code></pre>;
        }
        if (block.kind === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return <Tag key={key}>{block.items.map((item) => <li key={item} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />)}</Tag>;
        }
        return (
          <div className="prose-table-wrap" key={key}>
            <table>
              <thead><tr>{block.rows[0].map((cell) => <th key={cell} dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />)}</tr></thead>
              <tbody>{block.rows.slice(1).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </article>
  );
}
