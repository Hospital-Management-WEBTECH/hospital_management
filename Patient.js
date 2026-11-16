// Patient.js : patient pages only. Login, logout, registration, profile and
// change password now come from common.js / Login.html / Profile.html.

var defaultDoctors = [
  { id: 1, name: "Dr. Ashfaq", specialization: "Medicine", days: "Sat, Mon, Wed", fee: 800 },
  { id: 2, name: "Dr. Farhana", specialization: "Cardiology", days: "Sun, Tue, Thu", fee: 1200 },
  { id: 3, name: "Dr. Imran", specialization: "Orthopedics", days: "Sat, Tue, Thu", fee: 1000 },
  { id: 4, name: "Dr. Sultana", specialization: "Gynecology", days: "Sun, Mon, Wed", fee: 1000 },
  { id: 5, name: "Dr. Kamal", specialization: "Pediatrics", days: "Mon, Tue, Thu", fee: 700 }
];

// patientEmail links each appointment to its patient
var defaultAppointments = [
  { id: 1, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-02", time: "10:00 AM", reason: "Fever and cough", status: "Completed" },
  { id: 2, patientEmail: "patient@hms.com", doctorId: 2, date: "2026-11-20", time: "05:00 PM", reason: "Chest pain checkup", status: "Approved" },
  { id: 3, patientEmail: "patient@hms.com", doctorId: 1, date: "2026-11-25", time: "11:00 AM", reason: "Follow-up", status: "Pending" },
  { id: 4, patientEmail: "rahim@hms.com", doctorId: 3, date: "2026-11-22", time: "04:00 PM", reason: "Knee pain", status: "Pending" }
];

var doctors = [];
var appointments = [];

// only logged-in Patient users can open this page
var loggedInUser = requireLogin("Patient");

// shared data: the doctor and admin pages read/write the same keys
function refreshData() {
  doctors = getData("hms_doctors", defaultDoctors);
  appointments = getData("hms_appointments", defaultAppointments);
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

  if (pageId == "dashboardPage") showDashboard();
  if (pageId == "doctorsPage") showDoctors();
  if (pageId == "bookPage") showBookForm();
  if (pageId == "appointmentsPage") showAppointments();
}

function findDoctor(id) {
  for (var i = 0; i < doctors.length; i++) {
    if (doctors[i].id == id) {
      return doctors[i];
    }
  }
  return { id: id, name: "Unknown doctor", specialization: "-", days: "-", fee: 0 };
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
    html += "<td>" + escapeText(d.name) + "</td>";
    html += "<td>" + escapeText(d.specialization) + "</td>";
    html += "<td>" + escapeText(d.days) + "</td>";
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
    html += "<option value='" + d.id + "'>" + escapeText(d.name) + " - " + escapeText(d.specialization) + " (Tk " + d.fee + ")</option>";
  }
  select.innerHTML = html;
  document.getElementById("bookDate").min = todayDate();
}

function bookAppointment() {
  refreshData();

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
  for (var j = 0; j < appointments.length; j++) {
    if (appointments[j].id >= newId) {
      newId = appointments[j].id + 1;
    }
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
  saveAppointments();

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
    html += "<td>" + escapeText(doc.name) + "</td>";
    html += "<td>" + escapeText(doc.specialization) + "</td>";
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

  refreshData();
  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    // only the owner can cancel, and only active appointments
    if (a.id == id && a.patientEmail == loggedInUser.email) {
      if (a.status == "Pending" || a.status == "Approved") {
        a.status = "Cancelled";
      }
    }
  }
  saveAppointments();
  showAppointments();
}

// start on the dashboard
if (loggedInUser != null) {
  showPage("dashboardPage");
}
