/* globals chrome */

import { eventTypes } from 'Statics/index.js';
import { ready, sanitizeFileTitle, getCurrentTab } from 'Utilities/index.js';
import renderDownloadForm from './components/download-form.js';

import DownloadManagerUI from './features/download-manager-ui.js';

import './scss/main.scss';

async function start() {
  const downloadManagerUI = new DownloadManagerUI();

  downloadManagerUI.init();
}

// async function start() {
//   const data = await getDoujinMetadata();

//   renderDownloadForm(data, handleFormSubmit);
// }

// async function getDoujinMetadata() {
//   const activeTab = await getCurrentTab();

//   const payload = {
//     type: eventTypes.GET_DOUJIN_METADATA,
//   };
//   const response = await chrome.tabs.sendMessage(activeTab.id, payload);

//   return response;
// }

// async function handleFormSubmit(event) {
//   event.preventDefault();

//   const activeTab = await getCurrentTab();

//   const formData = new FormData(this);
//   const data = Object.fromEntries(formData.entries());

//   // data.includeCode = formData.get('includeCode') === 'on';
//   // console.log('🚀 ~ handleFormSubmit ~ data:', data);

//   const payload = {
//     type: eventTypes.START_IMAGE_SCRAP,
//     data: {
//       title: data.title,
//     },
//   };

//   const imageURLs = await chrome.tabs.sendMessage(activeTab.id, payload);
//   console.log('🚀 ~ handleFormSubmit ~ imageURLs:', imageURLs);
// }

ready(start);
