var doctor = {
    name: "Dr. Ashfaq Khandaker",
    email: "doctor@hms.com",
    specialization: "Medicine"
};

var patients = [
    { name: "Trisha Sarker", email: "patient@hms.com", phone: "01811000000", age: 22, gender: "Female" },
    { name: "Rahim Uddin", email: "rahim@hms.com", phone: "01911000000", age: 45, gender: "Male" }
];

var appointments = [
    { id: 1, patientEmail: "patient@hms.com", date: "2026-11-02", time: "10:00 AM", reason: "Fever and cough", status: "Completed" },
    { id: 3, patientEmail: "patient@hms.com", date: "2026-11-25", time: "11:00 AM", reason: "Follow-up", status: "Pending" }
];

var medicines = [
    { id: 1, name: "Napa 500 mg", stock: 240 },
    { id: 2, name: "Seclo 20 mg", stock: 15 },
    { id: 3, name: "Azithromycin 500 mg", stock: 60 },
    { id: 4, name: "Cetirizine 10 mg", stock: 0 },
    { id: 5, name: "Metformin 500 mg", stock: 18 }
];

var prescriptions = [
    { id: 1, patient: "Rahim Uddin", date: "2026-11-10", advice: "", status: "Pending",
        items: [{ medId: 1, qty: 10 }, { medId: 2, qty: 14 }] },
    { id: 2, patient: "Nusrat Jahan", date: "2026-11-11", advice: "", status: "Pending",
        items: [{ medId: 3, qty: 6 }, { medId: 4, qty: 10 }] },
    { id: 4, patient: "Tanvir Ahmed", date: "2026-11-05", advice: "", status: "Dispensed",
        items: [{ medId: 1, qty: 10 }] }
];

var prescriptionAppointmentId = 0;
var prescriptionItems = [];

function loadPage() {
    document.getElementById("doctorName").innerHTML = doctor.name;
    document.getElementById("doctorSpecial").innerHTML = doctor.specialization;

    showCounts();
    showAppointments();
    showPrescriptions();
}

function findPatient(email) {
    for (var i = 0; i < patients.length; i++) {
        if (patients[i].email == email) {
            return patients[i];
        }
    }
    return { name: "Unknown patient", email: email, phone: "-", age: "-", gender: "-" };
}

function findAppointment(id) {
    for (var i = 0; i < appointments.length; i++) {
        if (appointments[i].id == id) {
            return appointments[i];
        }
    }
    return null;
}

function findMedicine(id) {
    for (var i = 0; i < medicines.length; i++) {
        if (medicines[i].id == id) {
            return medicines[i];
        }
    }
    return { id: id, name: "Unknown medicine", stock: 0 };
}

function showCounts() {
    var pending = 0;
    var approved = 0;
    var completed = 0;

    for (var i = 0; i < appointments.length; i++) {
        if (appointments[i].status == "Pending") {
            pending++;
        } else if (appointments[i].status == "Approved") {
            approved++;
        } else if (appointments[i].status == "Completed") {
            completed++;
        }
    }

    document.getElementById("totalCount").innerHTML = appointments.length;
    document.getElementById("pendingCount").innerHTML = pending;
    document.getElementById("approvedCount").innerHTML = approved;
    document.getElementById("completedCount").innerHTML = completed;
}

function showAppointments() {
    var filter = document.getElementById("statusFilter").value;
    var rows = "";

    for (var i = 0; i < appointments.length; i++) {
        var app = appointments[i];

        if (filter == "All" || app.status == filter) {
            var patient = findPatient(app.patientEmail);

            var change = "-";
            if (app.status != "Cancelled") {
                change = "<select id='status" + app.id + "'>" +
                    makeOption("Pending", app.status) +
                    makeOption("Approved", app.status) +
                    makeOption("Completed", app.status) +
                    "</select> " +
                    "<button type='button' onclick='updateStatus(" + app.id + ")'>Update</button>";
            }

            var prescribe = "-";
            if (app.status == "Approved" || app.status == "Completed") {
                prescribe = "<button type='button' onclick='openPrescription(" + app.id + ")'>Prescribe</button>";
            }

            rows = rows + "<tr>" +
                "<td>" + app.id + "</td>" +
                "<td>" + patient.name + "</td>" +
                "<td>" + app.date + "</td>" +
                "<td>" + app.time + "</td>" +
                "<td><span class='status " + app.status + "'>" + app.status + "</span></td>" +
                "<td>" + change + "</td>" +
                "<td><button type='button' onclick='viewPatient(" + app.id + ")'>View</button></td>" +
                "<td>" + prescribe + "</td>" +
                "</tr>";
        }
    }

    if (rows == "") {
        rows = "<tr><td colspan='8'>No appointments found.</td></tr>";
    }

    document.getElementById("appointmentTable").innerHTML = rows;
}

function makeOption(value, currentStatus) {
    if (value == currentStatus) {
        return "<option value='" + value + "' selected>" + value + "</option>";
    }
    return "<option value='" + value + "'>" + value + "</option>";
}

function updateStatus(id) {
    var newStatus = document.getElementById("status" + id).value;
    var messageBox = document.getElementById("message");
    var app = findAppointment(id);

    if (newStatus == app.status) {
        messageBox.className = "form-message error";
        messageBox.innerHTML = "Status is already " + newStatus + ".";
        return;
    }

    if (app.status == "Completed") {
        messageBox.className = "form-message error";
        messageBox.innerHTML = "Appointment " + app.id + " is already completed.";
        return;
    }

    app.status = newStatus;

    messageBox.className = "form-message success";
    messageBox.innerHTML = "Appointment " + app.id + " is now " + newStatus + ".";

    showCounts();
    showAppointments();
}

function viewPatient(id) {
    var app = findAppointment(id);
    var patient = findPatient(app.patientEmail);

    document.getElementById("pAppointment").innerHTML = app.id;
    document.getElementById("pName").innerHTML = patient.name;
    document.getElementById("pEmail").innerHTML = patient.email;
    document.getElementById("pPhone").innerHTML = patient.phone;
    document.getElementById("pAge").innerHTML = patient.age;
    document.getElementById("pGender").innerHTML = patient.gender;
    document.getElementById("pReason").innerHTML = app.reason;

    document.getElementById("patientBox").style.display = "block";
}

function hidePatient() {
    document.getElementById("patientBox").style.display = "none";
}

function openPrescription(id) {
    var app = findAppointment(id);
    var patient = findPatient(app.patientEmail);

    prescriptionAppointmentId = id;
    prescriptionItems = [];

    document.getElementById("prescriptionFor").innerHTML = "Patient: <b>" + patient.name +
        "</b> (Appointment " + app.id + ", " + app.reason + ")";

    var options = "<option value=''>-- Select --</option>";

    for (var i = 0; i < medicines.length; i++) {
        options = options + "<option value='" + medicines[i].id + "'>" +
            medicines[i].name + " (stock: " + medicines[i].stock + ")</option>";
    }

    document.getElementById("medicineSelect").innerHTML = options;
    document.getElementById("medicineQty").value = 1;
    document.getElementById("presDate").value = "";
    document.getElementById("advice").value = "";
    document.getElementById("prescriptionError").innerHTML = "";

    showItems();
    document.getElementById("prescriptionBox").style.display = "block";
}

function addMedicine() {
    var medId = document.getElementById("medicineSelect").value;
    var qty = document.getElementById("medicineQty").value;

    var errorBox = document.getElementById("prescriptionError");
    errorBox.innerHTML = "";

    if (medId == "") {
        errorBox.innerHTML = "Please select a medicine.";
        return;
    }

    if (qty == "" || isNaN(qty) || Number(qty) < 1 || qty.indexOf(".") != -1) {
        errorBox.innerHTML = "Quantity must be a whole number (1 or more).";
        return;
    }

    for (var i = 0; i < prescriptionItems.length; i++) {
        if (prescriptionItems[i].medId == medId) {
            prescriptionItems[i].qty = prescriptionItems[i].qty + Number(qty);
            showItems();
            return;
        }
    }

    prescriptionItems.push({ medId: Number(medId), qty: Number(qty) });
    document.getElementById("medicineQty").value = 1;
    showItems();
}

function removeMedicine(index) {
    var newList = [];

    for (var i = 0; i < prescriptionItems.length; i++) {
        if (i != index) {
            newList.push(prescriptionItems[i]);
        }
    }

    prescriptionItems = newList;
    showItems();
}

function showItems() {
    var rows = "";

    for (var i = 0; i < prescriptionItems.length; i++) {
        var med = findMedicine(prescriptionItems[i].medId);

        rows = rows + "<tr>" +
            "<td>" + med.name + "</td>" +
            "<td>" + prescriptionItems[i].qty + "</td>" +
            "<td><button type='button' class='red-button' onclick='removeMedicine(" + i + ")'>Remove</button></td>" +
            "</tr>";
    }

    if (rows == "") {
        rows = "<tr><td colspan='3'>No medicine added yet.</td></tr>";
    }

    document.getElementById("itemTable").innerHTML = rows;
}

function savePrescription() {
    var date = document.getElementById("presDate").value;
    var advice = document.getElementById("advice").value;

    var errorBox = document.getElementById("prescriptionError");
    errorBox.innerHTML = "";

    if (prescriptionItems.length == 0) {
        errorBox.innerHTML = "Please add at least one medicine.";
        return false;
    }

    if (date == "") {
        errorBox.innerHTML = "Please select the date.";
        return false;
    }

    var app = findAppointment(prescriptionAppointmentId);
    var patient = findPatient(app.patientEmail);

    var newId = 1;
    for (var i = 0; i < prescriptions.length; i++) {
        if (prescriptions[i].id >= newId) {
            newId = prescriptions[i].id + 1;
        }
    }

    prescriptions.push({
        id: newId,
        patient: patient.name,
        date: date,
        advice: advice,
        status: "Pending",
        items: prescriptionItems
    });

    hidePrescription();

    var messageBox = document.getElementById("message");
    messageBox.className = "form-message success";
    messageBox.innerHTML = "Prescription " + newId + " saved for " + patient.name + ".";

    showPrescriptions();
    return false;
}

function hidePrescription() {
    prescriptionAppointmentId = 0;
    prescriptionItems = [];
    document.getElementById("prescriptionBox").style.display = "none";
}

function showPrescriptions() {
    var rows = "";

    for (var i = prescriptions.length - 1; i >= 0; i--) {
        var p = prescriptions[i];
        var medicineText = "";

        for (var j = 0; j < p.items.length; j++) {
            medicineText = medicineText + findMedicine(p.items[j].medId).name + " x " + p.items[j].qty + "<br>";
        }

        var advice = "-";
        if (p.advice != "") {
            advice = p.advice;
        }

        rows = rows + "<tr>" +
            "<td>" + p.id + "</td>" +
            "<td>" + p.patient + "</td>" +
            "<td>" + p.date + "</td>" +
            "<td>" + medicineText + "</td>" +
            "<td>" + advice + "</td>" +
            "<td><span class='status " + p.status + "'>" + p.status + "</span></td>" +
            "</tr>";
    }

    if (rows == "") {
        rows = "<tr><td colspan='6'>No prescriptions written yet.</td></tr>";
    }

    document.getElementById("prescriptionTable").innerHTML = rows;
}
