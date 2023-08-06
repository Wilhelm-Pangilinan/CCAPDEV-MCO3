const formBoxContainer = document.querySelector('.form-box-container');
/*|*******************************************************

                 REGISTER AND LOGIN FORM

*********************************************************/      
// - Get references to the form containers and links
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");

// - Function to show the registration form and hide the login form
function showRegisterForm() {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
}

// - Function to show the login form and hide the registration form
function showLoginForm() {
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
}

// - Add click event listeners to the links
registerLink.addEventListener("click", showRegisterForm);
loginLink.addEventListener("click", showLoginForm);