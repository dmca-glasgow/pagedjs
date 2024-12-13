import Queue from "../utils/queue.js";
import * as breaks from "../modules/breaks.js";
import * as headerFooter from "../modules/header-footer.js";

import { OverflowContentError } from "./renderresult.js";
import { TEMPLATE } from "./template.js";
import Page from "./page.js";
import ContentParser from "./parser.js";

const MAX_PAGES = false;
const MAX_LAYOUTS = false;

export default class Chunker {
  constructor(config) {
    this.config = config;

    this.pages = [];
    this.total = 0;

    this.q = new Queue(this);
    this.stopped = false;
    this.rendered = false;

    this.charsPerBreak = [];
    this.maxChars;
  }

  setup(renderTo) {
    const previousPagesArea = renderTo.querySelector('.pagedjs_pages')
    if (previousPagesArea) {
      previousPagesArea.remove()
    }

    const previousAtPage = renderTo.querySelector('#at-page')
    if (previousAtPage) {
      previousAtPage.remove()
    }

    const previousRenderArea = renderTo.querySelector('#pagedjs_render_area')
    if (previousRenderArea) {
      previousRenderArea.remove()
    }

    const size = this.config.paper.selectedSize
    const paper = this.config.paper.sizes[size]

    this.style = document.createElement("style");
    this.style.id = 'at-page'
    this.style.innerHTML = `@page { size: ${size}; margin: 0; padding: 0; }`
    renderTo.appendChild(this.style);

    this.pageRenderArea = document.createElement("div");
    this.pageRenderArea.id = 'pagedjs_render_area'
    this.pageRenderArea.style.setProperty('--pagedjs-width', paper.width);
    this.pageRenderArea.style.setProperty('--pagedjs-height', paper.height);
    renderTo.appendChild(this.pageRenderArea);

    this.pagesArea = document.createElement("div");
    this.pagesArea.classList.add("pagedjs_pages");
    this.pagesArea.style.setProperty('--pagedjs-width', paper.width);
    this.pagesArea.style.setProperty('--pagedjs-height', paper.height);
    renderTo.appendChild(this.pagesArea);

    this.pageTemplate = document.createElement("template");
    this.pageTemplate.innerHTML = TEMPLATE;
  }

  afterParsed(parsed) {
    breaks.afterParsed(parsed, this.config.breaks)
  }

  afterPageLayout(fragment, page) {
    breaks.afterPageLayout(fragment, page)
    headerFooter.afterPageLayout(fragment, this.config.headerFooter, this.total)
    this.pageRenderArea.removeChild(fragment)
    this.pagesArea.append(fragment)
    // fragment.classList.remove('loading')
  }

  afterRendered(total) {
    headerFooter.afterRendered(this.pagesArea, this.config.headerFooter, total)
  }

  async flow(content, renderTo) {
    let parsed = new ContentParser(content);
    this.source = parsed;
    this.breakToken = undefined;
    this.setup(renderTo);

    this.afterParsed(parsed)

    let rendered = await this.render(parsed, this.breakToken);

    while (rendered.canceled) {
      this.start();
      rendered = await this.render(parsed, this.breakToken);
    }

    this.rendered = true;

    this.afterRendered(this.total)

    return this;
  }

  async render(parsed, startAt) {
    let renderer = this.layout(parsed, startAt);
    let done = false;
    let result;
    let loops = 0;

    while (!done) {
      result = await this.q.enqueue(() => this.renderAsync(renderer));
      done = result.done;
      if(MAX_LAYOUTS) {
        loops += 1;
        if (loops >= MAX_LAYOUTS) {
          this.stop();
          break;
        }
      }
    }

    return result;
  }

  start() {
    this.rendered = false;
    this.stopped = false;
  }

  stop() {
    this.stopped = true;
  }

  async renderAsync(renderer) {
    if (this.stopped) {
      return { done: true, canceled: true };
    }
    let result = await renderer.next();
    if (this.stopped) {
      return { done: true, canceled: true };
    } else {
      return result;
    }
  }

  async handleBreaks(node, force) {
    let currentPage = this.total + 1;
    let currentPosition = currentPage % 2 === 0 ? "left" : "right";
    // TODO: Recto and Verso should reverse for rtl languages
    let currentSide = currentPage % 2 === 0 ? "verso" : "recto";
    let previousBreakAfter;
    let breakBefore;
    let page;

    if (currentPage === 1) {
      return;
    }

    if (node &&
        typeof node.dataset !== "undefined" &&
        typeof node.dataset.previousBreakAfter !== "undefined") {
      previousBreakAfter = node.dataset.previousBreakAfter;
    }

    if (node &&
        typeof node.dataset !== "undefined" &&
        typeof node.dataset.breakBefore !== "undefined") {
      breakBefore = node.dataset.breakBefore;
    }

    if (force) {
      page = this.addPage(true);
    } else if( previousBreakAfter &&
        (previousBreakAfter === "left" || previousBreakAfter === "right") &&
        previousBreakAfter !== currentPosition) {
      page = this.addPage(true);
    } else if( previousBreakAfter &&
        (previousBreakAfter === "verso" || previousBreakAfter === "recto") &&
        previousBreakAfter !== currentSide) {
      page = this.addPage(true);
    } else if( breakBefore &&
        (breakBefore === "left" || breakBefore === "right") &&
        breakBefore !== currentPosition) {
      page = this.addPage(true);
    } else if( breakBefore &&
        (breakBefore === "verso" || breakBefore === "recto") &&
        breakBefore !== currentSide) {
      page = this.addPage(true);
    }

    if (page) {
      this.afterPageLayout(page.element, page)
    }
  }

  async *layout(content, startAt) {
    let breakToken = startAt || false;
    let tokens = [];

    while (breakToken !== undefined && (MAX_PAGES ? this.total < MAX_PAGES : true)) {

      if (breakToken && breakToken.node) {
        await this.handleBreaks(breakToken.node);
      } else {
        await this.handleBreaks(content.firstChild);
      }

      let page = this.addPage();

      // Layout content in the page, starting from the breakToken
      breakToken = await page.layout(content, breakToken, this.maxChars);

      // THIS IS EACH CHUNKED PAGE
      // console.log(page.pagebox.innerHTML)

      if (breakToken) {
        let newToken = breakToken.toJSON(true);
        if (tokens.lastIndexOf(newToken) > -1) {
          // loop
          let err = new OverflowContentError("Layout repeated", [breakToken.node]);
          console.error("Layout repeated at: ", breakToken.node);
          return err;
        } else {
          tokens.push(newToken);
        }
      }

      this.afterPageLayout(page.element, page)
      this.recoredCharLength(page.wrapper.textContent.length);

      yield breakToken;

      // Stop if we get undefined, showing we have reached the end of the content
    }
  }

  recoredCharLength(length) {
    if (length === 0) {
      return;
    }

    this.charsPerBreak.push(length);

    // Keep the length of the last few breaks
    if (this.charsPerBreak.length > 4) {
      this.charsPerBreak.shift();
    }

    this.maxChars = this.charsPerBreak.reduce((a, b) => a + b, 0) / (this.charsPerBreak.length);
  }

  removePages(fromIndex = 0) {
    if (fromIndex >= this.pages.length) {
      return;
    }

    // Remove pages
    for (let i = fromIndex; i < this.pages.length; i++) {
      this.pages[i].destroy();
    }

    if (fromIndex > 0) {
      this.pages.splice(fromIndex);
    } else {
      this.pages = [];
    }

    this.total = this.pages.length;
  }

  addPage(blank) {
    let lastPage = this.pages[this.pages.length - 1];
    // Create a new page from the template
    let page = new Page(this.pageRenderArea, this.pageTemplate, blank);

    this.pages.push(page);

    // Create the pages
    page.create(undefined, lastPage && lastPage.element);

    page.index(this.total);

    if (!blank) {
      // Listen for page overflow
      page.onOverflow((overflowToken) => {
        console.warn("overflow on", page.id, overflowToken);

        // Only reflow while rendering
        if (this.rendered) {
          return;
        }

        let index = this.pages.indexOf(page) + 1;

        // Stop the rendering
        this.stop();

        // Set the breakToken to resume at
        this.breakToken = overflowToken;

        // Remove pages
        this.removePages(index);

        if (this.rendered === true) {
          this.rendered = false;

          this.q.enqueue(async () => {

            this.start();

            await this.render(this.source, this.breakToken);

            this.rendered = true;

          });
        }


      });

      // page.onUnderflow((overflowToken) => {
      // 	console.log("underflow on", page.id, overflowToken);
      // 	// page.append(this.source, overflowToken);
      // });
    }

    this.total = this.pages.length;

    return page;
  }

  async clonePage(originalPage) {
    let lastPage = this.pages[this.pages.length - 1];

    let page = new Page(this.pagesArea, this.pageTemplate, false);

    this.pages.push(page);

    // Create the pages
    page.create(undefined, lastPage && lastPage.element);

    page.index(this.total);

    this.afterPageLayout(page.element, page)
  }

  loadFonts() {
    let fontPromises = [];
    (document.fonts || []).forEach((fontFace) => {
      if (fontFace.status !== "loaded") {
        let fontLoaded = fontFace.load().then((r) => {
          return fontFace.family;
        }, (r) => {
          console.warn("Failed to preload font-family:", fontFace.family);
          return fontFace.family;
        });
        fontPromises.push(fontLoaded);
      }
    });
    return Promise.all(fontPromises).catch((err) => {
      console.warn(err);
    });
  }

  destroy() {
    this.removePages()
    this.pagesArea.remove()
    this.pageRenderArea.remove()
    this.style.remove()
  }
}
