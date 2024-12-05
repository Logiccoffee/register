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

// Menambahkan validasi langsung saat mengetik di input nomor telepon
document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.querySelector(".validate-phone");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            validatePhoneNumber(phoneInput);
        });
    }

    // Fungsi untuk menangani pendaftaran user
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // Ganti dengan URL endpoint backend sebenarnya
    };

    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Ambil nilai input form
            const getEmail = document.querySelector("input[name='Email']").value;
            const getName = document.querySelector("input[name='Name']").value;
            const getPassword = document.querySelector("input[name='Password']").value;
            const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

            // Validasi nomor telepon
            const phoneValidation = isPhone(getPhoneNumber, "Nomor telepon harus menggunakan format 62xxxxxxxxx");
            if (phoneValidation !== true) {
                Swal.fire("Validasi Gagal", phoneValidation, "error");
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
                    "Content-Type": "application/json", // Hanya gunakan header yang valid
                },
                body: JSON.stringify(datajson), // Konversi objek ke JSON
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