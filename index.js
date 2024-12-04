import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

// Fungsi untuk validasi nomor telepon
function validateAndConvertPhone(value) {
    // Jika nomor dimulai dengan "08", ubah menjadi "62"
    if (value.startsWith("08")) {
        value = "62" + value.slice(1);
    }

    // Validasi format menggunakan validatePhoneNumber dari jscroot
    if (!validatePhoneNumber(value)) {
        return { valid: false, value }; // Tidak valid
    }

    return { valid: true, value }; // Nomor valid dan terkonversi
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
            const getEmail = document.querySelector("input[name='Email']").value;
            const getName = document.querySelector("input[name='Name']").value;
            const getPassword = document.querySelector("input[name='Password']").value;
            let getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

            // Validasi nomor telepon
            const phoneValidation = validateAndConvertPhone(getPhoneNumber);
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
                console.log("Status:", response.status);
                console.log("Response Text:", await response.text());
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
                console.error(error);
                Swal.fire("Error", "Something went wrong!", "error");
            }
        });
    }
});