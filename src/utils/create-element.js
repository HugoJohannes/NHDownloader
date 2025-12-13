function createElement(tag, attributes = {}, ...children) {
  if (tag === Fragment) {
    const fragment = document.createDocumentFragment();

    children.flat().forEach((child) => {
      fragment.appendChild(createNode(child));
    });

    return fragment;
  }

  // Create element.
  const element = document.createElement(tag);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value == null) return undefined;

      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();

        element.addEventListener(eventName, value);
      } else if (key in element) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  if (children.length > 0) {
    children.flat().forEach((child) => {
      if (child != null) {
        element.appendChild(createNode(child));
      }
    });
  }

  return element;
}

function createNode(child) {
  if (typeof child === 'string' || typeof child === 'number') {
    return document.createTextNode(child);
  } else if (typeof child === 'boolean' || child === null) {
    return document.createTextNode('');
  }

  return child;
}

const Fragment = Symbol.Fragment;

export { Fragment };

export default createElement;
