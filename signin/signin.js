const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  // get existing users
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // check if email already exists
  const exists = users.find(user => user.email === email);
  if (exists) {
    alert("Account already exists with this email");
    return;
  }

  // create user
  const newUser = {
    name,
    email,
    password
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");

  // redirect to login
  window.location.href = "../app/app.html";
});
