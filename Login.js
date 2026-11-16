// Login.js : login + registration page for all 4 users (needs common.js)

// already logged in -> go straight to the user's own page
var alreadyLoggedIn = getCurrentUser();
if (alreadyLoggedIn != null) {
  goToDashboard(alreadyLoggedIn);
}

function showScreen(screenId) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("registerScreen").classList.add("hidden");
  document.getElementById(screenId).classList.remove("hidden");
}

function toggleRoleFields() {
  var role = document.getElementById("regRole").value;
  document.getElementById("patientFields").classList.add("hidden");
  document.getElementById("doctorFields").classList.add("hidden");

  if (role == "Patient") {
    document.getElementById("patientFields").classList.remove("hidden");
  }
  if (role == "Doctor") {
    document.getElementById("doctorFields").classList.remove("hidden");
  }
}

function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  if (email == "" || password == "") {
    alert("Please enter email and password");
    return;
  }

  var user = loginUser(email, password);
  if (user == null) {
    alert("Wrong email or password");
    return;
  }
  goToDashboard(user);
}

function register() {
  var error = registerUser({
    role: document.getElementById("regRole").value,
    name: document.getElementById("regName").value,
    email: document.getElementById("regEmail").value,
    phone: document.getElementById("regPhone").value,
    age: document.getElementById("regAge").value,
    gender: document.getElementById("regGender").value,
    specialization: document.getElementById("regSpecialization").value,
    password: document.getElementById("regPassword").value,
    confirm: document.getElementById("regConfirm").value
  });

  if (error != "") {
    alert(error);
    return;
  }

  alert("Registration successful. Please login.");
  clearRegisterForm();
  showScreen("loginScreen");
}

function clearRegisterForm() {
  var ids = ["regRole", "regName", "regEmail", "regPhone", "regAge", "regGender",
             "regSpecialization", "regPassword", "regConfirm"];
  for (var i = 0; i < ids.length; i++) {
    document.getElementById(ids[i]).value = "";
  }
  toggleRoleFields();
}
