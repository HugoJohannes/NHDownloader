/* globals chrome */

import { eventTypes } from 'Statics/index.js';

class ContentManager {
  constructor() {
    this.title = '';
    this.doujinId = '';

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

        case eventTypes.START_IMAGE_SCRAP:
          sendResponse(this.getImageURLs());
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
    const title = `${prefix.textContent}${mainTitle.textContent}${suffix.textContent}`;

    const galleryIdElement = document.getElementById('gallery_id');
    const doujinId = Array.from(galleryIdElement.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join('')
      .trim();

    this.title = title;
    this.doujinId = doujinId;

    const metadata = {
      title,
      doujinId,
    };

    return metadata;
  }

  getImageURLs() {
    console.log('Start image scrapping...');
    console.log('Getting image URLs...');

    const thumbnails = document.querySelectorAll('.thumb-container');
    const pageCount = thumbnails.length;

    // Get image extension.
    const sampleImageURL = thumbnails[0].querySelector('img').src;
    const thumbnailURLPattern =
      /https:\/\/t(\d)\.nhentai\.net\/galleries\/(\d*)\/.*(\.\w*)/;
    const urlMatch = sampleImageURL.match(thumbnailURLPattern);
    const serverNumber = urlMatch[1];
    const galleryId = urlMatch[2];
    const imageExt = urlMatch[3];

    const imageURLs = [];
    for (let page = 1; page <= pageCount; page += 1) {
      const url = `https://i${serverNumber}.nhentai.net/galleries/${galleryId}/${page}${imageExt}`;

      imageURLs.push(url);
    }

    return imageURLs;
  }
}

export default ContentManager;
