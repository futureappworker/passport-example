// eslint-disable-next-line
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
