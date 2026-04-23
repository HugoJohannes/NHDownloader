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
        case eventTypes.GET_DOUJIN_METADATA: {
          console.log('Getting doujin title');
          sendResponse(this.getDoujinMetadata());
          break;
        }

        case eventTypes.START_IMAGE_SCRAP: {
          const {
            data: { title, includeDoujinId },
          } = message;
          const imageURLs = this.getImageURLs();
          const payload = {
            type: eventTypes.START_IMAGE_DOWNLOAD,
            data: {
              title,
              imageURLs,
              doujinId: includeDoujinId ? this.doujinId : '',
            },
          };

          chrome.runtime.sendMessage(payload).then((response) => {
            if (response.status === 'ok') {
              const payload = {
                status: 'ok',
                data: {
                  imageURLs,
                },
              };

              sendResponse(payload);
            }
          });

          return true;
        }

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

    const imageURLs = [];

    thumbnails.forEach((thumb) => {
      const sampleImageURL = thumb.querySelector('img').src;
      const thumbnailURLPattern =
        /\/\/t(\d)\.nhentai\.net\/galleries\/(\d*)\/(\d+)t(\.\w*)/;
      const urlMatch = sampleImageURL.match(thumbnailURLPattern);
      const serverNumber = urlMatch[1];
      const galleryId = urlMatch[2];
      const pageNumber = urlMatch[3];
      const imageExt = urlMatch[4];

      const url = `https://i${serverNumber}.nhentai.net/galleries/${galleryId}/${pageNumber}${imageExt}`;

      imageURLs.push(url);
    });

    return imageURLs;
  }
}

export default ContentManager;
