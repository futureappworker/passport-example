function refreshToken() {
  const token = globalTool.getCookie('token');
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
