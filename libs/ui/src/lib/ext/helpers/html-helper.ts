export function getHtmlElementId(element: HTMLElement) {
  if (!element.getAttribute('id')) {
    element.setAttribute('id', crypto.randomUUID());
  }

  return element.getAttribute('id');
}
