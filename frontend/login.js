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
    const response = await fetch('/api/user');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }
  
getUser().then(res => console.log(res));