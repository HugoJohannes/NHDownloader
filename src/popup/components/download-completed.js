import { createElement as cel } from 'Utilities/index.js';

function downloadCompleted({ handleClose }) {
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
        cel('p', { className: 'text-center mb-2' }, 'Download completed'),
      ),
    ),
    cel(
      'div',
      { className: 'row' },
      cel(
        'div',
        { className: 'col' },
        cel(
          'button',
          {
            className: 'btn btn-primary d-block mx-auto',
            type: 'button',
            onClick: handleClose,
          },
          'Close',
        ),
      ),
    ),
  );

  mainContainer.appendChild(element);
}

export default downloadCompleted;
