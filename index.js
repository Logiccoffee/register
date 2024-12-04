import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

document.addEventListener("DOMContentLoaded", function () {
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // Ganti dengan URL endpoint backend sebenarnya
    };

    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        // Event submit untuk form
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Mencegah form reload

            // Ambil nilai input form
            const getEmail = document.querySelector("input[name='Email']").value;
            const getName = document.querySelector("input[name='Name']").value;
            const getPassword = document.querySelector("input[name='Password']").value;
            const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

            // Validasi sederhana
            if (!required(getEmail, "Email tidak boleh kosong!") ||
                !required(getName, "Nama tidak boleh kosong!") ||
                !isPhone(getPhoneNumber, "Nomor telepon tidak valid!")) {
                Swal.fire("Error", "Data yang Anda masukkan tidak valid!", "error");
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

        // Gunakan onClick untuk tombol (jika diperlukan untuk keperluan debugging)
        onClick("#register-button", () => {
            console.log("Register button clicked!");
        });
    } else {
        console.error("Register form not found!");
    }
});

// Fungsi untuk validasi required
function required(value, message) {
    if (!value || value.trim() === "") {
        console.error(message);
        return false;
    }
    return true;
}

// Fungsi untuk validasi nomor telepon
function isPhone(value, message) {
    const phoneRegex = /^62[0-9]{8,15}$/;
    if (!phoneRegex.test(value)) {
        console.error(message);
        return false;
    }
    return true;
}
