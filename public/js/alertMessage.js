$(() => {
  const parsedQueryString = globalTool.getParsedQueryString();
  const message = parsedQueryString['alert-message'];
  const messageTypes = [
    'primary', 'secondary', 'success', 'danger', 'warning',
    'info', 'light', 'dark',
  ];
  let alertMessageType = parsedQueryString['alert-message-type'];
  const isInMessageTypes = _.findIndex(messageTypes, (item) => item === alertMessageType) !== -1;
  if (!isInMessageTypes) {
    alertMessageType = 'warning';
  }

  if (message) {
    delete parsedQueryString['alert-message'];
    const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
    globalTool.updateQuerystring({ queryString: newQueryString });

    $('body').append(`
      <div
        id="alertMessage"
        class="position-fixed start-0 top-0 end-0 m-3 alert alert-${alertMessageType} alert-dismissible fade show"
        role="alert"
      >
        <strong>Tip!</strong>
        <span>${decodeURI(message)}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);

    setTimeout(() => {
      const alertMessage = document.querySelector('#alertMessage');
      if (!alertMessage) {
        return;
      }
      const alert = new bootstrap.Alert(alertMessage);
      alert.close();
    }, 3000);
  }
});
