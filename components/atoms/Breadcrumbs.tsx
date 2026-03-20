"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <>
                <Link href={item.href} className="breadcrumb-link">
                  {item.label}
                </Link>
                {index < items.length - 1 && (
                  <span className="breadcrumb-separator">/</span>
                )}
              </>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          margin-bottom: 32px;
        }

        .breadcrumbs-list {
          display: flex;
          align-items: center;
          gap: 12px;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .breadcrumb-link {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--dim, #7a7060);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: var(--gold, #c9a84c);
        }

        .breadcrumb-current {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold, #c9a84c);
        }

        .breadcrumb-separator {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: var(--dimmer, #3e3830);
        }

        @media (max-width: 768px) {
          .breadcrumbs {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </nav>
  );
}
