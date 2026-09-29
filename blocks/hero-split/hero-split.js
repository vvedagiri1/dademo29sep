import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Hero (split): text column (heading, copy, CTAs) beside an image collage.
 * Authored as 1 row x 2 cells: [h1, p, links] | [images].
 * Tolerates the cells being swapped, missing, or content spread across rows.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const content = document.createElement('div');
  content.className = 'hero-split-content';
  const media = document.createElement('div');
  media.className = 'hero-split-media';

  cells.forEach((cell) => {
    const pictures = [...cell.querySelectorAll('picture')];
    const hasText = [...cell.children].some((el) => !el.querySelector('picture') && el.tagName !== 'PICTURE' && el.textContent.trim());
    if (pictures.length && !hasText) {
      pictures.forEach((pic) => media.append(pic));
    } else {
      // move any stray pictures into the media column, keep text in content
      pictures.forEach((pic) => {
        const parent = pic.parentElement;
        media.append(pic);
        const emptyWrapper = parent && parent !== cell
          && !parent.textContent.trim() && !parent.children.length;
        if (emptyWrapper) parent.remove();
      });
      content.append(...cell.childNodes);
    }
  });

  // CTA group: collect paragraphs that only contain links
  const ctaParas = [...content.querySelectorAll(':scope > p')].filter((p) => {
    const links = p.querySelectorAll('a');
    const isBlankText = (n) => n.nodeType === Node.TEXT_NODE && !n.textContent.trim();
    const isLinkEl = (n) => n.nodeType === Node.ELEMENT_NODE
      && (n.tagName === 'A' || n.querySelector('a'));
    return links.length && [...p.childNodes].every((n) => isBlankText(n) || isLinkEl(n));
  });
  if (ctaParas.length) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-split-ctas';
    ctaParas[0].before(ctas);
    ctaParas.forEach((p) => ctas.append(p));
  }

  media.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]));
  });
  media.dataset.count = media.children.length;

  const row = document.createElement('div');
  row.className = 'hero-split-inner';
  row.append(content);
  if (media.children.length) row.append(media);
  else block.classList.add('hero-split-no-media');
  block.replaceChildren(row);
}
