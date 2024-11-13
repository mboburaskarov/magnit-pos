export default function addCssToElement(element, style) {
  if (element) {
    for (const property in style) element.style[property] = style[property]
  }
}
