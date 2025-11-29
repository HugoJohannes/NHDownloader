/* globals chrome */

import { eventTypes } from 'Statics/index.js';
import { getCurrentTab } from 'Utilities/index.js';
import renderDownloadForm from '../components/download-form.js';
import renderDownloadProgress from '../components/download-progress.js';
import renderDownloadCompleted from '../components/download-completed.js';

class DownloadManagerUI {
  constructor() {
    this.currentProgress = 0;
    this.downloadedFileAmount = 0;
    this.fileAmount = 0;
    this.downloadStatus = 'idle'; // 'idle', 'downloading', 'zipping', 'completed'
    this.intervalId = 0;
    this.intervalDelay = 1000;
    this.doujinTitle = '';
    this.doujinId = '';

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async init() {
    // Initiate state according to current storage state.
    const isStateInitiated = await this.initiateState();

    if (isStateInitiated) return undefined;

    const data = await this.getDoujinMetadata();

    this.renderUI({ data, handleFormSubmit: this.handleFormSubmit });

    return undefined;
  }

  async initiateState() {
    const result = await chrome.storage.local.get([
      'currentProgress',
      'downloadedFileAmount',
      'fileAmount',
      'downloadStatus',
    ]);

    if (
      result.downloadStatus &&
      ['downloading', 'completed'].includes(result.downloadStatus)
    ) {
      this.currentProgress = result.currentProgress;
      this.downloadedFileAmount = result.downloadedFileAmount;
      this.fileAmount = result.fileAmount;
      this.downloadStatus = result.downloadStatus;

      switch (result.downloadStatus) {
        case 'downloading': {
          this.renderUI({ data: { currentProgress: result.currentProgress } });
          this.startDownloadProgressTracking();

          return true;
        }

        case 'completed': {
          this.renderUI({ handleClose: this.handlePopupClose });
          this.resetProgress();

          return true;
        }

        default:
          return false;
      }
    }

    return false;
  }

  renderUI(props) {
    const mainContainer = document.querySelector('.main-container');

    // Empty main container.
    mainContainer.innerHTML = '';

    switch (this.downloadStatus) {
      case 'idle': {
        renderDownloadForm(props);
        break;
      }

      case 'downloading': {
        renderDownloadProgress(props);
        break;
      }

      case 'completed': {
        renderDownloadCompleted(props);
        break;
      }

      default:
        break;
    }
  }

  async getDoujinMetadata() {
    const activeTab = await getCurrentTab();

    const payload = {
      type: eventTypes.GET_DOUJIN_METADATA,
    };
    const response = await chrome.tabs.sendMessage(activeTab.id, payload);

    this.doujinTitle = response.title;
    this.doujinId = response.doujinId;

    return response;
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const activeTab = await getCurrentTab();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      type: eventTypes.START_IMAGE_SCRAP,
      data: {
        title: data.title,
        includeDoujinId: data.includeDoujinId === 'on',
      },
    };

    const response = await chrome.tabs.sendMessage(activeTab.id, payload);

    if (response.status === 'ok') {
      this.startDownloadProgressTracking();
    }
  }

  handlePopupClose() {
    window.close();
  }

  startDownloadProgressTracking() {
    this.intervalId = setInterval(() => {
      chrome.storage.local
        .get([
          'currentProgress',
          'downloadedFileAmount',
          'fileAmount',
          'downloadStatus',
        ])
        .then((result) => {
          // If even one of these keys doesn't exist in the storage, then none of them are.
          if (result.currentProgress === undefined) {
            console.log('There is no download progress data in the storage.');

            return undefined;
          }

          // Apply the store state into instance state.
          this.currentProgress = result.currentProgress;
          this.downloadedFileAmount = result.downloadedFileAmount;
          this.fileAmount = result.fileAmount;
          this.downloadStatus = result.downloadStatus;

          if (this.downloadStatus === 'downloading') {
            // Render download progress page.

            this.renderUI({ data: { currentProgress: this.currentProgress } });
          }

          if (this.downloadStatus === 'zipping') {
            // Render zipping progress page.
          }

          if (this.downloadStatus === 'completed') {
            // Render completed download page and reset instance state.
            this.renderUI({ handleClose: this.handlePopupClose });
            this.resetProgress();
          }

          return undefined;
        });
    }, this.intervalDelay);
  }

  resetProgress() {
    this.currentProgress = 0;
    this.downloadedFileAmount = 0;
    this.fileAmount = 0;
    this.downloadStatus = 'idle';

    clearInterval(this.intervalId);
  }
}

export default DownloadManagerUI;
