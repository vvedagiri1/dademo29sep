/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/cards-article): N rows x 2 columns
 *   [img] | [p(tag), p(date), h3 linked title]
 * Cards are <a class="article-card"> wrapping block content. Iteration is keyed
 * on the inner block wrapper (.article-card-body) so html2md inline-merging of
 * sibling anchors cannot collapse items; the href is re-attached to the heading.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.article-card-body')].map((body) => ({
    body,
    image: body.parentElement?.querySelector(':scope > .article-card-image img')
      || body.previousElementSibling?.querySelector('img')
      || null,
    href: body.closest('a')?.getAttribute('href') || '',
  }));
  if (!items.length) {
    // Fallback: iterate the card anchors directly
    items = [...element.querySelectorAll(':scope > a')].map((card) => ({
      body: card,
      image: card.querySelector('img'),
      href: card.getAttribute('href') || '',
    }));
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const textCell = [];
    const tag = body.querySelector('.tag');
    if (tag) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }
    const date = body.querySelector('.article-card-meta .utility-text-secondary, .article-card-meta span:not(.tag)');
    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }
    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = heading.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = heading.textContent.trim();
      }
      textCell.push(h3);
    }
    if (image || textCell.length) cells.push([image || '', textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
