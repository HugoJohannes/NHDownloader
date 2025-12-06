import { ready } from 'Utilities/index.js';

import DownloadManagerUI from './features/download-manager-ui.js';

import './scss/main.scss';

async function start() {
  const downloadManagerUI = new DownloadManagerUI();

  downloadManagerUI.init();
}

ready(start);
