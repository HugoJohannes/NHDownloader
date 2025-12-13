/* globals chrome */

import { eventTypes } from 'Statics/index.js';

(() => {
  function start() {
    console.log('Hello from Offscreen Document.');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const { type } = message;

      // switch (type) {
      //   case eventTypes.CREATE_OBJECT_URL_FOR_BLOB: {
      //     console.log('Create object URL for blob');
      //     console.log('Message:', message);
      //     console.log('Received:', message.zipBlob);
      //     console.log('Type:', message.zipBlob.constructor.name);

      //     break;
      //   }

      //   default:
      //     break;
      // }
    });
  }

  start();
})();
