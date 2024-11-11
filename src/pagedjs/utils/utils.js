export function getBoundingClientRect(element) {
  if (!element) {
    return;
  }
  let rect;
  if (typeof element.getBoundingClientRect !== "undefined") {
    rect = element.getBoundingClientRect();
  } else {
    let range = document.createRange();
    range.selectNode(element);
    rect = range.getBoundingClientRect();
  }
  return rect;
}

export function getClientRects(element) {
  if (!element) {
    return;
  }
  let rect;
  if (typeof element.getClientRects !== "undefined") {
    rect = element.getClientRects();
  } else {
    let range = document.createRange();
    range.selectNode(element);
    rect = range.getClientRects();
  }
  return rect;
}

/**
 * Generates a UUID
 * based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @returns {string} uuid
 */
export function UUID() {
  var d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// From: https://hg.mozilla.org/mozilla-central/file/tip/toolkit/modules/css-selector.js#l52

/**
 * Find the position of [element] in [nodeList].
 * @param {Element} element to check
 * @param {NodeList} nodeList to find in
 * @returns {int} an index of the match, or -1 if there is no match
 */
function positionInNodeList(element, nodeList) {
  for (let i = 0; i < nodeList.length; i++) {
    if (element === nodeList[i]) {
      return i;
    }
  }
  return -1;
}

/**
 * Creates a new pending promise and provides methods to resolve or reject it.
 * From: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#backwards_forwards_compatible
 * @returns {object} defered
 */
export function defer() {
  this.resolve = null;

  this.reject = null;

  this.id = UUID();

  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
  Object.freeze(this);
}
