var users = [
  { name: "Trisha Sarker", email: "patient@mail.com", phone: "01811000000", age: 22, gender: "Female", password: "123456" },
  { name: "Rahim Uddin", email: "rahim@hms.com", phone: "01911000000", age: 45, gender: "Male", password: "123456" }
];

var doctors = [
  { id: 1, name: "Dr. Ashfaq", specialization: "Medicine", days: "Sat, Mon, Wed", fee: 800 },
  { id: 2, name: "Dr. Farhana", specialization: "Cardiology", days: "Sun, Tue, Thu", fee: 1200 },
  { id: 3, name: "Dr. Imran", specialization: "Orthopedics", days: "Sat, Tue, Thu", fee: 1000 },
  { id: 4, name: "Dr. Sultana", specialization: "Gynecology", days: "Sun, Mon, Wed", fee: 1000 },
  { id: 5, name: "Dr. Kamal", specialization: "Pediatrics", days: "Mon, Tue, Thu", fee: 700 }
];

// patientEmail links each appointment to its patient
var appointments = [
  { id: 1, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-02", time: "10:00 AM", reason: "Fever and cough", status: "Completed" },
  { id: 2, patientEmail: "patient@hms.com", doctorId: 2, date: "2026-11-20", time: "05:00 PM", reason: "Chest pain checkup", status: "Approved" },
  { id: 3, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-25", time: "11:00 AM", reason: "Follow-up", status: "Pending" },
  { id: 4, patientEmail: "rahim@hms.com", doctorId: 3, date: "2026-11-22", time: "04:00 PM", reason: "Knee pain", status: "Pending" }
];

var loggedInUser = null;

function showScreen(screenId) {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("registerScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.add("hidden");
  document.getElementById(screenId).classList.remove("hidden");
}

function showPage(pageId) {
  var pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.add("hidden");
  }
  document.getElementById(pageId).classList.remove("hidden");

  if (pageId == "dashboardPage") showDashboard();
  if (pageId == "doctorsPage") showDoctors();
  if (pageId == "bookPage") showBookForm();
  if (pageId == "appointmentsPage") showAppointments();
  if (pageId == "profilePage") showProfile();
}

function findDoctor(id) {
  for (var i = 0; i < doctors.length; i++) {
    if (doctors[i].id == id) {
      return doctors[i];
    }
  }
  return null;
}

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;");
}

function todayDate() {
  var d = new Date();
  var month = String(d.getMonth() + 1);
  var day = String(d.getDate());
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return d.getFullYear() + "-" + month + "-" + day;
}

function statusBadge(status) {
  if (status == "Pending") return "<span class='orange'>Pending</span>";
  if (status == "Approved") return "<span class='blue'>Approved</span>";
  if (status == "Completed") return "<span class='green'>Completed</span>";
  return "<span class='red'>Cancelled</span>";
}

function myAppointments() {
  var list = [];
  for (var i = 0; i < appointments.length; i++) {
    if (appointments[i].patientEmail == loggedInUser.email) {
      list.push(appointments[i]);
    }
  }
  return list;
}

function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      loggedInUser = users[i];
      showScreen("appScreen");
      showPage("dashboardPage");
      return;
    }
  }
  alert("Wrong email or password");
}

function register() {
  var name = document.getElementById("regName").value;
  var email = document.getElementById("regEmail").value;
  var phone = document.getElementById("regPhone").value;
  var age = document.getElementById("regAge").value;
  var gender = document.getElementById("regGender").value;
  var password = document.getElementById("regPassword").value;
  var confirm = document.getElementById("regConfirm").value;

  if (name == "" || email == "" || phone == "" || age == "" || gender == "" || password == "") {
    alert("Please fill in all fields");
    return;
  }
  if (email.indexOf("@") == -1) {
    alert("Enter a valid email");
    return;
  }
  if (age <= 0 || age > 120) {
    alert("Enter a valid age");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }
  if (password != confirm) {
    alert("Passwords do not match");
    return;
  }
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      alert("This email is already registered");
      return;
    }
  }

  users.push({ name: name, email: email, phone: phone, age: Number(age), gender: gender, password: password });
  alert("Registration successful. Please login.");

  document.getElementById("regName").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPhone").value = "";
  document.getElementById("regAge").value = "";
  document.getElementById("regGender").value = "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regConfirm").value = "";
  showScreen("loginScreen");
}

function logout() {
  loggedInUser = null;
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  showScreen("loginScreen");
}

function showDashboard() {
  var list = myAppointments();
  var pending = 0;
  var approved = 0;
  var completed = 0;
  var next = null;
  var today = todayDate();

  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.status == "Pending") pending++;
    if (a.status == "Approved") approved++;
    if (a.status == "Completed") completed++;

    // next upcoming appointment that is still active
    if ((a.status == "Pending" || a.status == "Approved") && a.date >= today) {
      if (next == null || a.date < next.date) {
        next = a;
      }
    }
  }

  document.getElementById("welcomeText").innerHTML = "Welcome, " + escapeText(loggedInUser.name);
  document.getElementById("totalApt").innerHTML = list.length;
  document.getElementById("pendingApt").innerHTML = pending;
  document.getElementById("approvedApt").innerHTML = approved;
  document.getElementById("completedApt").innerHTML = completed;

  if (next == null) {
    document.getElementById("nextAppointment").innerHTML = "You have no upcoming appointments.";
  } else {
    var doc = findDoctor(next.doctorId);
    document.getElementById("nextAppointment").innerHTML =
      "<b>" + escapeText(doc.name) + "</b> (" + escapeText(doc.specialization) + ")<br>" +
      next.date + " at " + next.time + "<br>" + statusBadge(next.status);
  }
}

function showDoctors() {
  var search = document.getElementById("doctorSearch").value.toLowerCase();
  var html = "";

  for (var i = 0; i < doctors.length; i++) {
    var d = doctors[i];
    var text = (d.name + " " + d.specialization).toLowerCase();
    if (text.indexOf(search) == -1) {
      continue;
    }
    html += "<tr>";
    html += "<td>" + d.name + "</td>";
    html += "<td>" + d.specialization + "</td>";
    html += "<td>" + d.days + "</td>";
    html += "<td>" + d.fee + "</td>";
    html += "<td><button onclick='bookWith(" + d.id + ")'>Book</button></td>";
    html += "</tr>";
  }

  if (html == "") {
    html = "<tr><td colspan='5'>No doctors found</td></tr>";
  }
  document.getElementById("doctorsTable").innerHTML = html;
}

function bookWith(doctorId) {
  showPage("bookPage");
  document.getElementById("bookDoctor").value = doctorId;
}

function showBookForm() {
  var select = document.getElementById("bookDoctor");
  var html = "<option value=''>Select doctor</option>";

  for (var i = 0; i < doctors.length; i++) {
    var d = doctors[i];
    html += "<option value='" + d.id + "'>" + d.name + " - " + d.specialization + " (Tk " + d.fee + ")</option>";
  }
  select.innerHTML = html;
  document.getElementById("bookDate").min = todayDate();
}

function bookAppointment() {
  var doctorId = document.getElementById("bookDoctor").value;
  var date = document.getElementById("bookDate").value;
  var time = document.getElementById("bookTime").value;
  var reason = document.getElementById("bookReason").value.trim();

  if (doctorId == "" || date == "" || time == "" || reason == "") {
    alert("Please fill in all fields");
    return;
  }
  if (date < todayDate()) {
    alert("You cannot book an appointment in the past");
    return;
  }

  // the same doctor cannot have two active appointments at one time slot
  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    if (a.doctorId == doctorId && a.date == date && a.time == time && a.status != "Cancelled") {
      alert("This time slot is already booked. Please choose another time.");
      return;
    }
  }

  var newId = 1;
  if (appointments.length > 0) {
    newId = appointments[appointments.length - 1].id + 1;
  }

  appointments.push({
    id: newId,
    patientEmail: loggedInUser.email,
    doctorId: Number(doctorId),
    date: date,
    time: time,
    reason: reason,
    status: "Pending"
  });

  clearBookForm();
  alert("Appointment booked. Status: Pending");
  showPage("appointmentsPage");
}

function clearBookForm() {
  document.getElementById("bookDoctor").value = "";
  document.getElementById("bookDate").value = "";
  document.getElementById("bookTime").value = "";
  document.getElementById("bookReason").value = "";
}

function showAppointments() {
  var list = myAppointments();
  var html = "";

  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    var doc = findDoctor(a.doctorId);

    var action = "-";
    if (a.status == "Pending" || a.status == "Approved") {
      action = "<button onclick='cancelAppointment(" + a.id + ")'>Cancel</button>";
    }

    html += "<tr>";
    html += "<td>" + a.id + "</td>";
    html += "<td>" + doc.name + "</td>";
    html += "<td>" + doc.specialization + "</td>";
    html += "<td>" + a.date + "</td>";
    html += "<td>" + a.time + "</td>";
    html += "<td>" + escapeText(a.reason) + "</td>";
    html += "<td>" + statusBadge(a.status) + "</td>";
    html += "<td>" + action + "</td>";
    html += "</tr>";
  }

  if (html == "") {
    html = "<tr><td colspan='8'>You have no appointments yet</td></tr>";
  }
  document.getElementById("appointmentsTable").innerHTML = html;
}

function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) {
    return;
  }

  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    // only the owner can cancel, and only active appointments
    if (a.id == id && a.patientEmail == loggedInUser.email) {
      if (a.status == "Pending" || a.status == "Approved") {
        a.status = "Cancelled";
      }
    }
  }
  showAppointments();
}

function showProfile() {
  document.getElementById("profileName").value = loggedInUser.name;
  document.getElementById("profileEmail").value = loggedInUser.email;
  document.getElementById("profilePhone").value = loggedInUser.phone;
  document.getElementById("profileAge").value = loggedInUser.age;
  document.getElementById("profileGender").value = loggedInUser.gender;
}

function saveProfile() {
  var name = document.getElementById("profileName").value;
  var email = document.getElementById("profileEmail").value;
  var phone = document.getElementById("profilePhone").value;
  var age = document.getElementById("profileAge").value;
  var gender = document.getElementById("profileGender").value;

  if (name == "" || email == "" || phone == "" || age == "") {
    alert("Please fill in all fields");
    return;
  }
  if (email.indexOf("@") == -1) {
    alert("Enter a valid email");
    return;
  }
  if (age <= 0 || age > 120) {
    alert("Enter a valid age");
    return;
  }
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i] != loggedInUser) {
      alert("This email is already used by another account");
      return;
    }
  }

  // keep appointments linked if the email changes
  var oldEmail = loggedInUser.email;
  for (var j = 0; j < appointments.length; j++) {
    if (appointments[j].patientEmail == oldEmail) {
      appointments[j].patientEmail = email;
    }
  }

  loggedInUser.name = name;
  loggedInUser.email = email;
  loggedInUser.phone = phone;
  loggedInUser.age = Number(age);
  loggedInUser.gender = gender;
  alert("Profile saved");
}

function changePassword() {
  var oldPassword = document.getElementById("oldPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (oldPassword != loggedInUser.password) {
    alert("Current password is wrong");
    return;
  }
  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters");
    return;
  }
  if (newPassword != confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  loggedInUser.password = newPassword;
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
  alert("Password changed");
}
