function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
}

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

function renderUserStatistics({ userStatistics }) {
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
}

function getUserStatistics() {
  const token = getCookie('token');
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
}

function renderUserListPagination(payload) {
  const {
    dataTotal,
    page,
    perPage,
  } = payload;
  const pageTotal = Math.ceil(dataTotal / perPage);

  if (page > pageTotal) {
    let parsedQueryString = getParsedQueryString();
    parsedQueryString = { ...parsedQueryString, page: pageTotal };
    const newQueryString = stringifyQuerystring({ parsedQueryString });
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
  const token = getCookie('token');
  let parsedQueryString = getParsedQueryString();
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
    const newQueryString = stringifyQuerystring({ parsedQueryString });
    updateQuerystring({ queryString: newQueryString });
  }
  if (page <= 0 || perPage <= -1) {
    page = 1;
    perPage = 10;
    parsedQueryString = { ...parsedQueryString, page, perPage };
    const newQueryString = stringifyQuerystring({ parsedQueryString });
    updateQuerystring({ queryString: newQueryString });
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
    let parsedQueryString = getParsedQueryString();
    parsedQueryString = { ...parsedQueryString, page };
    const newQueryString = stringifyQuerystring({ parsedQueryString });
    updateQuerystring({ queryString: newQueryString });
  };

  $userListPagination.on('click', '.previous-btn', () => {
    const parsedQueryString = getParsedQueryString();
    const page = parseInt(parsedQueryString.page, 10);
    changePageQuery({
      page: page - 1,
    });

    getUserList();
  });

  $userListPagination.on('click', '.next-btn', () => {
    const parsedQueryString = getParsedQueryString();
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
      let parsedQueryString = getParsedQueryString();
      let page = parseInt($(e.target).val(), 10);

      if (_.isNaN(page)) {
        page = 1;
        parsedQueryString = { ...parsedQueryString, page };
        const newQueryString = stringifyQuerystring({ parsedQueryString });
        updateQuerystring({ queryString: newQueryString });
      }
      if (page <= 0) {
        page = 1;
        parsedQueryString = { ...parsedQueryString, page };
        const newQueryString = stringifyQuerystring({ parsedQueryString });
        updateQuerystring({ queryString: newQueryString });
      }
      changePageQuery({
        page,
      });

      getUserList();
    }
  });
}

$(() => {
  getUserStatistics();

  handleUserListPaginationClick();
  getUserList();
});
