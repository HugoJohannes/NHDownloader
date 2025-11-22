/* globals chrome */

import axios from 'axios';
import JSZip from 'jszip';
import mime from 'mime/lite';

import { eventTypes } from 'Statics/index.js';

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
          const { title, imageURLs } = message.data;

          console.log('Starting image downloads...');
          console.log('Background START_IMAGE_DOWNLOAD payload:', message.data);

          this.downloadAndZip(imageURLs, title);
          sendResponse({ status: 'ok' });
          return true;
        }

        default:
          break;
      }
    });
  }

  async downloadAndZip(imageURLs, title) {
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

    // Download all images.
    const imageBlobs = [];

    for (let i = 0; i < imageURLs.length; i += 1) {
      const url = imageURLs[i];

      try {
        const response = await axios.get(url, { responseType: 'blob' });

        imageBlobs.push(response.data);
      } catch (error) {
        console.error('Download error:', error);
      }
    }

    // Zip image blobs.
    const zip = new JSZip();

    const folder = zip.folder(title);

    imageBlobs.forEach((image, index) => {
      const ext = mime.getExtension(image.type);
      const filename = `${index + 1}.${ext}`;

      folder.file(filename, image);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const dataUrl = await this.blobToDataURL(zipBlob);

    const downloadId = await chrome.downloads.download({
      url: dataUrl,
      filename: `${title}.zip`,
      saveAs: true,
    });

    // console.log('Download started with ID:', downloadId);

    // // Check the download state
    // const [download] = await chrome.downloads.search({ id: downloadId });
    // console.log('Download info:', download);
    // console.log('Actual filename:', download.filename);

    /* ===================================================================== */
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
