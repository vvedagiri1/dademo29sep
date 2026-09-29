/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/hero-overlay): 2 rows x 1 column
 *   [background img] / [h2, p, a]
 */
export default function parse(element, { document }) {
  const body = element.querySelector('.card-body') || element;
  const bgImage = element.querySelector('img.cover-image, img.utility-overlay')
    || [...element.querySelectorAll('img')].find((img) => !body.contains(img) || body === element)
    || null;

  const heading = body.querySelector('h1, h2, h3');
  const description = body.querySelector('p.subheading') || body.querySelector('p');
  const ctas = [...body.querySelectorAll('.button-group a, a.button')]
    .filter((a, i, arr) => arr.indexOf(a) === i);

  if (!heading && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
