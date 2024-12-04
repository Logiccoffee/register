import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

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
    const registerButton = document.getElementById("register-button"); // Ambil tombol berdasarkan ID

    if (registerForm && registerButton) {
        // Gunakan onClick untuk tombol daftar
        onClick(registerButton, async () => {
            // Ambil nilai input form
            const getEmail = document.querySelector("input[name='Email']").value;
            const getName = document.querySelector("input[name='Name']").value;
            const getPassword = document.querySelector("input[name='Password']").value;
            const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

            // Validasi data
            const emailError = required(getEmail, "Email tidak boleh kosong");
            const nameError = required(getName, "Nama tidak boleh kosong");
            const passwordError = required(getPassword, "Password tidak boleh kosong");
            const phoneError = isPhone(getPhoneNumber, "Nomor telepon tidak valid. Gunakan format 628xxx.");

            if (emailError !== true || nameError !== true || passwordError !== true || phoneError !== true) {
                Swal.fire("Validasi Gagal", [emailError, nameError, passwordError, phoneError].filter(e => e !== true).join("\n"), "error");
                return;
            }

            // Data yang akan dikirim ke server
            const datajson = {
                Email: getEmail,
                Name: getName,
                Password: getPassword,
                PhoneNumber: getPhoneNumber,
            };

            // Konfigurasi request
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datajson),
            };

            try {
                // Kirim data ke server
                const response = await fetch(backend.register, requestOptions);
                const result = await response.json();

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
                    Swal.fire("Gagal Mendaftar", result.message || "Terjadi kesalahan.", "info");
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Something went wrong!", "error");
            }
        });
    }
});
