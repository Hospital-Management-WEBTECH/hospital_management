var currentUser = null;

function openProfile() {
    var email = document.getElementById("checkEmail").value.toLowerCase();
    var password = document.getElementById("checkPassword").value;

    var errorBox = document.getElementById("checkError");
    errorBox.innerHTML = "";

    if (email == "") {
        errorBox.innerHTML = "Please enter your email.";
        return false;
    }

    if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        errorBox.innerHTML = "Email is not valid (it needs @ and .).";
        return false;
    }

    if (password == "") {
        errorBox.innerHTML = "Please enter your password.";
        return false;
    }

    var user = findUser(email);

    if (user == null || user.password != password) {
        errorBox.innerHTML = "Wrong email or password.";
        return false;
    }

    currentUser = user;
    showProfile();

    document.getElementById("checkForm").style.display = "none";
    document.getElementById("profileForm").style.display = "block";
    document.getElementById("passwordTitle").style.display = "block";
    document.getElementById("passwordForm").style.display = "block";

    var backLink = document.getElementById("backLink");
    backLink.setAttribute("href", currentUser.role + ".html");
    backLink.style.display = "inline-block";

    return false;
}

function showProfile() {
    document.getElementById("userInfo").innerHTML = "<p>User Type: <b>" + currentUser.role + "</b></p>" +
        "<p>Email (login ID): <b>" + currentUser.email + "</b></p>";

    document.getElementById("fullname").value = currentUser.name;
    document.getElementById("phone").value = currentUser.phone;

    if (currentUser.role == "Patient") {
        document.getElementById("patientFields").style.display = "block";
        document.getElementById("age").value = currentUser.age;

        if (currentUser.gender == "Male") {
            document.getElementById("male").checked = true;
        } else if (currentUser.gender == "Female") {
            document.getElementById("female").checked = true;
        } else {
            document.getElementById("other").checked = true;
        }
    }

    if (currentUser.role == "Doctor") {
        document.getElementById("doctorFields").style.display = "block";
        document.getElementById("specialization").value = currentUser.specialization;
    }
}

function saveProfile() {
    var name = document.getElementById("fullname").value;
    var phone = document.getElementById("phone").value;
    var age = document.getElementById("age").value;
    var specialization = document.getElementById("specialization").value;

    var messageBox = document.getElementById("profileMessage");
    messageBox.className = "form-message error";
    messageBox.innerHTML = "";

    if (name == "") {
        messageBox.innerHTML = "Please enter your full name.";
        return false;
    }

    if (phone == "") {
        messageBox.innerHTML = "Please enter your phone number.";
        return false;
    }

    if (isNaN(phone) || phone.length != 11) {
        messageBox.innerHTML = "Phone number must be 11 digits.";
        return false;
    }

    var gender = "";

    if (currentUser.role == "Patient") {
        if (age == "" || isNaN(age) || Number(age) < 1 || Number(age) > 120) {
            messageBox.innerHTML = "Please enter a valid age (1 to 120).";
            return false;
        }

        var radios = document.getElementsByName("gender");

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                gender = radios[i].value;
            }
        }

        if (gender == "") {
            messageBox.innerHTML = "Please select your gender.";
            return false;
        }
    }

    if (currentUser.role == "Doctor" && specialization == "") {
        messageBox.innerHTML = "Please enter your specialization.";
        return false;
    }

    currentUser.name = name;
    currentUser.phone = phone;

    if (currentUser.role == "Patient") {
        currentUser.age = Number(age);
        currentUser.gender = gender;
    }

    if (currentUser.role == "Doctor") {
        currentUser.specialization = specialization;
    }

    messageBox.className = "form-message success";
    messageBox.innerHTML = "Profile saved successfully!";
    return false;
}

function changePassword() {
    var currentPassword = document.getElementById("currentPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    var messageBox = document.getElementById("passwordMessage");
    messageBox.className = "form-message error";
    messageBox.innerHTML = "";

    if (currentPassword == "") {
        messageBox.innerHTML = "Please enter your current password.";
        return false;
    }

    if (currentPassword != currentUser.password) {
        messageBox.innerHTML = "Current password is wrong.";
        return false;
    }

    if (newPassword.length < 6) {
        messageBox.innerHTML = "Password must be at least 6 characters.";
        return false;
    }

    if (/[A-Z]/.test(newPassword) == false) {
        messageBox.innerHTML = "Password must have at least one capital letter (A-Z).";
        return false;
    }

    if (/[a-z]/.test(newPassword) == false) {
        messageBox.innerHTML = "Password must have at least one small letter (a-z).";
        return false;
    }

    if (/[0-9]/.test(newPassword) == false) {
        messageBox.innerHTML = "Password must have at least one number (0-9).";
        return false;
    }

    if (/[^A-Za-z0-9]/.test(newPassword) == false) {
        messageBox.innerHTML = "Password must have at least one special character (@, #, $, ! etc).";
        return false;
    }

    if (newPassword == currentPassword) {
        messageBox.innerHTML = "New password must be different from the current password.";
        return false;
    }

    if (newPassword != confirmPassword) {
        messageBox.innerHTML = "New Password and Confirm Password do not match.";
        return false;
    }

    currentUser.password = newPassword;

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    messageBox.className = "form-message success";
    messageBox.innerHTML = "Password changed successfully!";
    return false;
}
