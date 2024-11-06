import Chunker from "./chunker/chunker.js";
import { initializeHandlers } from "./utils/handlers.js";

export function createPreviewer() {
  const chunker = new Chunker(undefined, undefined, {});
  return {
    async preview(content, renderTo) {
      initializeHandlers(chunker, this);
      const startTime = performance.now();
      const wrapped = wrapContent(content);
      const flow = await chunker.flow(wrapped, renderTo);
      const endTime = performance.now();
      flow.performance = (endTime - startTime);
      return flow;
    },
    destroy() {
      chunker.destroy()
    }
  }
}

function wrapContent(content) {
  const body = document.querySelector("body");
  const template = document.createElement("template");
  template.dataset.ref = "pagedjs-content";
  template.innerHTML = content.innerHTML;
  body.appendChild(template);
  return template.content;
}
