import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Hero (overlay): background image with heading, copy and CTA layered on top.
 * Authored as 2 rows x 1 column: [background image] / [h2, p, link].
 * Also tolerates image + text in the same row/cell, or no image at all.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const background = document.createElement('div');
  background.className = 'hero-overlay-background';
  const content = document.createElement('div');
  content.className = 'hero-overlay-content';

  const firstPicture = block.querySelector('picture');
  if (firstPicture) {
    const img = firstPicture.querySelector('img');
    background.append(img
      ? createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }])
      : firstPicture.cloneNode(true));
    const parent = firstPicture.parentElement;
    firstPicture.remove();
    if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.children.length) parent.remove();
  }

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.textContent.trim() || cell.querySelector('picture')) content.append(...cell.childNodes);
  });

  block.replaceChildren();
  if (background.children.length) block.append(background);
  else block.classList.add('hero-overlay-no-image');
  block.append(content);
}
