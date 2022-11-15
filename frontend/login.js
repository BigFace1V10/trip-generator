


async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    console.log(clientPrincipal);
    return clientPrincipal;
}
  
// This does not work, since await can only be called in async func
// console.log(await getUserInfo());
// getUserInfo();

async function getUser() {
  const response = await fetch('/api/userinfo');
  const payload = await response.json();
  console.log(payload.status);
  const { clientPrincipal } = payload;

  // console.log(clientPrincipal);
  return clientPrincipal;
}
  

const loginoffButton = document.getElementById('loginoff-button');

fetch('/api/userinfo')
.then(res => {
  console.log(res.status);
  if (res.status == 200) {
    console.log('logged out');
    loginoffButton.innerHTML = 'Logout';
    loginoffButton.href = '/.auth/logout';
    loginoffButton.classList.add('btn-outline-danger');
    loginoffButton.classList.remove('btn-outline-primary');
  }
  else {
    console.log('logged in');
    loginoffButton.innerHTML = 'Login';
    loginoffButton.href = '/.auth/login/google';
    loginoffButton.classList.add('btn-outline-primary');
    loginoffButton.classList.remove('btn-outline-danger');
  }
});