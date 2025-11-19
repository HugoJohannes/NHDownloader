/* globals chrome */

import { eventTypes } from 'Statics/index.js';

class ContentManager {
  constructor() {
    this.init();
  }

  init() {
    // Initiate message listener.
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { type } = message;

      switch (type) {
        case eventTypes.GET_DOUJIN_METADATA:
          console.log('Getting doujin title');
          sendResponse(this.getDoujinMetadata());
          break;

        default:
          break;
      }
    });
  }

  getDoujinMetadata() {
    const titleElement = document.querySelector('h1.title');
    const prefix = titleElement.querySelector('span.before');
    const mainTitle = titleElement.querySelector('span.pretty');
    const suffix = titleElement.querySelector('span.after');

    const galleryIdElement = document.getElementById('gallery_id');
    const doujinId = Array.from(galleryIdElement.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join('')
      .trim();

    const metadata = {
      title: `${prefix.textContent}${mainTitle.textContent}${suffix.textContent}`,
      doujinId,
    };

    return metadata;
  }
}

export default ContentManager;
