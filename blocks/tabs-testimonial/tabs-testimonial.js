import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Tabs (testimonial): based on the Block Collection tabs block.
 * Each row = one testimonial: [tab label: avatar, name, role] | [panel: image, name, role, quote].
 * Panels render above a row of avatar tab buttons.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';

  const rows = [...block.children].filter((row) => row.children.length);
  const used = new Set();

  rows.forEach((row, i) => {
    const [labelCell, ...rest] = [...row.children];
    // tolerate a single-cell row: use it as both the label and the panel content
    const contentCell = rest.length ? rest : [labelCell.cloneNode(true)];

    let id = toClassName(labelCell.textContent) || `item-${i + 1}`;
    if (used.has(id)) id = `${id}-${i + 1}`;
    used.add(id);

    // panel
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', i !== 0);

    const media = document.createElement('div');
    media.className = 'tabs-testimonial-media';
    const body = document.createElement('div');
    body.className = 'tabs-testimonial-body';
    contentCell.forEach((cell) => {
      cell.querySelectorAll('picture').forEach((pic) => {
        const parent = pic.parentElement;
        media.append(pic);
        const emptyWrapper = parent !== cell
          && !parent.textContent.trim() && !parent.children.length;
        if (emptyWrapper) parent.remove();
      });
      body.append(...cell.childNodes);
    });
    if (media.children.length) panel.append(media);
    panel.append(body);
    panels.append(panel);

    // tab button
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0);
    button.tabIndex = i === 0 ? 0 : -1;
    const avatar = labelCell.querySelector('picture');
    if (avatar) {
      const wrap = document.createElement('span');
      wrap.className = 'tabs-testimonial-avatar';
      const p = avatar.parentElement;
      wrap.append(avatar);
      if (p !== labelCell && !p.textContent.trim() && !p.children.length) p.remove();
      button.append(wrap);
    }
    const label = document.createElement('span');
    label.className = 'tabs-testimonial-label';
    label.append(...labelCell.childNodes);
    button.append(label);
    tablist.append(button);
  });

  const select = (button) => {
    tablist.querySelectorAll('[role=tab]').forEach((btn) => {
      const on = btn === button;
      btn.setAttribute('aria-selected', on);
      btn.tabIndex = on ? 0 : -1;
    });
    panels.querySelectorAll('[role=tabpanel]').forEach((panel) => {
      panel.setAttribute('aria-hidden', panel.id !== button.getAttribute('aria-controls'));
    });
  };

  tablist.addEventListener('click', (e) => {
    const button = e.target.closest('[role=tab]');
    if (button) select(button);
  });
  tablist.addEventListener('keydown', (e) => {
    const tabs = [...tablist.querySelectorAll('[role=tab]')];
    const idx = tabs.indexOf(document.activeElement);
    if (idx < 0) return;
    let next;
    if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') [next] = tabs;
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      select(next);
      next.focus();
    }
  });

  panels.querySelectorAll('.tabs-testimonial-media picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
  tablist.querySelectorAll('.tabs-testimonial-avatar picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '96' }]));
  });

  block.replaceChildren(panels, tablist);
}
