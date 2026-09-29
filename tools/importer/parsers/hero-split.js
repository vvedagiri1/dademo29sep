/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/hero-split): 1 row x 2 columns
 *   [h1, p, a(primary), a(secondary)] | [img, img, img]
 */
export default function parse(element, { document }) {
  // Text column: first direct child that holds the heading (source: div > h1.h1-heading)
  const children = [...element.querySelectorAll(':scope > div')];
  const textCol = children.find((c) => c.querySelector('h1, h2, h3')) || children[0] || element;
  const mediaCol = children.find((c) => c !== textCol && c.querySelector('img')) || null;

  const heading = textCol.querySelector('h1, h2, h3');
  const subheading = textCol.querySelector('p.subheading') || textCol.querySelector('p');
  const ctas = [...textCol.querySelectorAll('.button-group a, a.button')]
    .filter((a, i, arr) => arr.indexOf(a) === i);

  const images = mediaCol
    ? [...mediaCol.querySelectorAll('img')]
    : [...element.querySelectorAll('img')].filter((img) => !textCol.contains(img));

  if (!heading && !subheading && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  });

  const cells = [[contentCell, images.length ? images : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
