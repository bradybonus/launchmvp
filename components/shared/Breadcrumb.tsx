import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Strip trailing closing parens and trim. Never show ")" at end of breadcrumb. */
function cleanLabel(raw: string): string {
  const s = String(raw ?? "").trim();
  // Remove trailing closing parens (ASCII, fullwidth, and other Unicode variants) and trailing whitespace
  return s.replace(/\s*[)\uFF09\uFE5A\u207E\u208E]+\s*$/, "").trim();
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;
  const cleanedItems = items.map((item) => ({ ...item, label: cleanLabel(item.label) }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {cleanedItems.map((item, i) => {
        const isLast = i === cleanedItems.length - 1;
        const label = item.label;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-gray-400" aria-hidden>
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                {label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-gray-900" : "text-gray-600"}>
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
