/* globals chrome */

import { eventTypes } from 'Statics/index.js';

import DownloadManagerBackground from './features/download-manager-background.js';

function start() {
  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   const { type } = message;

  //   switch (type) {
  //     case eventTypes.START_IMAGE_DOWNLOAD: {
  //       console.log('Starting image downloads...');
  //       console.log('Background START_IMAGE_DOWNLOAD payload:', message);
  //       sendResponse({ status: 'ok' });
  //       break;
  //     }

  //     default:
  //       break;
  //   }
  // });

  const downloadManager = new DownloadManagerBackground();

  downloadManager.init();
}

start();
