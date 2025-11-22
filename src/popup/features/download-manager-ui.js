/* globals chrome */

import { eventTypes } from 'Statics/index.js';
import { getCurrentTab } from 'Utilities/index.js';
import renderDownloadForm from '../components/download-form.js';

class DownloadManagerUI {
  constructor() {
    this.currentProgress = 0;
    this.downloadStatus = 'idle'; // 'idle', 'downloading', 'zipping', 'completed'
    this.fileAmount = 0;
    this.pollInterval = 0;
  }

  async init() {
    const data = await this.getDoujinMetadata();

    renderDownloadForm(data, this.handleFormSubmit);
  }

  async getDoujinMetadata() {
    const activeTab = await getCurrentTab();

    const payload = {
      type: eventTypes.GET_DOUJIN_METADATA,
    };
    const response = await chrome.tabs.sendMessage(activeTab.id, payload);

    return response;
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const activeTab = await getCurrentTab();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      type: eventTypes.START_IMAGE_SCRAP,
      data: {
        title: data.title,
      },
    };

    const response = await chrome.tabs.sendMessage(activeTab.id, payload);
    console.log(
      '🚀 ~ DownloadManagerUI ~ handleFormSubmit ~ imageURLs:',
      response?.data?.imageURLs,
    );
  }
}

export default DownloadManagerUI;
