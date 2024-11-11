import Chunker from "./chunker/chunker.js";

export async function chunker(content, renderTo, config) {
  const startTime = performance.now();
  const chunker = new Chunker(config);
  const fragment = fragmentFromString(content);
  const flow = await chunker.flow(fragment, renderTo);
  const endTime = performance.now();
  flow.performance = (endTime - startTime);
  return flow;
}

function fragmentFromString(content) {
  const template = document.createElement("template");
  template.innerHTML = content.innerHTML;
  return template.content;
}
