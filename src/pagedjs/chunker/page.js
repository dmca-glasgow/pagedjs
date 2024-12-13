import Layout from "./layout.js";

/**
 * Render a page
 * @class
 */
export default class Page {
  constructor(pagesArea, pageTemplate, blank) {
    this.pagesArea = pagesArea;
    this.pageTemplate = pageTemplate;
    this.blank = blank;

    this.width = undefined;
    this.height = undefined;
  }

  create(template, after) {
    let clone = document.importNode(this.pageTemplate.content, true);
    this.pagesArea.appendChild(clone);

    let page = this.pagesArea.lastChild;
    let area = page.querySelector(".pagedjs_page_content");
    let size = area.getBoundingClientRect();

    area.style.columnWidth = Math.round(size.width) + "px";
    this.area = area;

    this.width = Math.round(size.width);
    this.height = Math.round(size.height);

    this.element = page;
    this.pagebox = page.querySelector(".pagedjs_pagebox");
    this.footnotesArea = page.querySelector(".pagedjs_footnote_area");
    return page;
  }

  createWrapper() {
    let wrapper = document.createElement("div");

    this.area.appendChild(wrapper);

    this.wrapper = wrapper;

    return wrapper;
  }

  index(pgnum) {
    this.position = pgnum;

    let page = this.element;

    if (this.blank) {
      page.classList.add("pagedjs_blank_page");
    }
  }

  async layout(contents, breakToken, maxChars) {

    this.clear();

    this.startToken = breakToken;

    this.layoutMethod = new Layout(this.area, maxChars);

    let renderResult = await this.layoutMethod.renderTo(this.wrapper, contents, breakToken);

    let newBreakToken = renderResult.breakToken;

    this.endToken = newBreakToken;

    return newBreakToken;
  }

  async append(contents, breakToken) {

    if (!this.layoutMethod) {
      return this.layout(contents, breakToken);
    }

    let renderResult = await this.layoutMethod.renderTo(this.wrapper, contents, breakToken);
    let newBreakToken = renderResult.breakToken;

    this.endToken = newBreakToken;

    return newBreakToken;
  }

  getByParent(ref, entries) {
    let e;
    for (var i = 0; i < entries.length; i++) {
      e = entries[i];
      if (e.dataset.ref === ref) {
        return e;
      }
    }
  }

  onOverflow(func) {
    this._onOverflow = func;
  }

  onUnderflow(func) {
    this._onUnderflow = func;
  }

  clear() {
    this.wrapper && this.wrapper.remove();
    this.createWrapper();
  }

  destroy() {
    this.element.remove();
    this.element = undefined;
    this.wrapper = undefined;
  }
}
