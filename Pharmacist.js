var users = [
  { name: "Md. Ahnaf Azam Jafin", email: "pharmacist@hms.com", phone: "01711000000", password: "123456" }
];

var medicines = [
  { id: 1, name: "Napa 500 mg", price: 2, stock: 240 },
  { id: 2, name: "Seclo 20 mg", price: 7, stock: 15 },
  { id: 3, name: "Azithromycin 500 mg", price: 35, stock: 60 },
  { id: 4, name: "Cetirizine 10 mg", price: 3, stock: 0 },
  { id: 5, name: "Metformin 500 mg", price: 5, stock: 18 }
];

var prescriptions = [
  { id: 1, patient: "Rahim Uddin", doctor: "Dr. Ashfaq", date: "2026-11-10", status: "Pending",
    items: [{ medId: 1, qty: 10 }, { medId: 2, qty: 14 }] },
  { id: 2, patient: "Nusrat Jahan", doctor: "Dr. Ashfaq", date: "2026-11-11", status: "Pending",
    items: [{ medId: 3, qty: 6 }, { medId: 4, qty: 10 }] },
  { id: 3, patient: "Karim Hossain", doctor: "Dr. Farhana", date: "2026-11-12", status: "Pending",
    items: [{ medId: 5, qty: 30 }] },
  { id: 4, patient: "Tanvir Ahmed", doctor: "Dr. Ashfaq", date: "2026-11-05", status: "Dispensed",
    items: [{ medId: 1, qty: 10 }] }
];

var loggedInUser = null;
var editingId = 0;

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
  if (pageId == "prescriptionsPage") showPrescriptions();
  if (pageId == "medicinesPage") showMedicines();
  if (pageId == "stockPage") showStock();
  if (pageId == "profilePage") showProfile();
}

function findMedicine(id) {
  for (var i = 0; i < medicines.length; i++) {
    if (medicines[i].id == id) {
      return medicines[i];
    }
  }
  return null;
}

function stockStatus(stock) {
  if (stock == 0) return "<span class='red'>Out of stock</span>";
  if (stock <= 20) return "<span class='orange'>Low stock</span>";
  return "<span class='green'>In stock</span>";
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
  var password = document.getElementById("regPassword").value;
  var confirm = document.getElementById("regConfirm").value;

  if (name == "" || email == "" || phone == "" || password == "") {
    alert("Please fill in all fields");
    return;
  }
  if (email.indexOf("@") == -1) {
    alert("Enter a valid email");
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

  users.push({ name: name, email: email, phone: phone, password: password });
  alert("Registration successful. Please login.");
  showScreen("loginScreen");
}

function logout() {
  loggedInUser = null;
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  showScreen("loginScreen");
}

function showDashboard() {
  var low = 0;
  var out = 0;
  var pending = 0;

  for (var i = 0; i < medicines.length; i++) {
    if (medicines[i].stock == 0) {
      out++;
    } else if (medicines[i].stock <= 20) {
      low++;
    }
  }
  for (var j = 0; j < prescriptions.length; j++) {
    if (prescriptions[j].status == "Pending") {
      pending++;
    }
  }

  document.getElementById("welcomeText").innerHTML = "Welcome, " + loggedInUser.name;
  document.getElementById("totalMeds").innerHTML = medicines.length;
  document.getElementById("lowMeds").innerHTML = low;
  document.getElementById("outMeds").innerHTML = out;
  document.getElementById("pendingRx").innerHTML = pending;
}

function showPrescriptions() {
  var html = "";

  for (var i = 0; i < prescriptions.length; i++) {
    var p = prescriptions[i];
    var medicineText = "";

    for (var j = 0; j < p.items.length; j++) {
      var med = findMedicine(p.items[j].medId);
      medicineText += med.name + " x " + p.items[j].qty + "<br>";
    }

    var action = "Done";
    if (p.status == "Pending") {
      action = "<button onclick='dispense(" + p.id + ")'>Dispense</button>";
    }

    html += "<tr>";
    html += "<td>" + p.id + "</td>";
    html += "<td>" + p.patient + "</td>";
    html += "<td>" + p.doctor + "</td>";
    html += "<td>" + p.date + "</td>";
    html += "<td>" + medicineText + "</td>";
    html += "<td>" + p.status + "</td>";
    html += "<td>" + action + "</td>";
    html += "</tr>";
  }

  document.getElementById("prescriptionsTable").innerHTML = html;
}

function dispense(id) {
  var prescription = null;
  for (var i = 0; i < prescriptions.length; i++) {
    if (prescriptions[i].id == id) {
      prescription = prescriptions[i];
    }
  }

  for (var j = 0; j < prescription.items.length; j++) {
    var med = findMedicine(prescription.items[j].medId);
    if (med.stock < prescription.items[j].qty) {
      alert("Not enough stock for " + med.name);
      return;
    }
  }

  for (var k = 0; k < prescription.items.length; k++) {
    var m = findMedicine(prescription.items[k].medId);
    m.stock = m.stock - prescription.items[k].qty;
  }

  prescription.status = "Dispensed";
  showPrescriptions();
  alert("Prescription dispensed");
}

function showMedicines() {
  var html = "";

  for (var i = 0; i < medicines.length; i++) {
    var m = medicines[i];
    html += "<tr>";
    html += "<td>" + m.name + "</td>";
    html += "<td>" + m.price + "</td>";
    html += "<td>" + m.stock + "</td>";
    html += "<td>";
    html += "<button onclick='editMedicine(" + m.id + ")'>Edit</button> ";
    html += "<button onclick='deleteMedicine(" + m.id + ")'>Delete</button>";
    html += "</td>";
    html += "</tr>";
  }

  document.getElementById("medicinesTable").innerHTML = html;
}

function saveMedicine() {
  var name = document.getElementById("medName").value;
  var price = document.getElementById("medPrice").value;
  var stock = document.getElementById("medStock").value;

  if (name == "" || price == "" || stock == "") {
    alert("Please fill in all fields");
    return;
  }
  if (price < 0 || stock < 0) {
    alert("Price and stock cannot be negative");
    return;
  }

  if (editingId == 0) {
    var newId = 1;
    if (medicines.length > 0) {
      newId = medicines[medicines.length - 1].id + 1;
    }
    medicines.push({ id: newId, name: name, price: Number(price), stock: Number(stock) });
  } else {
    var med = findMedicine(editingId);
    med.name = name;
    med.price = Number(price);
    med.stock = Number(stock);
  }

  clearMedicineForm();
  showMedicines();
}

function editMedicine(id) {
  var med = findMedicine(id);
  editingId = id;
  document.getElementById("medName").value = med.name;
  document.getElementById("medPrice").value = med.price;
  document.getElementById("medStock").value = med.stock;
  document.getElementById("medicineFormTitle").innerHTML = "Edit Medicine";
}

function deleteMedicine(id) {
  if (confirm("Delete this medicine?")) {
    var newList = [];
    for (var i = 0; i < medicines.length; i++) {
      if (medicines[i].id != id) {
        newList.push(medicines[i]);
      }
    }
    medicines = newList;
    showMedicines();
  }
}

function clearMedicineForm() {
  editingId = 0;
  document.getElementById("medName").value = "";
  document.getElementById("medPrice").value = "";
  document.getElementById("medStock").value = "";
  document.getElementById("medicineFormTitle").innerHTML = "Add Medicine";
}

function showStock() {
  var html = "";

  for (var i = 0; i < medicines.length; i++) {
    var m = medicines[i];
    html += "<tr>";
    html += "<td>" + m.name + "</td>";
    html += "<td>" + m.stock + "</td>";
    html += "<td>" + stockStatus(m.stock) + "</td>";
    html += "<td>";
    html += "<input type='number' id='newStock" + m.id + "' value='" + m.stock + "'> ";
    html += "<button onclick='updateStock(" + m.id + ")'>Update</button>";
    html += "</td>";
    html += "</tr>";
  }

  document.getElementById("stockTable").innerHTML = html;
}

function updateStock(id) {
  var value = document.getElementById("newStock" + id).value;

  if (value == "" || value < 0) {
    alert("Enter a valid quantity");
    return;
  }

  var med = findMedicine(id);
  med.stock = Number(value);
  showStock();
}

function showProfile() {
  document.getElementById("profileName").value = loggedInUser.name;
  document.getElementById("profileEmail").value = loggedInUser.email;
  document.getElementById("profilePhone").value = loggedInUser.phone;
}

function saveProfile() {
  var name = document.getElementById("profileName").value;
  var email = document.getElementById("profileEmail").value;
  var phone = document.getElementById("profilePhone").value;

  if (name == "" || email == "" || phone == "") {
    alert("Please fill in all fields");
    return;
  }
  if (email.indexOf("@") == -1) {
    alert("Enter a valid email");
    return;
  }

  loggedInUser.name = name;
  loggedInUser.email = email;
  loggedInUser.phone = phone;
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
