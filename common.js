// ===== common.js : shared by ALL 4 users (Administrator, Doctor, Patient, Pharmacist) =====
// Put this file in the same folder as every HTML page and load it BEFORE the page's own JS.

// Where each role goes after login. Change a file name here if your teammate names it differently.
var ROLE_PAGES = {
  Administrator: "Administrator.html",
  Doctor: "Doctor.html",
  Patient: "Patient.html",
  Pharmacist: "Pharmacist.html"
};

// ---------- simple storage helpers (data survives page changes) ----------
function getData(key, defaultValue) {
  var text = localStorage.getItem(key);
  if (text == null) {
    setData(key, defaultValue);
    return defaultValue;
  }
  return JSON.parse(text);
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- users ----------
var defaultUsers = [
  { role: "Administrator", name: "Soharab Hossain", email: "admin@hms.com", phone: "01711111111", password: "123456" },
  { role: "Doctor", name: "Dr. Ashfaq Khandaker", email: "doctor@hms.com", phone: "01722222222", specialization: "Medicine", password: "123456" },
  { role: "Patient", name: "Trisha Sarker", email: "patient@hms.com", phone: "01811000000", age: 22, gender: "Female", password: "123456" },
  { role: "Patient", name: "Rahim Uddin", email: "rahim@hms.com", phone: "01911000000", age: 45, gender: "Male", password: "123456" },
  { role: "Pharmacist", name: "Md. Ahnaf Azam Jafin", email: "pharmacist@hms.com", phone: "01711000000", password: "123456" }
];

function getUsers() {
  return getData("hms_users", defaultUsers);
}

function saveUsers(users) {
  setData("hms_users", users);
}

function findUserByEmail(email) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      return users[i];
    }
  }
  return null;
}

// ---------- validation helpers ----------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^01\d{9}$/.test(phone);
}

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;");
}

// ---------- session ----------
function getCurrentUser() {
  var email = sessionStorage.getItem("hms_session");
  if (email == null) {
    return null;
  }
  return findUserByEmail(email);
}

// Call at the top of every role page. Example: var loggedInUser = requireLogin("Patient");
// Not logged in -> goes to Login.html. Wrong role -> goes back to that user's own page.
// Call with no role (as Profile.html does) to allow any logged-in user.
function requireLogin(role) {
  var user = getCurrentUser();
  if (user == null) {
    window.location = "Login.html";
    return null;
  }
  if (role && user.role != role) {
    alert("Access denied. This page is for " + role + " users only.");
    window.location = ROLE_PAGES[user.role];
    return null;
  }
  return user;
}

function loginUser(email, password) {
  email = email.trim().toLowerCase();
  var user = findUserByEmail(email);
  if (user != null && user.password == password) {
    sessionStorage.setItem("hms_session", user.email);
    return user;
  }
  return null;
}

function logout() {
  sessionStorage.removeItem("hms_session");
  window.location = "Login.html";
}

function goToDashboard(user) {
  window.location = ROLE_PAGES[user.role];
}

// ---------- registration ----------
// info = { role, name, email, phone, age, gender, specialization, password, confirm }
// Returns "" when OK, otherwise the error message to show.
function registerUser(info) {
  var name = info.name.trim();
  var email = info.email.trim().toLowerCase();
  var phone = info.phone.trim();

  if (info.role == "" || name == "" || email == "" || phone == "" || info.password == "") {
    return "Please fill in all fields";
  }
  if (!isValidEmail(email)) {
    return "Enter a valid email";
  }
  if (!isValidPhone(phone)) {
    return "Enter a valid 11-digit phone number (e.g. 01711000000)";
  }
  if (info.role == "Patient") {
    if (info.age == "" || info.gender == "") {
      return "Please enter age and gender";
    }
    if (info.age <= 0 || info.age > 120) {
      return "Enter a valid age";
    }
  }
  if (info.role == "Doctor" && info.specialization.trim() == "") {
    return "Please enter your specialization";
  }
  if (info.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (info.password != info.confirm) {
    return "Passwords do not match";
  }
  if (findUserByEmail(email) != null) {
    return "This email is already registered";
  }

  var user = { role: info.role, name: name, email: email, phone: phone, password: info.password };
  if (info.role == "Patient") {
    user.age = Number(info.age);
    user.gender = info.gender;
  }
  if (info.role == "Doctor") {
    user.specialization = info.specialization.trim();
  }

  var users = getUsers();
  users.push(user);
  saveUsers(users);
  return "";
}

// ---------- profile ----------
// fields = { name, phone, age, gender, specialization }  (email is the login ID, so it cannot change)
function saveUserProfile(email, fields) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email != email) {
      continue;
    }
    var name = fields.name.trim();
    var phone = fields.phone.trim();

    if (name == "" || phone == "") {
      return "Please fill in all fields";
    }
    if (!isValidPhone(phone)) {
      return "Enter a valid 11-digit phone number (e.g. 01711000000)";
    }
    if (users[i].role == "Patient") {
      if (fields.age == "" || fields.age <= 0 || fields.age > 120) {
        return "Enter a valid age";
      }
      users[i].age = Number(fields.age);
      users[i].gender = fields.gender;
    }
    if (users[i].role == "Doctor") {
      if (fields.specialization.trim() == "") {
        return "Please enter your specialization";
      }
      users[i].specialization = fields.specialization.trim();
    }

    users[i].name = name;
    users[i].phone = phone;
    saveUsers(users);
    return "";
  }
  return "User not found";
}

// ---------- change password ----------
function changeUserPassword(email, oldPassword, newPassword, confirmPassword) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email != email) {
      continue;
    }
    if (oldPassword != users[i].password) {
      return "Current password is wrong";
    }
    if (newPassword.length < 6) {
      return "New password must be at least 6 characters";
    }
    if (newPassword != confirmPassword) {
      return "New passwords do not match";
    }
    if (newPassword == oldPassword) {
      return "New password must be different from the current password";
    }
    users[i].password = newPassword;
    saveUsers(users);
    return "";
  }
  return "User not found";
}
