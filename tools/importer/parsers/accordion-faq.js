/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/accordion-faq): N rows x 2 columns
 *   [question] | [answer p]
 * Decorative plus-icon images inside <summary> are dropped.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('details.faq-item, :scope > details')]
    .filter((d, i, arr) => arr.indexOf(d) === i);
  if (!items.length) items = [...element.querySelectorAll('details')];

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const questionText = summary
      ? ((summary.querySelector('span, h2, h3, h4, p') || summary).textContent || '').trim()
      : '';

    const answer = item.querySelector('.faq-answer');
    let answerContent = [];
    if (answer) {
      answerContent = [...answer.children];
      if (!answerContent.length && answer.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answer.textContent.trim();
        answerContent = [p];
      }
    } else {
      answerContent = [...item.children].filter((c) => c !== summary);
    }

    if (questionText || answerContent.length) {
      cells.push([questionText || '', answerContent.length ? answerContent : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
