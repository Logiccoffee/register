import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';


onClick("register-button", registerUser);

// Fungsi untuk memproses nomor telepon
// Validate phone number input on the fly
const phoneNumberInput = document.getElementById("register-phone");
phoneNumberInput.addEventListener("input", () => {
    validatePhoneNumber(phoneNumberInput); // Automatically format the phone number
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


// Fungsi untuk menangani pendaftaran user
document.addEventListener("DOMContentLoaded", function () {
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // Ganti dengan URL endpoint backend sebenarnya
    };

    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Ambil nilai input form
            const getEmail = document.querySelector("input[name='Email']").value.trim();
            const getName = document.querySelector("input[name='Name']").value.trim();
            const getPassword = document.querySelector("input[name='Password']").value.trim();
            const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value.trim();

            // Validasi input
            if (!getName || !getEmail || !getPassword || !getPhoneNumber) {
                Swal.fire("Error", "Semua kolom harus diisi.", "error");
                return;
            }

            if (!isEmail(getEmail, "Email tidak valid")) {
                Swal.fire("Error", "Format email tidak valid.", "error");
                return;
            }

            const phoneResult = processPhoneNumber(getPhoneNumber);
            if (!phoneResult.valid) {
                Swal.fire("Error", "Nomor telepon tidak valid.", "error");
                return;
            }

            // Data yang akan dikirim ke server
            const datajson = {
                Email: getEmail,
                Name: getName,
                Password: getPassword,
                PhoneNumber: phoneResult.formatted,
            };

            try {
                // Kirim data ke server
                const response = await postJSON(backend.register, datajson);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Pendaftaran Berhasil",
                        text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/login"; // Ganti dengan URL halaman login
                        }
                    });
                } else {
                    Swal.fire("Gagal Mendaftar", response.message || "Terjadi kesalahan.", "info");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
            }
        });
    }
});

// Fungsi validasi email
function isEmail(value, message) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value) || message;
}
