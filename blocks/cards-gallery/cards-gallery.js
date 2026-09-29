import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Cards (gallery): image-only grid. Each authored row is one tile holding an
 * image; optional extra cells (caption text) are kept as a tile body.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    // a row may hold several images across cells; each becomes its own tile
    const pictures = [...row.querySelectorAll('picture')];
    const textCells = [...row.children].filter((cell) => !cell.querySelector('picture') && cell.textContent.trim());

    if (!pictures.length && !textCells.length) return;

    if (pictures.length > 1 && !textCells.length) {
      pictures.forEach((pic) => {
        const li = document.createElement('li');
        const media = document.createElement('div');
        media.className = 'cards-gallery-image';
        media.append(pic);
        li.append(media);
        ul.append(li);
      });
      return;
    }

    const li = document.createElement('li');
    if (pictures.length) {
      const media = document.createElement('div');
      media.className = 'cards-gallery-image';
      media.append(pictures[0]);
      li.append(media);
    }
    textCells.forEach((cell) => {
      cell.className = 'cards-gallery-body';
      li.append(cell);
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });
  block.replaceChildren(ul);
}
