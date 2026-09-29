/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/cards-gallery): N rows x 1 column, [img] per tile.
 * Iterates the block-level tile wrappers (div.utility-aspect-1x1), falling back
 * to every direct child holding an image.
 */
export default function parse(element, { document }) {
  let tiles = [...element.querySelectorAll(':scope > div.utility-aspect-1x1')];
  if (!tiles.length) tiles = [...element.querySelectorAll(':scope > *')].filter((c) => c.querySelector('img') || c.tagName === 'IMG');

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.tagName === 'IMG' ? tile : tile.querySelector('img');
    if (img) cells.push([img]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
