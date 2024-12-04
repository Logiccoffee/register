import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

// Fungsi validasi input wajib diisi
function required(value, message) {
    if (!value || value.trim() === "") {
        return message;
    }
    return true;
}

// Endpoint backend
const backend = {
    register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // Ganti dengan URL backend Anda
};

// Menangani klik pada tombol daftar
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector("#register-button");

    if (!registerButton) {
        console.error("Tombol daftar tidak ditemukan.");
        return;
    }

    registerButton.addEventListener("click", async (e) => {
        e.preventDefault(); // Mencegah submit form default

        const registerForm = document.querySelector(".register-form");

        if (!registerForm) {
            Swal.fire("Error", "Formulir pendaftaran tidak ditemukan.", "error");
            return;
        }

        // Ambil nilai input form
        const getEmail = document.querySelector("input[name='Email']").value;
        const getName = document.querySelector("input[name='Name']").value;
        const getPassword = document.querySelector("input[name='Password']").value;
        const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

        // Validasi input
        const emailError = required(getEmail, "Email wajib diisi");
        const nameError = required(getName, "Nama wajib diisi");
        const passwordError = required(getPassword, "Password wajib diisi");
        const phoneError = validatePhoneNumber(getPhoneNumber)
            ? true
            : "Nomor telepon tidak valid. Harap gunakan format internasional.";

        if (emailError !== true || nameError !== true || passwordError !== true || phoneError !== true) {
            Swal.fire(
                "Error Validasi",
                [emailError, nameError, passwordError, phoneError]
                    .filter((msg) => msg !== true)
                    .join("\n"),
                "warning"
            );
            return;
        }

        // Data yang akan dikirim ke backend
        const datajson = {
            Email: getEmail,
            Name: getName,
            Password: getPassword,
            PhoneNumber: getPhoneNumber,
        };

        try {
            // Menggunakan postJSON dari jscroot
            const response = await postJSON(backend.register, datajson);

            if (response.status === 200) {
                Swal.fire({
                    title: "Pendaftaran Berhasil",
                    text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
                    icon: "success",
                }).then(() => {
                    window.location.href = "/login"; // Ganti dengan URL halaman login
                });
            } else {
                Swal.fire(
                    "Error",
                    response.message || "Terjadi kesalahan pada server.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Gagal menghubungi server. Periksa koneksi Anda.", "error");
        }
    });
});
