let state = {
  name: '',
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function updateName({ name }) {
  const token = getCookie('token');
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
        toastMessage.addMessage({
          message: err.response.data.message,
        });
      });
  });
}

$(() => {
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
});
