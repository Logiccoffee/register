import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

onClick("register-button", registerUser);

// Validate phone number input on the fly
const phoneNumberInput = document.getElementById("register-phone");
phoneNumberInput.addEventListener("input", () => {
    validatePhoneNumber(phoneNumberInput); // Automatically format the phone number
});

// Fungsi untuk validasi required
function required(value, message) {
    if (!value || value.trim() === "") {
        return message;
    }
    return true;
}

// Fungsi untuk validasi nomor telepon
function isPhone(value, message) {
    const phoneRegex = /^62[0-9]{8,15}$/;
    if (!phoneRegex.test(value)) {
        return message;
    }
    return true;
}

// Fungsi untuk validasi email
function isEmail(value, message) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
        return message;
    }
    return true;
}

async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const getEmail = document.querySelector("input[name='Email']");
    const getName = document.querySelector("input[name='Name']");
    const getPassword = document.querySelector("input[name='Password']");
    const getPhoneNumber = document.querySelector("input[name='PhoneNumber']");

    // Validasi inputan
    const emailValidation = required(getEmail.value, "Email harus diisi");
    if (emailValidation !== true) {
        alert(emailValidation);
        return;
    }

    const nameValidation = required(getName.value, "Nama harus diisi");
    if (nameValidation !== true) {
        alert(nameValidation);
        return;
    }

    const passwordValidation = required(getPassword.value, "Password harus diisi");
    if (passwordValidation !== true) {
        alert(passwordValidation);
        return;
    }

    const phoneValidation = isPhone(getPhoneNumber.value, "Nomor telepon tidak valid");
    if (phoneValidation !== true) {
        alert(phoneValidation);
        return;
    }

    // Membuat objek user untuk dikirim ke backend
    const user = {
        Name: getName.value,
        PhoneNumber: getPhoneNumber.value,
        Email: getEmail.value,
        Password: getPassword.value
    };

    // Panggil postJSON untuk mengirim data ke server
    postJSON(
        "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register",
        '', '', // Tidak memerlukan tokenkey dan tokenvalue
        user,
        function(response) {
            if (response.status === 200) {
                alert('Pendaftaran berhasil! Silakan login.');
                window.location.href = 'https://logiccoffee.id.biz.id/login';
            } else {
                alert(`Error: ${response.data.Response}`);
            }
        }
    );
}

// Menambahkan event listener untuk submit form
document.querySelector(".register-form").addEventListener("submit", registerUser);
