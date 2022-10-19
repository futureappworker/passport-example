function validateEmail({ email }) {
  const result = validate(
    {
      email,
    },
    {
      email: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
        email: {
          message: "doesn't look like a valid email",
        },
      },
    },
  );
  return result;
}

function validatePassword({ password }) {
  const result = validate(
    {
      password,
    },
    {
      password: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
      },
    },
  );
  return result;
}

function handleInput() {
  const $email = $('#email');
  $email.on('input', () => {
    const text = $email.val();
    const result = validateEmail({ email: text });
    const $invalidFeedback = $email.next('.invalid-feedback');
    if (!result) {
      $email.addClass('is-valid');
      $email.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.email.length; i += 1) {
        errorString += `<li>${result.email[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $email.addClass('is-invalid');
      $email.removeClass('is-valid');
    }
  });

  const $password = $('#password');
  $password.on('input', () => {
    const text = $password.val();
    const result = validatePassword({ password: text });
    const $invalidFeedback = $password.next('.invalid-feedback');
    if (!result) {
      $password.addClass('is-valid');
      $password.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.password.length; i += 1) {
        errorString += `<li>${result.password[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $password.addClass('is-invalid');
      $password.removeClass('is-valid');
    }
  });
}

function checkValidity() {
  const email = $('#email').val();
  const password = $('#password').val();
  if (validateEmail({ email })) {
    return false;
  }
  if (validatePassword({ password })) {
    return false;
  }
  return true;
}

function openSignInAlertMessage({ message }) {
  const $alertMessage = $('#signInAlertMessage');
  $alertMessage.html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
    </div>
  `);
}

function closeSignInAlertMessage() {
  const $alertMessage = $('#signInAlertMessage');
  $alertMessage.html('');
}

function signIn({ email, password }) {
  axios.post('/api/auth/login', {
    email,
    password,
  })
    .then(() => {
      closeSignInAlertMessage();
      window.location.href = '/dashboard';
    })
    .catch((error) => {
      let message = 'There was a problem with your login.';
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      openSignInAlertMessage({
        message,
      });
    });
}

function handleFormSubmit() {
  const forms = document.querySelectorAll('.needs-validation');

  Array.prototype.slice.call(forms)
    .forEach((form) => {
      form.addEventListener('submit', (event) => {
        const isValidity = checkValidity();
        event.preventDefault();
        event.stopPropagation();
        if (!isValidity) {
          form.classList.add('was-validated');
          return;
        }
        const email = $('#email').val();
        const password = $('#password').val();
        signIn({
          email,
          password,
        });
      }, false);
    });
}

(() => {
  $('#email').focus();
  handleInput();
  handleFormSubmit();
})();
