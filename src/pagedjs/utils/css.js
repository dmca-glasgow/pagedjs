export function cleanPseudoContent(el, trim = "\"' ") {
  if(el == null) return;
  return el
    .replace(new RegExp(`^[${trim}]+`), "")
    .replace(new RegExp(`[${trim}]+$`), "")
    .replace(/["']/g, match => "\\" + match)
    .replace(/[\n]/g, match => "\\00000A");
}
