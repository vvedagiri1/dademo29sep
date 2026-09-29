/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html.
 *
 * NOTE: the hero uses <header class="section secondary-section"> INSIDE
 * #main-content, so bare `header` must never be removed. The breadcrumbs in
 * the featured-story section are part of the columns-feature content model
 * and are intentionally kept.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Mobile menu toggle button inside the global navbar
    // Found: <button class="nav-mobile-menu-button" id="nav-toggle">
    WebImporter.DOMUtils.remove(element, ['#nav-toggle']);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Found: <a href="#main-content" class="skip-link">
      'a.skip-link',
      // Global header (handled separately as nav). Found: <div class="navbar">
      'div.navbar',
      // Global footer (handled separately). Found: <footer class="footer inverse-footer">
      'footer.footer.inverse-footer',
      // Safe non-authorable elements
      'iframe',
      'link',
      'noscript',
      'script',
      'style',
    ]);

    // Astro scoping attributes, e.g. data-astro-cid-37fxchfa on <body>
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes]
        .filter((attr) => attr.name.startsWith('data-astro-cid'))
        .forEach((attr) => el.removeAttribute(attr.name));
    });
  }
}
