import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

onClick("register-button", registerUser);

// Validate phone number input on the fly
const phoneNumberInput = document.getElementById("register-phone");
if (phoneNumberInput) {
    phoneNumberInput.addEventListener("input", () => {
        const phoneValidation = validatePhoneNumber(phoneNumberInput.value);
        if (phoneValidation.valid) {
            phoneNumberInput.value = phoneValidation.value; // Update input with formatted phone number
        }
    });
}

// Fungsi untuk menangani pendaftaran user
document.addEventListener("DOMContentLoaded", function () {
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // Ganti dengan URL endpoint backend sebenarnya
    };

    console.log("Register endpoint:", backend.register);

    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Ambil nilai input form
            const getEmail = document.querySelector("input[name='Email']").value.trim();
            const getName = document.querySelector("input[name='Name']").value.trim();
            const getPassword = document.querySelector("input[name='Password']").value.trim();
            let getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value.trim();

            // Validasi nomor telepon
            const phoneValidation = validatePhoneNumber(getPhoneNumber);
            if (!phoneValidation.valid) {
                Swal.fire("Error", "Nomor telepon tidak valid!", "error");
                return;
            }

            // Perbarui nilai nomor telepon dengan format baru
            getPhoneNumber = phoneValidation.value;
            document.querySelector("input[name='PhoneNumber']").value = getPhoneNumber;

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
                const response = await fetch(backend.register, requestOptions);
                const result = await response.json();
                console.log("Status:", response.status);
                console.log("Response:", result);

                if (response.status === 200) {
                    Swal.fire({
                        title: "Pendaftaran Berhasil",
                        text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
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
                console.error("Error:", error);
                Swal.fire("Error", "Something went wrong!", "error");
            }
        });
    }
});
