function handleSuccessMessage() {
  const $loadingBox = $('.loading-box');
  const $successBox = $('.success-box');

  $loadingBox.hide();
  $successBox.show();

  const $successBoxRedirectNumber = $('.success-box-redirect-number');
  const updateSuccessBoxRedirectNumber = () => {
    const number = parseInt($successBoxRedirectNumber.html(), 10);
    if (number >= 1) {
      $successBoxRedirectNumber.html(number - 1);
      setTimeout(updateSuccessBoxRedirectNumber, 1000);
      return;
    }
    window.location = '/dashboard';
  };
  setTimeout(updateSuccessBoxRedirectNumber, 1000);
}

function handleErrorMessage() {
  const $loadingBox = $('.loading-box');
  const $errorBox = $('.error-box');

  $loadingBox.hide();
  $errorBox.show();
}

function handleConfirmEmail() {
  const parsedQueryString = globalTool.getParsedQueryString();
  const {
    token,
  } = parsedQueryString;

  if (!token) {
    handleErrorMessage({
      message: 'Token not found.',
    });
  }

  axios.post('/api/users/confirmEmail', { token })
    .then((response) => {
      handleSuccessMessage({
        message: response.data.message,
      });
    }, (err) => {
      handleErrorMessage({
        message: err.response.data.message,
      });
    });
}

$(() => {
  handleConfirmEmail();
});
