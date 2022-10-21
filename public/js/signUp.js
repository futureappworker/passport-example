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
  let result = validate(
    {
      password,
    },
    {
      password: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
        length: {
          minimum: 8,
          tooShort: 'contains at least %{count} characters',
        },
      },
    },
  );
  if (!result) {
    result = { password: [] };
  }
  if (!/[a-z]/g.test(password)) {
    result.password.push('contains at least one lower character');
  }
  if (!/[A-Z]/g.test(password)) {
    result.password.push('contains at least one upper character');
  }
  if (!/[0-9]/g.test(password)) {
    result.password.push('contains at least one digit character');
  }
  if (!/[@#$%^&+=]/g.test(password)) {
    result.password.push('contains at least one special character, e.g. @#$%^&+=');
  }
  if (result.password.length === 0) {
    result = undefined;
  }
  return result;
}

function validateRetypePassword({ password, retypePassword }) {
  let result = validate(
    {
      retypePassword,
    },
    {
      retypePassword: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
      },
    },
  );
  if (!result) {
    result = { retypePassword: [] };
  }
  if (retypePassword !== password) {
    result.retypePassword.push('Passwords are not same.');
  }
  if (result.retypePassword.length === 0) {
    result = undefined;
  }
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

  const $retypePassword = $('#retypePassword');
  $retypePassword.on('input', () => {
    const password = $('#password').val();
    const text = $retypePassword.val();
    const result = validateRetypePassword({ password, retypePassword: text });
    const $invalidFeedback = $retypePassword.next('.invalid-feedback');
    if (!result) {
      $retypePassword.addClass('is-valid');
      $retypePassword.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.retypePassword.length; i += 1) {
        errorString += `<li>${result.retypePassword[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $retypePassword.addClass('is-invalid');
      $retypePassword.removeClass('is-valid');
    }
  });
}

function checkValidity() {
  const email = $('#email').val();
  const password = $('#password').val();
  const retypePassword = $('#retypePassword').val();
  if (validateEmail({ email })) {
    return false;
  }
  if (validatePassword({ password })) {
    return false;
  }
  if (validateRetypePassword({ password, retypePassword })) {
    return false;
  }
  return true;
}

function openSignUpAlertMessage({ message }) {
  const $alertMessage = $('#signUpAlertMessage');
  $alertMessage.html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
    </div>
  `);
}

function closeSignUpAlertMessage() {
  const $alertMessage = $('#signUpAlertMessage');
  $alertMessage.html('');
}

function signUp({ email, password }) {
  axios.post('/api/auth/register', {
    email,
    password,
  })
    .then(() => {
      closeSignUpAlertMessage();
      window.location.href = '/dashboard';
    })
    .catch((error) => {
      let message = 'There was a problem with your login.';
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      openSignUpAlertMessage({
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
        signUp({
          email,
          password,
        });
      }, false);
    });
}

$(() => {
  $('#email').focus();
  handleInput();
  handleFormSubmit();
});
