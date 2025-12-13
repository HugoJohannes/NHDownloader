import { createElement as cel } from 'Utilities/index.js';

function downloadProgress({ data = {} }) {
  const mainContainer = document.querySelector('.main-container');

  const element = cel(
    'div',
    { className: 'container' },
    cel(
      'div',
      { className: 'row' },
      cel(
        'div',
        { className: 'col' },
        cel('p', { className: 'text-center mb-2' }, 'Downloading...'),
      ),
    ),
    cel(
      'div',
      { className: 'row' },
      cel(
        'div',
        { className: 'col' },
        cel(
          'div',
          {
            className: 'progress mb-2',
            role: 'progressbar',
            ariaLabel: 'Download progress',
            ariaValuenow: data.currentProgress,
            ariaValuemin: '0',
            ariaValuemax: '100',
          },
          cel(
            'div',
            {
              className: 'progress-bar',
              style: `width: ${data.currentProgress}%`,
            },
            `${data.currentProgress}%`,
          ),
        ),
      ),
    ),
  );

  mainContainer.appendChild(element);
}

export default downloadProgress;
