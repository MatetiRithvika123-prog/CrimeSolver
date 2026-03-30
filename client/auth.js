// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener("submit",function(e) {

e.preventDefault();

const email = loginForm[0].value;
const password = loginForm[1].value;

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
alert("No account found. Please register.");
return;
}

if (user.email === email && user.password === password) {

//localStorage.setItem("loggedIn", true);

window.location.href = "index.html"; // open your main page

} else {

alert("Invalid email or password");

}

});

}

// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {

signupForm.addEventListener("submit", (e) => {

e.preventDefault();

const name = signupForm[0].value;
const email = signupForm[1].value;
const password = signupForm[2].value;

const user = { name, email, password };

localStorage.setItem("user", JSON.stringify(user));

alert("Account created. Please login.");

window.location.href = "login.html";

});

}
// SHOW USERNAME
const user = JSON.parse(localStorage.getItem("user"));
const usernameDisplay = document.getElementById("usernameDisplay");

if (user && usernameDisplay) {
usernameDisplay.innerText = "Welcome, " + user.name;
}

// LOGOUT
function logout() {
localStorage.removeItem("loggedIn");
window.location.href = "login.html";
}