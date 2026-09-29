/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/columns-feature): 1 row x 2 columns
 *   [img] | [p(breadcrumb links), h2, p(byline), p(date • read time)]
 */
export default function parse(element, { document }) {
  const cols = [...element.querySelectorAll(':scope > div')];
  const textCol = cols.find((c) => c.querySelector('h1, h2, h3, h4')) || cols[cols.length - 1];
  const imageCol = cols.find((c) => c !== textCol && c.querySelector('img')) || null;

  const image = imageCol
    ? imageCol.querySelector('img')
    : element.querySelector('img.cover-image, img[class*="aspect"]');

  if (!textCol && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];
  if (textCol) {
    // Breadcrumb: links only (decorative separator icon dropped)
    const crumbs = textCol.querySelector('.breadcrumbs, nav[aria-label*="readcrumb"]');
    if (crumbs) {
      const links = [...crumbs.querySelectorAll('a')];
      if (links.length) {
        const p = document.createElement('p');
        links.forEach((a, i) => {
          if (i) p.append(document.createTextNode(' '));
          p.append(a);
        });
        textCell.push(p);
      }
    }

    const heading = textCol.querySelector('h1, h2, h3, h4');
    if (heading) textCell.push(heading);

    // Meta lines: each flex row of spans becomes a paragraph
    const metaRows = [...textCol.querySelectorAll('.flex-horizontal')];
    metaRows.forEach((row) => {
      const text = [...row.querySelectorAll('span')].map((s) => s.textContent.trim()).filter(Boolean).join(' ')
        || row.textContent.trim().replace(/\s+/g, ' ');
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        textCell.push(p);
      }
    });
    if (!metaRows.length) {
      [...textCol.querySelectorAll('p')].forEach((p) => {
        if (!crumbs || !crumbs.contains(p)) textCell.push(p);
      });
    }
  }

  const cells = [[image || '', textCell.length ? textCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
