import { createElement as cel } from 'Utilities/index.js';

function nonDoujinPage() {
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
        cel('h1', { className: 'h6 text-center' }, 'NHDownloader'),
      ),
    ),
    cel(
      'div',
      { className: 'row' },
      cel(
        'div',
        { className: 'col' },
        cel(
          'p',
          { className: 'text-center mb-0' },
          'Please visit one of the doujin pages.',
        ),
      ),
    ),
  );

  mainContainer.appendChild(element);
}

export default nonDoujinPage;
