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

$(() => {
  const parsedQueryString = getParsedQueryString();
  const message = parsedQueryString['alert-message'];
  if (message) {
    delete parsedQueryString['alert-message'];
    const newQueryString = stringifyQuerystring({ parsedQueryString });
    updateQuerystring({ queryString: newQueryString });

    $('body').append(`
      <div
        id="alertMessage"
        class="position-fixed start-0 top-0 end-0 m-3 alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <strong>Tip!</strong>
        <span>${decodeURI(message)}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `);

    setTimeout(() => {
      const alertMessage = document.querySelector('#alertMessage');
      const alert = new bootstrap.Alert(alertMessage);
      alert.close();
    }, 3000);
  }
});
