const OPTION_CLASSES = [];

/**
 * Accordion (FAQ): based on the Block Collection accordion block.
 * Each row = [question] | [answer]. Built on native <details>/<summary>.
 * Rows with only one cell become a label with an empty body; extra cells
 * are appended to the body.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    const [label, ...rest] = [...row.children];
    if (!label || (!label.textContent.trim() && !rest.length)) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    const labelText = document.createElement('span');
    labelText.className = 'accordion-faq-item-label-text';
    labelText.append(...label.childNodes);
    const icon = document.createElement('span');
    icon.className = 'accordion-faq-item-icon';
    icon.setAttribute('aria-hidden', 'true');
    summary.append(labelText, icon);

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    rest.forEach((cell) => body.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
