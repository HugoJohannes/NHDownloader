/* globals chrome */

import axios from 'axios';
import JSZip from 'jszip';
import mime from 'mime/lite';

import { eventTypes } from 'Statics/index.js';
import { promiseResolver } from 'Utilities/index.js';

class DownloadManagerBackground {
  constructor() {
    this.currentProgress = 0;
    this.downloadStatus = 'idle'; // 'idle', 'downloading', 'zipping', 'completed'
    this.fileAmount = 0;
  }

  init() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { type } = message;

      switch (type) {
        case eventTypes.START_IMAGE_DOWNLOAD: {
          const { imageURLs, title, doujinId } = message.data;

          console.log('Starting image downloads...');
          console.log('Background START_IMAGE_DOWNLOAD payload:', message.data);

          this.downloadAndZip(imageURLs, title, doujinId);
          sendResponse({ status: 'ok' });

          return true;
        }

        default:
          break;
      }
    });
  }

  async downloadAndZip(imageURLs, title, doujinId) {
    /* 
      1. Download all images.
      2. Receives an array of blobs.
      3. Zip the image blobs.
      4. Generate zip as a blob.
      5. Create Object URL for the zip file.
      6. Start Chrome download.
      7. Revoke Object URL.
    */

    // await this.setupOffscreenDocument('/offscreen.html');

    // Sanitize title from invalid file name characters.
    // Title base pattern: "${title} - (${doujinId})"
    // Maximum 100 characters, always.
    const titleMaxLength = doujinId !== '' ? 100 - (doujinId.length + 5) : 100;
    const safeTitle = this.sanitizeTitle(title, titleMaxLength);
    const finalTitle =
      doujinId !== '' ? `${safeTitle} - (${doujinId})` : safeTitle;

    // Download all images.
    const imageBlobs = await this.downloadImages(imageURLs);

    // Zip image blobs.
    const zipBlob = await this.generateZipAndBlob(imageBlobs, finalTitle);

    const dataUrl = await this.blobToDataURL(zipBlob);

    const [downloadId, downloadError] = await promiseResolver(
      chrome.downloads.download({
        url: dataUrl,
        filename: `${finalTitle}.zip`,
      }),
    );

    if (downloadError) {
      console.error('Chrome download error.', downloadError);
    }

    // console.log('Download started with ID:', downloadId);

    // // Check the download state
    // const [download] = await chrome.downloads.search({ id: downloadId });
    // console.log('Download info:', download);
    // console.log('Actual filename:', download.filename);

    /* ===================================================================== */
  }

  sanitizeTitle(title, maxLength = 100) {
    const defaultTitle = 'downloaded_images';

    if (!title || typeof title !== 'string') {
      return defaultTitle;
    }

    let safeTitle = title
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\//g, '_')
      .replace(/\.\./g, '')
      .replace(/^\.+/, '')
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, maxLength)
      .trim();

    if (!safeTitle || safeTitle === '.' || safeTitle === '..') {
      return defaultTitle;
    }

    safeTitle = safeTitle.replace(/[.\s]+$/, '');

    return safeTitle || defaultTitle;
  }

  async downloadImages(imageURLs) {
    const imageBlobs = [];

    for (let i = 0; i < imageURLs.length; i += 1) {
      const url = imageURLs[i];

      const [result, imageDownloadError] = await promiseResolver(
        axios.get(url, { responseType: 'blob' }),
      );

      if (imageDownloadError) {
        console.error('Image download error:', imageDownloadError);

        return undefined;
      }

      imageBlobs.push(result.data);
    }
    return imageBlobs;
  }

  async generateZipAndBlob(imageBlobs, title) {
    const zip = new JSZip();

    const folder = zip.folder(title);

    imageBlobs.forEach((image, index) => {
      const ext = mime.getExtension(image.type);
      const filename = `${index + 1}.${ext}`;

      folder.file(filename, image);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return zipBlob;
  }

  async setupOffscreenDocument(path) {
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl],
    });

    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: path,
        reasons: [chrome.offscreen.Reason.BLOBS],
        justification: 'To create Object URL on Blob data and download it.',
      });
    }
  }

  blobToDataURL(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}

export default DownloadManagerBackground;
