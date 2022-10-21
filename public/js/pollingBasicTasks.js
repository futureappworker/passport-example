function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function refreshToken() {
  const token = getCookie('token');
  if (token) {
    axios.post('/api/auth/refreshToken', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
      })
      .catch((error) => {
        document.location.href = `/sign-in?alert-message=${error.response.data.message}`;
      });
  }
}

$(() => {
  // every 15 minutes, refresh token
  setInterval(() => {
    refreshToken();
  }, 15 * 60 * 1000);
});
