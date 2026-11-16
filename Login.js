function showRegister() {
    document.getElementById("loginTitle").style.display = "none";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerTitle").style.display = "block";
    document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
    document.getElementById("registerTitle").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginTitle").style.display = "block";
    document.getElementById("loginForm").style.display = "block";
}

function showRoleFields() {
    var role = document.getElementById("role").value;

    document.getElementById("patientFields").style.display = "none";
    document.getElementById("doctorFields").style.display = "none";

    if (role == "Patient") {
        document.getElementById("patientFields").style.display = "block";
    } else if (role == "Doctor") {
        document.getElementById("doctorFields").style.display = "block";
    }
}

function validateLogin() {
    var email = document.getElementById("loginEmail").value.toLowerCase();
    var password = document.getElementById("loginPassword").value;

    var errorBox = document.getElementById("loginError");
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

    document.getElementById("loginForm").setAttribute("action", user.role + ".html");

    alert("Login successful! Welcome " + user.name);
    return true;
}

function validateRegister() {
    var role = document.getElementById("role").value;
    var name = document.getElementById("fullname").value;
    var email = document.getElementById("email").value.toLowerCase();
    var phone = document.getElementById("phone").value;
    var age = document.getElementById("age").value;
    var specialization = document.getElementById("specialization").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var terms = document.getElementById("terms").checked;

    var errorBox = document.getElementById("registerError");
    errorBox.innerHTML = "";

    if (role == "") {
        errorBox.innerHTML = "Please select a user type.";
        return false;
    }

    if (name == "") {
        errorBox.innerHTML = "Please enter your full name.";
        return false;
    }

    if (email == "") {
        errorBox.innerHTML = "Please enter your email.";
        return false;
    }

    if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        errorBox.innerHTML = "Email is not valid (it needs @ and .).";
        return false;
    }

    if (findUser(email) != null) {
        errorBox.innerHTML = "This email is already registered.";
        return false;
    }

    if (phone == "") {
        errorBox.innerHTML = "Please enter your phone number.";
        return false;
    }

    if (isNaN(phone) || phone.length != 11) {
        errorBox.innerHTML = "Phone number must be 11 digits.";
        return false;
    }

    var gender = "";

    if (role == "Patient") {
        if (age == "" || isNaN(age) || Number(age) < 1 || Number(age) > 120) {
            errorBox.innerHTML = "Please enter a valid age (1 to 120).";
            return false;
        }

        var radios = document.getElementsByName("gender");

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                gender = radios[i].value;
            }
        }

        if (gender == "") {
            errorBox.innerHTML = "Please select your gender.";
            return false;
        }
    }

    if (role == "Doctor" && specialization == "") {
        errorBox.innerHTML = "Please enter your specialization.";
        return false;
    }

    if (password.length < 6) {
        errorBox.innerHTML = "Password must be at least 6 characters.";
        return false;
    }

    if (/[A-Z]/.test(password) == false) {
        errorBox.innerHTML = "Password must have at least one capital letter (A-Z).";
        return false;
    }

    if (/[a-z]/.test(password) == false) {
        errorBox.innerHTML = "Password must have at least one small letter (a-z).";
        return false;
    }

    if (/[0-9]/.test(password) == false) {
        errorBox.innerHTML = "Password must have at least one number (0-9).";
        return false;
    }

    if (/[^A-Za-z0-9]/.test(password) == false) {
        errorBox.innerHTML = "Password must have at least one special character (@, #, $, ! etc).";
        return false;
    }

    if (password != confirmPassword) {
        errorBox.innerHTML = "Password and Confirm Password do not match.";
        return false;
    }

    if (terms == false) {
        errorBox.innerHTML = "You must agree to the Terms and Conditions.";
        return false;
    }

    var newUser = { role: role, name: name, email: email, phone: phone, password: password };

    if (role == "Patient") {
        newUser.age = Number(age);
        newUser.gender = gender;
    }

    if (role == "Doctor") {
        newUser.specialization = specialization;
    }

    users.push(newUser);

    alert("Registration successful! Please login now.");
    showLogin();
    return false;
}
