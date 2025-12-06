import { createElement as cel } from 'Utilities/index.js';

function nonNhentaiPage() {
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
        cel(
          'p',
          { className: 'text-center mb-0 py-2' },
          'Extension is not available for this page.',
        ),
      ),
    ),
  );

  mainContainer.appendChild(element);
}

export default nonNhentaiPage;
