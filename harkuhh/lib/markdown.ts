export function markdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Tables
  html = html.replace(
    /(?:^\|.+\|$\n?)+/gm,
    (table) => {
      const rows = table.trim().split('\n').filter((r) => !/^\|[\s-:|]+\|$/.test(r));
      if (rows.length === 0) return table;
      const header = rows[0];
      const body = rows.slice(1);
      const thCells = header
        .split('|')
        .filter((c) => c.trim())
        .map((c) => `<th>${c.trim()}</th>`)
        .join('');
      const bodyRows = body
        .map((row) => {
          const cells = row
            .split('|')
            .filter((c) => c.trim())
            .map((c) => `<td>${c.trim()}</td>`)
            .join('');
          return `<tr>${cells}</tr>`;
        })
        .join('');
      return `<table><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    }
  );

  // Unordered lists
  html = html.replace(
    /(?:^- .+$\n?)+/gm,
    (block) => {
      const items = block
        .trim()
        .split('\n')
        .map((l) => `<li>${l.replace(/^- /, '')}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
  );

  // Ordered lists
  html = html.replace(
    /(?:^\d+\. .+$\n?)+/gm,
    (block) => {
      const items = block
        .trim()
        .split('\n')
        .map((l) => `<li>${l.replace(/^\d+\. /, '')}</li>`)
        .join('');
      return `<ol>${items}</ol>`;
    }
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs: wrap loose text lines
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|table|blockquote|div)/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  return html;
}
