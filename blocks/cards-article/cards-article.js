import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Cards (article): linked article teasers.
 * Each row = [image] | [p(tag), p(date), h3 with link].
 * Leading short paragraphs before the heading become a meta line; the
 * heading link is stretched to make the whole card clickable.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture') && !div.textContent.trim()) {
        div.className = 'cards-article-card-image';
        return;
      }
      div.className = 'cards-article-card-body';
      const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const metaParas = [];
        let sib = heading.previousElementSibling;
        while (sib) {
          if (sib.tagName === 'P' && !sib.querySelector('picture')) metaParas.unshift(sib);
          sib = sib.previousElementSibling;
        }
        if (metaParas.length) {
          const meta = document.createElement('div');
          meta.className = 'cards-article-card-meta';
          metaParas[0].before(meta);
          metaParas.forEach((p, idx) => {
            p.classList.add(idx === 0 ? 'cards-article-card-tag' : 'cards-article-card-date');
            meta.append(p);
          });
        }
        const link = heading.querySelector('a');
        if (link) {
          li.classList.add('cards-article-card-linked');
          link.classList.add('cards-article-card-link');
        }
      }
    });

    // no heading link but a lone link elsewhere: still make the card linked
    if (!li.querySelector('.cards-article-card-link')) {
      const links = li.querySelectorAll('.cards-article-card-body a');
      if (links.length === 1) {
        links[0].classList.add('cards-article-card-link');
        li.classList.add('cards-article-card-linked');
      }
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
