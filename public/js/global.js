function getParsedQueryString() {
  const parsedQueryString = {};
  let hashes = {};
  if (/[?]/g.test(window.location.href)) {
    hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i += 1) {
      if (/[=]/g.test(hashes[i])) {
        const [key, value] = hashes[i].split('=');
        parsedQueryString[key] = value;
      }
    }
  }
  return parsedQueryString;
}

function stringifyQuerystring({ parsedQueryString = {} } = {}) {
  const keyValuePairs = [];
  Object.keys(parsedQueryString).forEach((prop) => {
    const key = prop;
    const value = parsedQueryString[prop];
    keyValuePairs.push(`${key}=${value}`);
  });
  if (keyValuePairs.length === 0) {
    return '';
  }
  return keyValuePairs.join('&');
}

function updateQuerystring({ queryString = '' } = {}) {
  const pageUrl = `?${queryString}`;
  window.history.pushState('', '', pageUrl);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
}

function openSuccessModal(payload) {
  const {
    title = 'Tip Message',
    message = 'Success.',
    okButtonText = 'Ok',
  } = payload;
  const bodyHtml = `
    <div id="successModal" class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="close-modal-button btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              ${message}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="close-modal-button btn btn-primary">
              ${okButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  $('body').append(bodyHtml);

  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();

  const $successModal = $('#successModal');
  const $closeModalButtons = $successModal.find('.close-modal-button');
  $closeModalButtons.bind('click.closeEvents', () => {
    $closeModalButtons.unbind('.closeEvents');
    successModal.hide();
    $successModal.remove();
  });
}

const toastMessage = {
  autohide: true,
  setup: () => {
    $('body').append(`
      <div class="toast-container position-fixed top-0 end-0 p-3">
      </div>
    `);
  },
  addMessage: ({ message }) => {
    const htmlString = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img src="https://via.placeholder.com/20x20" class="rounded me-2" alt="toast icon">
          <strong class="me-auto">Tip</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          >
          </button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;
    $('.toast-container').append(
      htmlString,
    );
    if (toastMessage.autohide) {
      setTimeout(() => {
        toastMessage.remove();
      }, 4000);
    }
  },
  remove: () => {
    const $toasts = $('.toast-container .toast');
    $toasts.first().remove();
  },
};

// eslint-disable-next-line
const globalTool = {
  getParsedQueryString,
  stringifyQuerystring,
  updateQuerystring,
  getCookie,
  openSuccessModal,
  toastMessage,
};

$(() => {
  // init bootstrap tooltips
  $('[data-bs-toggle="tooltip"]').tooltip();

  // toastMessage setup
  globalTool.toastMessage.setup();
});
