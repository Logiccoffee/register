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
        register: "https://logiccoffee.api/register", // Ganti dengan URL endpoint backend sebenarnya
    };

    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Seleksi input form
            const getEmail = document.querySelector("input[name='Email']");
            const getName = document.querySelector("input[name='Name']");
            const getPassword = document.querySelector("input[name='Password']");
            const getPhoneNumber = document.querySelector("input[name='PhoneNumber']");

            // Validasi inputan
            const emailValidation = required(getEmail.value, "Email harus diisi");
            if (emailValidation !== true) {
                Swal.fire("Gagal", emailValidation, "error");
                return;
            }

            const nameValidation = required(getName.value, "Nama harus diisi");
            if (nameValidation !== true) {
                Swal.fire("Gagal", nameValidation, "error");
                return;
            }

            const passwordValidation = required(getPassword.value, "Password harus diisi");
            if (passwordValidation !== true) {
                Swal.fire("Gagal", passwordValidation, "error");
                return;
            }

            const phoneValidation = isPhone(getPhoneNumber.value, "Nomor telepon tidak valid");
            if (phoneValidation !== true) {
                Swal.fire("Gagal", phoneValidation, "error");
                return;
            }

            // Data yang akan dikirim ke server
            const datajson = {
                Email: getEmail.value,
                Name: getName.value,
                Password: getPassword.value,
                PhoneNumber: getPhoneNumber.value,
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
                        text: "Anda berhasil mendaftar. Silakan login untuk melanjutkan.",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "/login";
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

        // Validasi dan format nomor telepon saat input
        const phoneNumberInput = document.querySelector("input[name='PhoneNumber']");
        if (phoneNumberInput) {
            phoneNumberInput.addEventListener("input", () => {
                validatePhoneNumber(phoneNumberInput); // Automatically format phone number
            });
        }
    }
});
