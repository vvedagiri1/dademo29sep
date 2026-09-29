import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Columns (feature): large image beside a text column with breadcrumb,
 * heading, byline and meta. Authored as 1 row x 2 cells: [img] | [text].
 * Image may be in either cell; extra rows are laid out the same way.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const rows = [...block.children];
  const firstRow = rows[0];
  const colCount = firstRow ? firstRow.children.length : 0;
  block.classList.add(`columns-feature-${colCount}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const onlyImage = pic && !col.textContent.trim();
      if (onlyImage) {
        col.classList.add('columns-feature-img-col');
        const img = pic.querySelector('img');
        if (img) pic.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 900px)', width: '1200' }, { width: '750' }]));
      } else {
        col.classList.add('columns-feature-text-col');
        // breadcrumb: a leading paragraph made of several links
        const first = col.firstElementChild;
        const nextIsHeading = first && /^H[1-6]$/.test(first.nextElementSibling?.tagName || '');
        if (first && first.tagName === 'P' && first.querySelector('a') && nextIsHeading) {
          first.classList.add('columns-feature-breadcrumb');
        }
        // meta: trailing paragraphs after the heading
        const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          let sib = heading.nextElementSibling;
          while (sib) {
            if (sib.tagName === 'P' && !sib.querySelector('a, picture')) sib.classList.add('columns-feature-meta');
            sib = sib.nextElementSibling;
          }
        }
      }
    });
  });
}
