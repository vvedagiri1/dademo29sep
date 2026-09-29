/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Authored structure (blocks/tabs-testimonial): N rows x 2 columns
 *   [avatar img, strong name, role] | [img, strong name, role, p quote]
 * Panels (.tab-pane) are paired with tab buttons (.tab-menu-link) by index.
 * Iteration is keyed on the panes (block-level divs), not the buttons.
 */
export default function parse(element, { document }) {
  const panes = [...element.querySelectorAll('.tabs-content > .tab-pane, .tab-pane')]
    .filter((p, i, arr) => arr.indexOf(p) === i);
  const tabs = [...element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link, [role="tab"]')]
    .filter((t, i, arr) => arr.indexOf(t) === i);

  const para = (content, strong = false) => {
    const p = document.createElement('p');
    if (strong) {
      const s = document.createElement('strong');
      s.textContent = content;
      p.append(s);
    } else {
      p.textContent = content;
    }
    return p;
  };

  // Extracts name (from <strong>) and role (first sibling text block that isn't the name)
  const nameRole = (scope) => {
    const strong = scope.querySelector('strong');
    const name = strong ? strong.textContent.trim() : '';
    let role = '';
    if (strong) {
      const nameBox = strong.closest('div') || strong.parentElement;
      let sib = nameBox && nameBox.nextElementSibling;
      while (sib && !role) {
        if (sib.tagName !== 'P' && !sib.querySelector('img')) role = sib.textContent.trim();
        sib = sib.nextElementSibling;
      }
    }
    return { name, role };
  };

  const cells = [];
  panes.forEach((pane, i) => {
    const tab = tabs[i];

    // Content cell
    const contentCell = [];
    const paneImg = pane.querySelector('img');
    if (paneImg) contentCell.push(paneImg);
    const { name, role } = nameRole(pane);
    if (name) contentCell.push(para(name, true));
    if (role) contentCell.push(para(role));
    const quote = pane.querySelector('p');
    if (quote) contentCell.push(quote);

    // Label cell
    const labelCell = [];
    if (tab) {
      const avatar = tab.querySelector('.avatar img, img');
      if (avatar) labelCell.push(avatar);
      const t = nameRole(tab);
      if (t.name) labelCell.push(para(t.name, true));
      if (t.role) labelCell.push(para(t.role));
    }
    if (!labelCell.length) {
      if (name) labelCell.push(para(name, true));
      if (role) labelCell.push(para(role));
    }

    if (contentCell.length || labelCell.length) {
      cells.push([labelCell.length ? labelCell : '', contentCell.length ? contentCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
