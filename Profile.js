// Profile.js : view/edit profile + change password for ALL users (needs common.js)

var loggedInUser = requireLogin();

function goBack() {
  goToDashboard(loggedInUser);
}

function showProfile() {
  document.getElementById("menuTitle").innerHTML = escapeText(loggedInUser.role) + " Portal";
  document.getElementById("profileRole").value = loggedInUser.role;
  document.getElementById("profileEmail").value = loggedInUser.email;
  document.getElementById("profileName").value = loggedInUser.name;
  document.getElementById("profilePhone").value = loggedInUser.phone;

  if (loggedInUser.role == "Patient") {
    document.getElementById("patientFields").classList.remove("hidden");
    document.getElementById("profileAge").value = loggedInUser.age;
    document.getElementById("profileGender").value = loggedInUser.gender;
  }
  if (loggedInUser.role == "Doctor") {
    document.getElementById("doctorFields").classList.remove("hidden");
    document.getElementById("profileSpecialization").value = loggedInUser.specialization;
  }
}

function saveProfile() {
  var fields = {
    name: document.getElementById("profileName").value,
    phone: document.getElementById("profilePhone").value,
    age: document.getElementById("profileAge").value,
    gender: document.getElementById("profileGender").value,
    specialization: document.getElementById("profileSpecialization").value
  };

  var error = saveUserProfile(loggedInUser.email, fields);
  if (error != "") {
    alert(error);
    return;
  }

  loggedInUser = getCurrentUser();
  alert("Profile saved");
}

function changePassword() {
  var error = changeUserPassword(
    loggedInUser.email,
    document.getElementById("oldPassword").value,
    document.getElementById("newPassword").value,
    document.getElementById("confirmPassword").value
  );

  if (error != "") {
    alert(error);
    return;
  }

  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
  alert("Password changed");
}

if (loggedInUser != null) {
  showProfile();
}
