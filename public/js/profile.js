let state = {
  name: '',
};

function updateName({ name }) {
  const token = globalTool.getCookie('token');
  const id = $('#userId').val();
  return axios.post(`/api/users/${id}/updateName`, { name }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handleNameTextClick() {
  const $nameText = $('.name-text');
  const $editNameForm = $('.edit-name-form');
  const $name = $('input[name="name"]');
  $nameText.click(() => {
    $nameText.addClass('d-none');
    $editNameForm.removeClass('d-none');
    $name.focus();
    $name.val('').val(state.name);
    $name.get(0).setSelectionRange(0, state.name.length);
  });
}

function handleCancelEditNameButtonClick() {
  const $cancelEditNameButton = $('.cancel-edit-name-button');
  const $nameText = $('.name-text');
  const $editNameForm = $('.edit-name-form');
  $cancelEditNameButton.click(() => {
    const $name = $('input[name="name"]');
    $name.val(state.name);
    $nameText.removeClass('d-none');
    $editNameForm.addClass('d-none');
  });
}

function handleEditNameFormSubmit() {
  const $editNameForm = $('.edit-name-form');
  $editNameForm.submit((e) => {
    e.preventDefault();
    const $name = $('input[name="name"]');
    const name = $name.val().trim();
    updateName({ name })
      .then(() => {
        window.location.reload();
      }, (err) => {
        globalTool.toastMessage.addMessage({
          message: err.response.data.message,
        });
      });
  });
}

function handleName() {
  const isCanEdit = $('#isCanEdit').val();

  state = {
    ...state,
    name: $('input[name="name"]').val(),
  };

  if (isCanEdit) {
    handleNameTextClick();
    handleCancelEditNameButtonClick();
    handleEditNameFormSubmit();
  }
}

function handleEmailVerificationForm() {
  const $emailVerificationForm = $('#emailVerificationForm');
  $emailVerificationForm.submit((e) => {
    e.preventDefault();

    const token = globalTool.getCookie('token');
    const email = $emailVerificationForm.find('input[name="email"]').val();

    axios.post('/api/users/sendEmailVerificationForEmail', { email }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        globalTool.openSuccessModal({
          title: 'Send Email Verification',
          message: `
            ${response.data.message}
            <br />
            Please go to the mailbox to receive.
          `,
        });
      }, (err) => {
        let parsedQueryString = globalTool.getParsedQueryString();
        parsedQueryString = { ...parsedQueryString, 'alert-message': err.response.data.message };
        const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
        globalTool.updateQuerystring({ queryString: newQueryString });
        window.location.reload();
      });
  });
}

$(() => {
  handleName();

  handleEmailVerificationForm();
});
