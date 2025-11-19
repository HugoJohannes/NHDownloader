import { createElement as cel } from 'Utilities/index.js';

function downloadForm(data = {}, handleFormSubmit) {
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
          'form',
          { onSubmit: handleFormSubmit },
          cel(
            'div',
            { className: 'mb-3' },
            cel('label', { for: 'title', className: 'form-label' }, 'Title'),
            cel('input', {
              type: 'text',
              className: 'form-control',
              id: 'title',
              name: 'title',
              value: data.title || '',
            }),
          ),
          cel(
            'div',
            {
              className: 'mb-3 form-check',
            },
            cel('input', {
              type: 'checkbox',
              className: 'form-check-input',
              id: 'includeCode',
              name: 'includeCode',
              onChange: (event) => handleIncludeCodeChange(event, data),
            }),
            cel(
              'label',
              {
                className: 'form-check-label',
                for: 'includeCode',
              },
              'Include doujin code',
            ),
          ),
          cel(
            'button',
            { type: 'submit', className: 'btn btn-primary' },
            'Download',
          ),
        ),
      ),
    ),
  );

  mainContainer.appendChild(element);
}

function handleIncludeCodeChange(event, data) {
  const includeCodeCheckbox = event.target;
  const titleInput = document.getElementById('title');

  titleInput.value = includeCodeCheckbox.checked
    ? `${data.title} - (${data.doujinId})`
    : data.title;
}

export default downloadForm;
