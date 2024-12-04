import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';

document.addEventListener("DOMContentLoaded", () => {
    // Menggunakan onClick dengan ID register-button
    onClick("#register-button", async () => {
        // Ambil nilai input form
        const getEmail = document.querySelector("input[name='Email']").value;
        const getName = document.querySelector("input[name='Name']").value;
        const getPassword = document.querySelector("input[name='Password']").value;
        const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

        // Validasi input
        const errors = [
            !getEmail.trim() && "Email tidak boleh kosong",
            !getName.trim() && "Nama tidak boleh kosong",
            !getPassword.trim() && "Password tidak boleh kosong",
            !/^62[0-9]{8,15}$/.test(getPhoneNumber) && "Nomor telepon tidak valid",
        ].filter((msg) => msg);

        if (errors.length > 0) {
            Swal.fire("Validasi Gagal", errors.join("\n"), "warning");
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
            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", requestOptions);
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
});
