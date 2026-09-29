/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const children = [...element.querySelectorAll(":scope > div")];
    const textCol = children.find((c) => c.querySelector("h1, h2, h3")) || children[0] || element;
    const mediaCol = children.find((c) => c !== textCol && c.querySelector("img")) || null;
    const heading = textCol.querySelector("h1, h2, h3");
    const subheading = textCol.querySelector("p.subheading") || textCol.querySelector("p");
    const ctas = [...textCol.querySelectorAll(".button-group a, a.button")].filter((a, i, arr) => arr.indexOf(a) === i);
    const images = mediaCol ? [...mediaCol.querySelectorAll("img")] : [...element.querySelectorAll("img")].filter((img) => !textCol.contains(img));
    if (!heading && !subheading && !images.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctas.forEach((a) => {
      const p = document2.createElement("p");
      p.append(a);
      contentCell.push(p);
    });
    const cells = [[contentCell, images.length ? images : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document: document2 }) {
    const cols = [...element.querySelectorAll(":scope > div")];
    const textCol = cols.find((c) => c.querySelector("h1, h2, h3, h4")) || cols[cols.length - 1];
    const imageCol = cols.find((c) => c !== textCol && c.querySelector("img")) || null;
    const image = imageCol ? imageCol.querySelector("img") : element.querySelector('img.cover-image, img[class*="aspect"]');
    if (!textCol && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (textCol) {
      const crumbs = textCol.querySelector('.breadcrumbs, nav[aria-label*="readcrumb"]');
      if (crumbs) {
        const links = [...crumbs.querySelectorAll("a")];
        if (links.length) {
          const p = document2.createElement("p");
          links.forEach((a, i) => {
            if (i) p.append(document2.createTextNode(" "));
            p.append(a);
          });
          textCell.push(p);
        }
      }
      const heading = textCol.querySelector("h1, h2, h3, h4");
      if (heading) textCell.push(heading);
      const metaRows = [...textCol.querySelectorAll(".flex-horizontal")];
      metaRows.forEach((row) => {
        const text = [...row.querySelectorAll("span")].map((s) => s.textContent.trim()).filter(Boolean).join(" ") || row.textContent.trim().replace(/\s+/g, " ");
        if (text) {
          const p = document2.createElement("p");
          p.textContent = text;
          textCell.push(p);
        }
      });
      if (!metaRows.length) {
        [...textCol.querySelectorAll("p")].forEach((p) => {
          if (!crumbs || !crumbs.contains(p)) textCell.push(p);
        });
      }
    }
    const cells = [[image || "", textCell.length ? textCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(":scope > div.utility-aspect-1x1")];
    if (!tiles.length) tiles = [...element.querySelectorAll(":scope > *")].filter((c) => c.querySelector("img") || c.tagName === "IMG");
    const cells = [];
    tiles.forEach((tile) => {
      const img = tile.tagName === "IMG" ? tile : tile.querySelector("img");
      if (img) cells.push([img]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panes = [...element.querySelectorAll(".tabs-content > .tab-pane, .tab-pane")].filter((p, i, arr) => arr.indexOf(p) === i);
    const tabs = [...element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link, [role="tab"]')].filter((t, i, arr) => arr.indexOf(t) === i);
    const para = (content, strong = false) => {
      const p = document2.createElement("p");
      if (strong) {
        const s = document2.createElement("strong");
        s.textContent = content;
        p.append(s);
      } else {
        p.textContent = content;
      }
      return p;
    };
    const nameRole = (scope) => {
      const strong = scope.querySelector("strong");
      const name = strong ? strong.textContent.trim() : "";
      let role = "";
      if (strong) {
        const nameBox = strong.closest("div") || strong.parentElement;
        let sib = nameBox && nameBox.nextElementSibling;
        while (sib && !role) {
          if (sib.tagName !== "P" && !sib.querySelector("img")) role = sib.textContent.trim();
          sib = sib.nextElementSibling;
        }
      }
      return { name, role };
    };
    const cells = [];
    panes.forEach((pane, i) => {
      const tab = tabs[i];
      const contentCell = [];
      const paneImg = pane.querySelector("img");
      if (paneImg) contentCell.push(paneImg);
      const { name, role } = nameRole(pane);
      if (name) contentCell.push(para(name, true));
      if (role) contentCell.push(para(role));
      const quote = pane.querySelector("p");
      if (quote) contentCell.push(quote);
      const labelCell = [];
      if (tab) {
        const avatar = tab.querySelector(".avatar img, img");
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
        cells.push([labelCell.length ? labelCell : "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let items = [...element.querySelectorAll(".article-card-body")].map((body) => {
      var _a, _b, _c;
      return {
        body,
        image: ((_a = body.parentElement) == null ? void 0 : _a.querySelector(":scope > .article-card-image img")) || ((_b = body.previousElementSibling) == null ? void 0 : _b.querySelector("img")) || null,
        href: ((_c = body.closest("a")) == null ? void 0 : _c.getAttribute("href")) || ""
      };
    });
    if (!items.length) {
      items = [...element.querySelectorAll(":scope > a")].map((card) => ({
        body: card,
        image: card.querySelector("img"),
        href: card.getAttribute("href") || ""
      }));
    }
    const cells = [];
    items.forEach(({ body, image, href }) => {
      const textCell = [];
      const tag = body.querySelector(".tag");
      if (tag) {
        const p = document2.createElement("p");
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      const date = body.querySelector(".article-card-meta .utility-text-secondary, .article-card-meta span:not(.tag)");
      if (date) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      const heading = body.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) {
        const h3 = document2.createElement("h3");
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = heading.textContent.trim();
          h3.append(a);
        } else {
          h3.textContent = heading.textContent.trim();
        }
        textCell.push(h3);
      }
      if (image || textCell.length) cells.push([image || "", textCell.length ? textCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = [...element.querySelectorAll("details.faq-item, :scope > details")].filter((d, i, arr) => arr.indexOf(d) === i);
    if (!items.length) items = [...element.querySelectorAll("details")];
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const questionText = summary ? ((summary.querySelector("span, h2, h3, h4, p") || summary).textContent || "").trim() : "";
      const answer = item.querySelector(".faq-answer");
      let answerContent = [];
      if (answer) {
        answerContent = [...answer.children];
        if (!answerContent.length && answer.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = answer.textContent.trim();
          answerContent = [p];
        }
      } else {
        answerContent = [...item.children].filter((c) => c !== summary);
      }
      if (questionText || answerContent.length) {
        cells.push([questionText || "", answerContent.length ? answerContent : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const body = element.querySelector(".card-body") || element;
    const bgImage = element.querySelector("img.cover-image, img.utility-overlay") || [...element.querySelectorAll("img")].find((img) => !body.contains(img) || body === element) || null;
    const heading = body.querySelector("h1, h2, h3");
    const description = body.querySelector("p.subheading") || body.querySelector("p");
    const ctas = [...body.querySelectorAll(".button-group a, a.button")].filter((a, i, arr) => arr.indexOf(a) === i);
    if (!heading && !description && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctas.forEach((a) => {
      const p = document2.createElement("p");
      p.append(a);
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#nav-toggle"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Found: <a href="#main-content" class="skip-link">
        "a.skip-link",
        // Global header (handled separately as nav). Found: <div class="navbar">
        "div.navbar",
        // Global footer (handled separately). Found: <footer class="footer inverse-footer">
        "footer.footer.inverse-footer",
        // Safe non-authorable elements
        "iframe",
        "link",
        "noscript",
        "script",
        "style"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].filter((attr) => attr.name.startsWith("data-astro-cid")).forEach((attr) => el.removeAttribute(attr.name));
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-split": parse,
    "columns-feature": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var PAGE_TEMPLATE = {
    "name": "home",
    "description": "WKND Trendsetters homepage: split hero, featured story, image gallery, testimonials, latest articles, FAQ and closing CTA banner",
    "urls": [
      "https://www.wknd-trendsetters.site/"
    ],
    "blocks": [
      {
        "name": "hero-split",
        "instances": [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout"
        ]
      },
      {
        "name": "columns-feature",
        "instances": [
          "#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout"
        ]
      },
      {
        "name": "cards-gallery",
        "instances": [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column"
        ]
      },
      {
        "name": "tabs-testimonial",
        "instances": [
          "#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper",
          ".tabs-wrapper"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          "#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout > div.faq-list",
          ".faq-list"
        ]
      },
      {
        "name": "hero-overlay",
        "instances": [
          "#main-content > section.section.inverse-section > div.container > div.grid-layout.desktop-1-column"
        ]
      }
    ],
    "sections": [
      {
        "id": "rc1",
        "name": "Hero intro",
        "selector": [
          "#main-content > header.section.secondary-section",
          "header.section.secondary-section"
        ],
        "style": "grey",
        "blocks": [
          "hero-split"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Featured story",
        "selector": [
          "#main-content > section.section:nth-of-type(1)"
        ],
        "style": null,
        "blocks": [
          "columns-feature"
        ],
        "defaultContent": []
      },
      {
        "id": "rc3",
        "name": "Style gallery",
        "selector": [
          "#main-content > section.section.secondary-section:nth-of-type(2)"
        ],
        "style": "grey",
        "blocks": [
          "cards-gallery"
        ],
        "defaultContent": [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center"
        ]
      },
      {
        "id": "rc4",
        "name": "Testimonials",
        "selector": [
          "#main-content > section.section:nth-of-type(3)"
        ],
        "style": null,
        "blocks": [
          "tabs-testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "rc5",
        "name": "Latest articles",
        "selector": [
          "#main-content > section.section.secondary-section:nth-of-type(4)"
        ],
        "style": "grey",
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"
        ]
      },
      {
        "id": "rc6",
        "name": "FAQ",
        "selector": [
          "#main-content > section.section:nth-of-type(5)"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          "#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout > div:first-child"
        ]
      },
      {
        "id": "rc7",
        "name": "Closing CTA",
        "selector": [
          "#main-content > section.section.inverse-section",
          "section.inverse-section"
        ],
        "style": "dark",
        "blocks": [
          "hero-overlay"
        ],
        "defaultContent": []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
