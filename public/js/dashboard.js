function renderUserStatistics({ userStatistics }) {
  const $userStatisticsSkeleton = $('#userStatisticsSkeleton');
  const $userStatistics = $('#userStatistics');

  const {
    userTotal,
    todayActiveUserTotal,
    lastSevenDayActiveUserAverage,
  } = userStatistics;
  const userTotalHTML = userTotal.toString().split('').map((numberString) => (
    `
      <div class="number-sprite number-${numberString} small"></div>
    `
  ));
  $('#userTotal').html(userTotalHTML);

  const todayActiveUserTotalHTML = todayActiveUserTotal.toString().split('').map((numberString) => (
    `
      <div class="number-sprite number-${numberString} small"></div>
    `
  ));
  $('#todayActiveUserTotal').html(todayActiveUserTotalHTML);

  const lastSevenDayActiveUserAverageHTML = lastSevenDayActiveUserAverage.toString().split('').map((numberString) => (
    `
      <div class="number-sprite number-${numberString} small"></div>
    `
  ));
  $('#lastSevenDayActiveUserAverage').html(lastSevenDayActiveUserAverageHTML);

  $userStatisticsSkeleton.hide();
  $userStatistics.show();
}

function getUserStatistics() {
  const token = globalTool.getCookie('token');
  if (token) {
    const params = {
      todayStart: moment().startOf('day').valueOf(),
    };
    axios.get('/api/site/getUserStatistics', { params }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const {
          userStatistics,
        } = response.data;
        renderUserStatistics({ userStatistics });
      })
      .catch(() => {
        // document.location.href = `/dashboard?alert-message=${error.response.data.message}`;
      });
  }
}

function renderUsers({ users }) {
  const $userListTableSkeleton = $('#userListTableSkeleton');
  const $userListTable = $('#userListTable');
  const $tableBody = $userListTable.find('tbody');
  let usersTrHTML = `
    <tr>
      <td colspan="4">
        No Data
      </td>
    </tr>
  `;
  if (users.length !== 0) {
    usersTrHTML = users.map((user) => `
      <tr>
        <th scope="row">
          <a href="/profile/${user.id}" target="_blank">
            ${user.id}
          </a>
        </th>
        <td>
          ${user.numberOfLogon}
        </td>
        <td>
          ${user.lastSession}
        </td>
        <td>
          ${user.signUpAt}
        </td>
      </tr>
    `);
  }
  $tableBody.html(usersTrHTML);
  $userListTableSkeleton.hide();
  $userListTable.show();
}

function renderUserListPagination(payload) {
  const {
    dataTotal,
    page,
    perPage,
  } = payload;
  const pageTotal = Math.ceil(dataTotal / perPage);

  if (page > pageTotal) {
    let parsedQueryString = globalTool.getParsedQueryString();
    parsedQueryString = { ...parsedQueryString, page: pageTotal };
    const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
    document.location.href = `/dashboard?${newQueryString}`;
    return;
  }

  let hasPrevious = false;
  let hasNext = false;
  if (page !== 1) {
    hasPrevious = true;
  }
  if (page < pageTotal) {
    hasNext = true;
  }

  const $userListPagination = $('#userListPagination');

  const hasToFirstPage = (page - 5) > 1;
  const hasToLastPage = (page + 5) < pageTotal;

  const toFirstPageBtn = hasToFirstPage ? `
    <li class="page-item">
      <a data-page="1" class="other-page-btn page-link" href="javascript: void(0)">
        1...
      </a>
    </li>
  ` : '';

  const toLastPageBtn = hasToLastPage ? `
    <li class="page-item">
      <a data-page="${pageTotal}" class="other-page-btn page-link" href="javascript: void(0)">
        ...${pageTotal}
      </a>
    </li>
  ` : '';

  let prePageBtns = '';
  for (let i = page - 1; i >= 1; i -= 1) {
    if (i < (page - 5)) {
      break;
    }
    prePageBtns = `
      <li class="page-item">
        <a data-page="${i}" class="other-page-btn page-link" href="javascript: void(0)">
          ${i}
        </a>
      </li>
      ${prePageBtns}
    `;
  }

  let nextBtns = '';
  for (let i = page + 1; i <= pageTotal; i += 1) {
    if (i > (page + 5)) {
      break;
    }
    nextBtns += `
      <li class="page-item">
        <a data-page="${i}" class="other-page-btn page-link" href="javascript: void(0)">
          ${i}
        </a>
      </li>
    `;
  }

  $userListPagination.html(`
    <li class="page-item${hasPrevious ? '' : ' disabled'}">
      <a class="previous-btn page-link" href="javascript: void(0)">Previous</a>
    </li>
    ${toFirstPageBtn}
    ${prePageBtns}
    <li class="page-item active">
      <a class="page-link" href="javascript: void(0)">
        ${page}
      </a>
    </li>
    ${nextBtns}
    ${toLastPageBtn}
    <li class="page-item">
      <a class="pagination-input-btn page-link" href="javascript: void(0)">
        <input type="text" value="${page}" />
        /
        ${pageTotal}
      </a>
    </li>
    <li class="page-item${hasNext ? '' : ' disabled'}">
      <a class="next-btn page-link" href="javascript: void(0)">Next</a>
    </li>
  `);
}

function getUserList() {
  const token = globalTool.getCookie('token');
  let parsedQueryString = globalTool.getParsedQueryString();
  let { page, perPage } = parsedQueryString;
  if (page === undefined) {
    page = 1;
  }
  if (perPage === undefined) {
    perPage = 10;
  }
  page = parseInt(page, 10);
  perPage = parseInt(perPage, 10);
  if (_.isNaN(page) || _.isNaN(perPage)) {
    page = 1;
    perPage = 10;
    parsedQueryString = { ...parsedQueryString, page, perPage };
    const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
    globalTool.updateQuerystring({ queryString: newQueryString });
  }
  if (page <= 0 || perPage <= -1) {
    page = 1;
    perPage = 10;
    parsedQueryString = { ...parsedQueryString, page, perPage };
    const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
    globalTool.updateQuerystring({ queryString: newQueryString });
  }

  const params = {
    page,
    perPage,
  };
  axios.get('/api/users', { params }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const {
        users,
        dataTotal,
        page: responsePage,
        perPage: responsePerPage,
      } = response.data;
      renderUsers({ users });
      renderUserListPagination({
        dataTotal,
        page: responsePage,
        perPage: responsePerPage,
      });
    })
    .catch(() => {
      // document.location.href = `/dashboard?alert-message=${error.response.data.message}`;
    });
}

function handleUserListPaginationClick() {
  const $userListPagination = $('#userListPagination');

  const changePageQuery = ({ page }) => {
    let parsedQueryString = globalTool.getParsedQueryString();
    parsedQueryString = { ...parsedQueryString, page };
    const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
    globalTool.updateQuerystring({ queryString: newQueryString });
  };

  $userListPagination.on('click', '.previous-btn', () => {
    const parsedQueryString = globalTool.getParsedQueryString();
    const page = parseInt(parsedQueryString.page, 10);
    changePageQuery({
      page: page - 1,
    });

    getUserList();
  });

  $userListPagination.on('click', '.next-btn', () => {
    const parsedQueryString = globalTool.getParsedQueryString();
    const page = parseInt(parsedQueryString.page, 10) || 1;
    changePageQuery({
      page: page + 1,
    });

    getUserList();
  });

  $userListPagination.on('click', '.other-page-btn', (e) => {
    const page = parseInt($(e.target).data('page'), 10);
    changePageQuery({
      page,
    });

    getUserList();
  });

  $userListPagination.on('keyup', '.pagination-input-btn input', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      let parsedQueryString = globalTool.getParsedQueryString();
      let page = parseInt($(e.target).val(), 10);

      if (_.isNaN(page)) {
        page = 1;
        parsedQueryString = { ...parsedQueryString, page };
        const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
        globalTool.updateQuerystring({ queryString: newQueryString });
      }
      if (page <= 0) {
        page = 1;
        parsedQueryString = { ...parsedQueryString, page };
        const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });
        globalTool.updateQuerystring({ queryString: newQueryString });
      }
      changePageQuery({
        page,
      });

      getUserList();
    }
  });
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
  getUserStatistics();

  handleUserListPaginationClick();
  getUserList();

  handleEmailVerificationForm();
});

function validateOldPassword({ oldPassword }) {
  let result = validate(
    {
      oldPassword,
    },
    {
      oldPassword: {
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
    result = { oldPassword: [] };
  }
  if (!/[a-z]/g.test(oldPassword)) {
    result.oldPassword.push('contains at least one lower character');
  }
  if (!/[A-Z]/g.test(oldPassword)) {
    result.oldPassword.push('contains at least one upper character');
  }
  if (!/[0-9]/g.test(oldPassword)) {
    result.oldPassword.push('contains at least one digit character');
  }
  if (!/[@#$%^&+=]/g.test(oldPassword)) {
    result.oldPassword.push('contains at least one special character, e.g. @#$%^&+=');
  }
  if (result.oldPassword.length === 0) {
    result = undefined;
  }
  return result;
}

function validateNewPassword({ newPassword }) {
  let result = validate(
    {
      newPassword,
    },
    {
      newPassword: {
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
    result = { newPassword: [] };
  }
  if (!/[a-z]/g.test(newPassword)) {
    result.newPassword.push('contains at least one lower character');
  }
  if (!/[A-Z]/g.test(newPassword)) {
    result.newPassword.push('contains at least one upper character');
  }
  if (!/[0-9]/g.test(newPassword)) {
    result.newPassword.push('contains at least one digit character');
  }
  if (!/[@#$%^&+=]/g.test(newPassword)) {
    result.newPassword.push('contains at least one special character, e.g. @#$%^&+=');
  }
  if (result.newPassword.length === 0) {
    result = undefined;
  }
  return result;
}

function validateRetypeNewPassword({ newPassword, retypeNewPassword }) {
  let result = validate(
    {
      retypeNewPassword,
    },
    {
      retypeNewPassword: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
      },
    },
  );
  if (!result) {
    result = { retypeNewPassword: [] };
  }
  if (retypeNewPassword !== newPassword) {
    result.retypeNewPassword.push('Passwords are not same new password.');
  }
  if (result.retypeNewPassword.length === 0) {
    result = undefined;
  }
  return result;
}

function handleInput() {
  const $oldPassword = $('#oldPassword');
  $oldPassword.on('input', () => {
    const text = $oldPassword.val();
    const result = validateOldPassword({ oldPassword: text });
    const $invalidFeedback = $oldPassword.next('.invalid-feedback');
    if (!result) {
      $oldPassword.addClass('is-valid');
      $oldPassword.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.oldPassword.length; i += 1) {
        errorString += `<li>${result.oldPassword[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $oldPassword.addClass('is-invalid');
      $oldPassword.removeClass('is-valid');
    }
  });

  const $newPassword = $('#newPassword');
  $newPassword.on('input', () => {
    const text = $newPassword.val();
    const result = validateNewPassword({ newPassword: text });
    const $invalidFeedback = $newPassword.next('.invalid-feedback');
    if (!result) {
      $newPassword.addClass('is-valid');
      $newPassword.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.newPassword.length; i += 1) {
        errorString += `<li>${result.newPassword[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $newPassword.addClass('is-invalid');
      $newPassword.removeClass('is-valid');
    }
  });

  const $retypeNewPassword = $('#retypeNewPassword');
  $retypeNewPassword.on('input', () => {
    const newPassword = $('#newPassword').val();
    const text = $retypeNewPassword.val();
    const result = validateRetypeNewPassword({ newPassword, retypeNewPassword: text });
    const $invalidFeedback = $retypeNewPassword.next('.invalid-feedback');
    if (!result) {
      $retypeNewPassword.addClass('is-valid');
      $retypeNewPassword.removeClass('is-invalid');
    }
    if (result) {
      let errorString = '';
      for (let i = 0; i < result.retypeNewPassword.length; i += 1) {
        errorString += `<li>${result.retypeNewPassword[i]}</li>`;
      }
      $invalidFeedback.html(`<ul>${errorString}</ul>`);
      $retypeNewPassword.addClass('is-invalid');
      $retypeNewPassword.removeClass('is-valid');
    }
  });
}

function checkValidity() {
  const oldPassword = $('#oldPassword').val();
  const newPassword = $('#newPassword').val();
  const retypeNewPassword = $('#retypeNewPassword').val();
  if (validateOldPassword({ oldPassword })) {
    return false;
  }
  if (validateNewPassword({ newPassword })) {
    return false;
  }
  if (validateRetypeNewPassword({ newPassword, retypeNewPassword })) {
    return false;
  }
  return true;
}

function openResetPasswordAlertMessage({ message }) {
  const $alertMessage = $('#resetPasswordAlertMessage');
  $alertMessage.html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${message}
    </div>
  `);
}

function closeResetPasswordAlertMessage() {
  const $alertMessage = $('#resetPasswordAlertMessage');
  $alertMessage.html('');
}

function sendResetPassword({ oldPassword, newPassword }) {
  const token = globalTool.getCookie('token');
  const id = $('#userId').val();

  axios.post(`/api/users/${id}/resetPassword`, {
    oldPassword,
    newPassword,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      closeResetPasswordAlertMessage();

      let parsedQueryString = globalTool.getParsedQueryString();
      parsedQueryString = {
        ...parsedQueryString,
        'alert-message': response.data.message,
        'alert-message-type': 'success',
      };
      const newQueryString = globalTool.stringifyQuerystring({ parsedQueryString });

      window.location.href = `/dashboard?${newQueryString}`;
    })
    .catch((error) => {
      let message = 'There was a problem with your reset password.';
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      openResetPasswordAlertMessage({
        message,
      });
    });
}

function handleResetPasswordFormSubmit() {
  const forms = document.querySelectorAll('.needs-validation');

  Array.prototype.slice.call(forms)
    .forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isValidity = checkValidity();
        if (!isValidity) {
          form.classList.add('was-validated');
          return;
        }

        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();
        sendResetPassword({
          oldPassword,
          newPassword,
        });
      }, false);
    });
}

function getResetPasswordModalHTML() {
  return `
    <div class="modal fade" id="resetPasswordModal" tabindex="-1" aria-labelledby="resetPasswordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="resetPasswordModalLabel">Reset Password</h5>
            <button type="button" class="close-modal-button btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>
              <div id="resetPasswordAlertMessage">
              </div>
              <div class="d-grid gap-2 mb-3">
                <div class="position-relative">
                  <label for="oldPassword" class="form-label">Old password</label>
                  <input class="form-control" id="oldPassword" type="password" aria-label="old password input" required />
                  <div class="invalid-feedback">
                  </div>
                </div>
                <div class="position-relative">
                  <label for="newPassword" class="form-label">New password</label>
                  <input class="form-control" id="newPassword" type="password" aria-label="new password input" required />
                  <div class="invalid-feedback">
                  </div>
                </div>
                <div class="position-relative">
                  <label for="retypeNewPassword" class="form-label">Re-enter new password</label>
                  <input class="form-control" id="retypeNewPassword" type="password" aria-label="retype new password input" required />
                  <div class="invalid-feedback">
                  </div>
                </div>
                <div class="mt-4 text-end">
                  <button type="button" class="close-modal-button btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleResetPassword() {
  const $resetPasswordButton = $('.reset-password-button');
  $resetPasswordButton.on('click', () => {
    const resetPasswordModalHTML = getResetPasswordModalHTML();

    $('body').append(resetPasswordModalHTML);

    const resetPasswordModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
    resetPasswordModal.show();

    handleInput();
    handleResetPasswordFormSubmit();

    const $resetPasswordModal = $('#resetPasswordModal');
    const $closeModalButtons = $resetPasswordModal.find('.close-modal-button');
    $closeModalButtons.bind('click.closeEvents', () => {
      $closeModalButtons.unbind('.closeEvents');
      resetPasswordModal.hide();
      $resetPasswordModal.remove();
    });
  });
}

$(() => {
  handleResetPassword();
});
