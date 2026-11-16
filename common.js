var users = [
    { role: "Administrator", name: "Soharab Hossain", email: "admin@hms.com", phone: "01711111111", password: "123456" },
    { role: "Doctor", name: "Dr. Ashfaq Khandaker", email: "doctor@hms.com", phone: "01722222222", specialization: "Medicine", password: "123456" },
    { role: "Patient", name: "Trisha Sarker", email: "patient@hms.com", phone: "01811000000", age: 22, gender: "Female", password: "123456" },
    { role: "Patient", name: "Rahim Uddin", email: "rahim@hms.com", phone: "01911000000", age: 45, gender: "Male", password: "123456" },
    { role: "Pharmacist", name: "Md. Ahnaf Azam Jafin", email: "pharmacist@hms.com", phone: "01711000000", password: "123456" }
];

function findUser(email) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            return users[i];
        }
    }
    return null;
}
