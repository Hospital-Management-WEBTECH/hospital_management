var defaultDoctors = [
  { id: 1, name: "Dr. Ashfaq", specialization: "Medicine", days: "Sat, Mon, Wed", fee: 800 },
  { id: 2, name: "Dr. Farhana", specialization: "Cardiology", days: "Sun, Tue, Thu", fee: 1200 },
  { id: 3, name: "Dr. Imran", specialization: "Orthopedics", days: "Sat, Tue, Thu", fee: 1000 },
  { id: 4, name: "Dr. Sultana", specialization: "Gynecology", days: "Sun, Mon, Wed", fee: 1000 },
  { id: 5, name: "Dr. Kamal", specialization: "Pediatrics", days: "Mon, Tue, Thu", fee: 700 }
];

var defaultAppointments = [
  { id: 1, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-02", time: "10:00 AM", reason: "Fever and cough", status: "Completed" },
  { id: 2, patientEmail: "patient@hms.com", doctorId: 2, date: "2026-11-20", time: "05:00 PM", reason: "Chest pain checkup", status: "Approved" },
  { id: 3, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-25", time: "11:00 AM", reason: "Follow-up", status: "Pending" },
  { id: 4, patientEmail: "rahim@hms.com", doctorId: 3, date: "2026-11-22", time: "04:00 PM", reason: "Knee pain", status: "Pending" }
];

var doctors = [];
var appointments = [];
var editingDoctorId = 0;
var editingPatientEmail = "";

var pageTitles = {
  dashboardPage: "Administrator workspace",
  doctorsPage: "Manage Doctors",
  patientsPage: "Manage Patients",
  appointmentsPage: "Manage Appointments"
};

// No login data is shared between pages any more, so this page uses its demo user
// and keeps its data in memory (it resets when the page is reloaded).
var loggedInUser = { role: "Administrator", name: "Soharab Hossain", email: "admin@hms.com", phone: "01711111111" };

function getData(key, defaultValue) {
  return defaultValue;
}

function setData(key, value) {
}

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/"/g, "&quot;");
}

function logout() {
  window.location = "Login.html";
}

var users = [
  { role: "Administrator", name: "Soharab Hossain", email: "admin@hms.com", phone: "01711111111", password: "123456" },
  { role: "Doctor", name: "Dr. Ashfaq Khandaker", email: "doctor@hms.com", phone: "01722222222", specialization: "Medicine", doctorId: 1, password: "123456" },
  { role: "Patient", name: "Trisha Sarker", email: "patient@hms.com", phone: "01811000000", age: 22, gender: "Female", password: "123456" },
  { role: "Patient", name: "Rahim Uddin", email: "rahim@hms.com", phone: "01911000000", age: 45, gender: "Male", password: "123456" },
  { role: "Pharmacist", name: "Md. Ahnaf Azam Jafin", email: "pharmacist@hms.com", phone: "01711000000", password: "123456" }
];

function getUsers() {
  return users;
}

function saveUsers(list) {
  users = list;
}

function findUserByEmail(email) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      return users[i];
    }
  }
  return null;
}

function saveUserProfile(email, fields) {
  var user = findUserByEmail(email);
  if (user == null) {
    return "User not found";
  }
  if (fields.name.trim() == "" || fields.phone.trim() == "") {
    return "Please fill in all fields";
  }
  if (!/^01\d{9}$/.test(fields.phone.trim())) {
    return "Enter a valid 11-digit phone number (e.g. 01711000000)";
  }
  if (fields.age == "" || fields.age <= 0 || fields.age > 120) {
    return "Enter a valid age";
  }
  user.name = fields.name.trim();
  user.phone = fields.phone.trim();
  user.age = Number(fields.age);
  user.gender = fields.gender;
  return "";
}


function refreshData() {
  doctors = getData("hms_doctors", defaultDoctors);
  appointments = getData("hms_appointments", defaultAppointments);
  users = getUsers();
}

function saveDoctors() {
  setData("hms_doctors", doctors);
}

function saveAppointments() {
  setData("hms_appointments", appointments);
}

function showPage(pageId) {
  refreshData();

  var pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.add("hidden");
  }
  document.getElementById(pageId).classList.remove("hidden");

  // highlight the selected sidebar link
  var links = ["dashboard", "doctors", "patients", "appointments"];
  for (var j = 0; j < links.length; j++) {
    document.getElementById(links[j] + "Link").classList.remove("active");
  }
  document.getElementById(pageId.replace("Page", "Link")).classList.add("active");

  document.getElementById("pageTitle").innerHTML = pageTitles[pageId];
  if (pageId == "dashboardPage") {
    document.getElementById("pathText").innerHTML = "Workspace / Administrator";
  } else {
    document.getElementById("pathText").innerHTML = "Workspace / Administrator / " + pageTitles[pageId];
  }
  document.getElementById("searchBox").value = "";

  if (pageId == "dashboardPage") showDashboard();
  if (pageId == "doctorsPage") showDoctors();
  if (pageId == "patientsPage") showPatients();
  if (pageId == "appointmentsPage") showAppointments();
}

// ---------- helpers ----------
function findDoctor(id) {
  for (var i = 0; i < doctors.length; i++) {
    if (doctors[i].id == id) {
      return doctors[i];
    }
  }
  return { id: id, name: "Unknown doctor", specialization: "-", days: "-", fee: 0 };
}

function patientName(email) {
  var user = findUserByEmail(email);
  if (user == null) {
    return "Unknown patient";
  }
  return user.name;
}

// the doctor login account linked to a doctor record (or null)
function linkedDoctorUser(doctorId) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].role == "Doctor" && users[i].doctorId == doctorId) {
      return users[i];
    }
  }
  return null;
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
  return "<span class='status " + status.toLowerCase() + "'>" + status + "</span>";
}

function initials(name) {
  var parts = name.replace("Dr. ", "").replace("Md. ", "").split(" ");
  var text = parts[0].charAt(0);
  if (parts.length > 1) {
    text += parts[parts.length - 1].charAt(0);
  }
  return text.toUpperCase();
}

// ---------- dashboard ----------
function showDashboard() {
  var patients = 0;
  var today = 0;
  var pending = 0;
  var cancelled = 0;
  var todayText = todayDate();

  for (var i = 0; i < users.length; i++) {
    if (users[i].role == "Patient") patients++;
  }
  for (var j = 0; j < appointments.length; j++) {
    if (appointments[j].date == todayText) today++;
    if (appointments[j].status == "Pending") pending++;
    if (appointments[j].status == "Cancelled") cancelled++;
  }

  var firstName = loggedInUser.name.split(" ")[0];
  document.getElementById("welcomeText").innerHTML = "Welcome back, " + escapeText(firstName);
  document.getElementById("totalDoctors").innerHTML = doctors.length;
  document.getElementById("totalPatients").innerHTML = patients;
  document.getElementById("todayAppointments").innerHTML = today;
  document.getElementById("totalAppointmentsText").innerHTML = appointments.length + " appointments in total";
  document.getElementById("pendingAppointments").innerHTML = pending;

  // latest 5 appointments (newest first)
  var html = "";
  var shown = 0;
  for (var k = appointments.length - 1; k >= 0 && shown < 5; k--) {
    var a = appointments[k];
    html += "<tr>";
    html += "<td>" + escapeText(patientName(a.patientEmail)) + "</td>";
    html += "<td>" + escapeText(findDoctor(a.doctorId).name) + "</td>";
    html += "<td>" + a.date + ", " + a.time + "</td>";
    html += "<td>" + statusBadge(a.status) + "</td>";
    html += "</tr>";
    shown++;
  }
  if (html == "") {
    html = "<tr><td colspan='4'>No appointments yet</td></tr>";
  }
  document.getElementById("recentTable").innerHTML = html;

  var activity = "";
  activity += "<li>" + pending + " appointment(s) waiting for approval</li>";
  activity += "<li>" + cancelled + " appointment(s) cancelled by patients</li>";
  activity += "<li>" + doctors.length + " doctor(s) and " + patients + " patient(s) in the system</li>";
  document.getElementById("activityList").innerHTML = activity;
}

// ---------- manage doctors ----------
function showDoctors() {
  var html = "";

  for (var i = 0; i < doctors.length; i++) {
    var d = doctors[i];
    var account = linkedDoctorUser(d.id);
    var accountText = "-";
    if (account != null) {
      accountText = escapeText(account.email);
    }

    html += "<tr>";
    html += "<td>" + escapeText(d.name) + "</td>";
    html += "<td>" + escapeText(d.specialization) + "</td>";
    html += "<td>" + escapeText(d.days) + "</td>";
    html += "<td>" + d.fee + "</td>";
    html += "<td>" + accountText + "</td>";
    html += "<td>";
    html += "<button class='small-button edit-button' onclick='editDoctor(" + d.id + ")'>Edit</button> ";
    html += "<button class='small-button delete-button' onclick='deleteDoctor(" + d.id + ")'>Delete</button>";
    html += "</td>";
    html += "</tr>";
  }

  if (html == "") {
    html = "<tr><td colspan='6'>No doctors added yet</td></tr>";
  }
  document.getElementById("doctorsTable").innerHTML = html;
  document.getElementById("doctorCountText").innerHTML = doctors.length + " doctor(s)";
}

function saveDoctor() {
  refreshData();

  var name = document.getElementById("docName").value.trim();
  var specialization = document.getElementById("docSpecialization").value.trim();
  var days = document.getElementById("docDays").value.trim();
  var fee = document.getElementById("docFee").value;
  var email = document.getElementById("docEmail").value.trim().toLowerCase();

  if (name == "" || specialization == "" || days == "" || fee == "") {
    alert("Please fill in name, specialization, days and fee");
    return;
  }
  if (fee <= 0) {
    alert("Fee must be more than 0");
    return;
  }

  // the login email (if given) must belong to a Doctor account
  var account = null;
  if (email != "") {
    account = findUserByEmail(email);
    if (account == null || account.role != "Doctor") {
      alert("No doctor account found with this email. The doctor must register first.");
      return;
    }
  }

  var doctorId = editingDoctorId;
  if (editingDoctorId == 0) {
    doctorId = 1;
    for (var i = 0; i < doctors.length; i++) {
      if (doctors[i].id >= doctorId) {
        doctorId = doctors[i].id + 1;
      }
    }
    doctors.push({ id: doctorId, name: name, specialization: specialization, days: days, fee: Number(fee) });
  } else {
    var doc = findDoctor(editingDoctorId);
    doc.name = name;
    doc.specialization = specialization;
    doc.days = days;
    doc.fee = Number(fee);
  }
  saveDoctors();

  // link the login account to this doctor record (only one account per doctor)
  for (var j = 0; j < users.length; j++) {
    if (users[j].role == "Doctor" && users[j].doctorId == doctorId) {
      delete users[j].doctorId;
    }
    if (account != null && users[j].email == account.email) {
      users[j].doctorId = doctorId;
    }
  }
  saveUsers(users);

  if (editingDoctorId == 0) {
    alert("Doctor added");
  } else {
    alert("Doctor updated");
  }
  clearDoctorForm();
  refreshData();
  showDoctors();
}

function editDoctor(id) {
  var doc = findDoctor(id);
  var account = linkedDoctorUser(id);

  editingDoctorId = id;
  document.getElementById("docName").value = doc.name;
  document.getElementById("docSpecialization").value = doc.specialization;
  document.getElementById("docDays").value = doc.days;
  document.getElementById("docFee").value = doc.fee;
  document.getElementById("docEmail").value = "";
  if (account != null) {
    document.getElementById("docEmail").value = account.email;
  }
  document.getElementById("doctorFormTitle").innerHTML = "Edit doctor";
}

function deleteDoctor(id) {
  if (!confirm("Delete this doctor? Their active appointments will be cancelled.")) {
    return;
  }

  refreshData();
  var newList = [];
  for (var i = 0; i < doctors.length; i++) {
    if (doctors[i].id != id) {
      newList.push(doctors[i]);
    }
  }
  doctors = newList;
  saveDoctors();

  for (var j = 0; j < appointments.length; j++) {
    var a = appointments[j];
    if (a.doctorId == id && (a.status == "Pending" || a.status == "Approved")) {
      a.status = "Cancelled";
    }
  }
  saveAppointments();

  for (var k = 0; k < users.length; k++) {
    if (users[k].role == "Doctor" && users[k].doctorId == id) {
      delete users[k].doctorId;
    }
  }
  saveUsers(users);

  if (editingDoctorId == id) {
    clearDoctorForm();
  }
  showDoctors();
}

function clearDoctorForm() {
  editingDoctorId = 0;
  document.getElementById("docName").value = "";
  document.getElementById("docSpecialization").value = "";
  document.getElementById("docDays").value = "";
  document.getElementById("docFee").value = "";
  document.getElementById("docEmail").value = "";
  document.getElementById("doctorFormTitle").innerHTML = "Add new doctor";
}

// ---------- manage patients ----------
function countAppointments(email) {
  var count = 0;
  for (var i = 0; i < appointments.length; i++) {
    if (appointments[i].patientEmail == email) {
      count++;
    }
  }
  return count;
}

function showPatients() {
  var html = "";
  var count = 0;

  for (var i = 0; i < users.length; i++) {
    var p = users[i];
    if (p.role != "Patient") {
      continue;
    }
    count++;

    html += "<tr>";
    html += "<td>" + escapeText(p.name) + "</td>";
    html += "<td>" + escapeText(p.email) + "</td>";
    html += "<td>" + escapeText(p.phone) + "</td>";
    html += "<td>" + escapeText(p.age) + "</td>";
    html += "<td>" + escapeText(p.gender) + "</td>";
    html += "<td>" + countAppointments(p.email) + "</td>";
    html += "<td>";
    html += "<button class='small-button edit-button' onclick='editPatient(\"" + escapeText(p.email) + "\")'>Edit</button> ";
    html += "<button class='small-button delete-button' onclick='deletePatient(\"" + escapeText(p.email) + "\")'>Delete</button>";
    html += "</td>";
    html += "</tr>";
  }

  if (html == "") {
    html = "<tr><td colspan='7'>No patients registered yet</td></tr>";
  }
  document.getElementById("patientsTable").innerHTML = html;
  document.getElementById("patientCountText").innerHTML = count + " patient(s)";
}

function editPatient(email) {
  var p = findUserByEmail(email);
  if (p == null) {
    return;
  }

  editingPatientEmail = email;
  document.getElementById("patientFormEmail").innerHTML = "Email (login ID): " + escapeText(email);
  document.getElementById("patName").value = p.name;
  document.getElementById("patPhone").value = p.phone;
  document.getElementById("patAge").value = p.age;
  document.getElementById("patGender").value = p.gender;
  document.getElementById("patientFormPanel").classList.remove("hidden");
}

function savePatient() {
  var error = saveUserProfile(editingPatientEmail, {
    name: document.getElementById("patName").value,
    phone: document.getElementById("patPhone").value,
    age: document.getElementById("patAge").value,
    gender: document.getElementById("patGender").value,
    specialization: ""
  });

  if (error != "") {
    alert(error);
    return;
  }

  alert("Patient updated");
  clearPatientForm();
  refreshData();
  showPatients();
}

function deletePatient(email) {
  if (!confirm("Delete this patient and all of their appointments?")) {
    return;
  }

  refreshData();
  var newUsers = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].email != email) {
      newUsers.push(users[i]);
    }
  }
  saveUsers(newUsers);

  var newAppointments = [];
  for (var j = 0; j < appointments.length; j++) {
    if (appointments[j].patientEmail != email) {
      newAppointments.push(appointments[j]);
    }
  }
  appointments = newAppointments;
  saveAppointments();

  if (editingPatientEmail == email) {
    clearPatientForm();
  }
  refreshData();
  showPatients();
}

function clearPatientForm() {
  editingPatientEmail = "";
  document.getElementById("patientFormPanel").classList.add("hidden");
}

// ---------- manage appointments ----------
function makeOption(value, currentStatus) {
  if (value == currentStatus) {
    return "<option value='" + value + "' selected>" + value + "</option>";
  }
  return "<option value='" + value + "'>" + value + "</option>";
}

function showAppointments() {
  var filter = document.getElementById("statusFilter").value;
  var html = "";
  var count = 0;

  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    if (filter != "All" && a.status != filter) {
      continue;
    }
    count++;

    html += "<tr>";
    html += "<td>" + a.id + "</td>";
    html += "<td>" + escapeText(patientName(a.patientEmail)) + "</td>";
    html += "<td>" + escapeText(findDoctor(a.doctorId).name) + "</td>";
    html += "<td>" + a.date + ", " + a.time + "</td>";
    html += "<td>" + escapeText(a.reason) + "</td>";
    html += "<td>" + statusBadge(a.status) + "</td>";
    html += "<td>";
    html += "<select id='status" + a.id + "' class='status-select'>";
    html += makeOption("Pending", a.status);
    html += makeOption("Approved", a.status);
    html += makeOption("Completed", a.status);
    html += makeOption("Cancelled", a.status);
    html += "</select> ";
    html += "<button class='small-button edit-button' onclick='updateStatus(" + a.id + ")'>Update</button>";
    html += "</td>";
    html += "<td><button class='small-button delete-button' onclick='deleteAppointment(" + a.id + ")'>Delete</button></td>";
    html += "</tr>";
  }

  if (html == "") {
    html = "<tr><td colspan='8'>No appointments found</td></tr>";
  }
  document.getElementById("appointmentsTable").innerHTML = html;
  document.getElementById("appointmentCountText").innerHTML = count + " appointment(s)";
}

function updateStatus(id) {
  var newStatus = document.getElementById("status" + id).value;

  refreshData();
  for (var i = 0; i < appointments.length; i++) {
    if (appointments[i].id == id) {
      if (appointments[i].status == newStatus) {
        alert("Status is already " + newStatus);
        return;
      }
      appointments[i].status = newStatus;
    }
  }
  saveAppointments();
  alert("Appointment " + id + " is now " + newStatus);
  showAppointments();
}

function deleteAppointment(id) {
  if (!confirm("Delete this appointment?")) {
    return;
  }

  refreshData();
  var newList = [];
  for (var i = 0; i < appointments.length; i++) {
    if (appointments[i].id != id) {
      newList.push(appointments[i]);
    }
  }
  appointments = newList;
  saveAppointments();
  showAppointments();
}

function showPendingAppointments() {
  showPage("appointmentsPage");
  document.getElementById("statusFilter").value = "Pending";
  showAppointments();
}

// ---------- topbar search: hides table rows that do not match ----------
function searchPage() {
  var text = document.getElementById("searchBox").value.toLowerCase();
  var pages = document.getElementsByClassName("page");

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].classList.contains("hidden")) {
      continue;
    }
    var rows = pages[i].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (var j = 0; j < rows.length; j++) {
      if (rows[j].innerText.toLowerCase().indexOf(text) == -1) {
        rows[j].style.display = "none";
      } else {
        rows[j].style.display = "";
      }
    }
  }
}

// start on the dashboard
if (loggedInUser != null) {
  document.getElementById("profileName").innerHTML = escapeText(loggedInUser.name);
  document.getElementById("avatarText").innerHTML = escapeText(initials(loggedInUser.name));
  showPage("dashboardPage");
}
