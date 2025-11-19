/* globals chrome */

import { eventTypes } from 'Statics/index.js';
import { ready, sanitizeFileTitle, getCurrentTab } from 'Utilities/index.js';
import renderDownloadForm from './components/download-form.js';

import './scss/main.scss';

async function start() {
  const data = await getDoujinMetadata();

  renderDownloadForm(data, handleFormSubmit);
}

async function getDoujinMetadata() {
  const activeTab = await getCurrentTab();

  const response = await chrome.tabs.sendMessage(activeTab.id, {
    type: eventTypes.GET_DOUJIN_METADATA,
  });

  return response;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  data.includeCode = formData.get('includeCode') === 'on';
  console.log('🚀 ~ handleFormSubmit ~ data:', data);
}

ready(start);
