const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!identifier || !password) {
    alert("Please fill all fields");
    return;
  }

  // TEMP: simulate successful login
  const user = {
    username: identifier,
    loggedIn: true,
  };

  // Save session
  localStorage.setItem("user", JSON.stringify(user));

  // Redirect to app
  window.location.href = "../app/app.html";
});
