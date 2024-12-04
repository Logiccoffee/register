import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';

document.addEventListener("DOMContentLoaded", () => {
    // Pastikan elemen dengan ID #register-button ada di DOM
    const button = document.querySelector("#register-button");

    if (!button) {
        console.error("Elemen #register-button tidak ditemukan!");
        return;
    }

    // Gunakan fungsi onClick dari jscroot
    onClick("#register-button", async (event) => {
        event.preventDefault(); // Mencegah form submit default

        // Ambil nilai input dari form
        const getName = document.querySelector("#register-name").value.trim();
        const getPhoneNumber = document.querySelector("#register-phone").value.trim();
        const getEmail = document.querySelector("#register-email").value.trim();
        const getPassword = document.querySelector("#register-password").value.trim();

        // Validasi input
        const errors = [];
        if (!getName) errors.push("Nama tidak boleh kosong.");
        if (!getEmail) errors.push("Email tidak boleh kosong.");
        if (!getPassword) errors.push("Password tidak boleh kosong.");
        if (!/^62[0-9]{8,15}$/.test(getPhoneNumber)) {
            errors.push("Nomor telepon harus dimulai dengan '62' dan memiliki panjang 8-15 digit.");
        }

        if (errors.length > 0) {
            Swal.fire("Validasi Gagal", errors.join("<br>"), "warning");
            return;
        }

        // Data untuk dikirim ke server
        const datajson = {
            Name: getName,
            PhoneNumber: getPhoneNumber,
            Email: getEmail,
            Password: getPassword,
        };

        // Konfigurasi request
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datajson),
        };

        try {
            const response = await fetch(
                "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register",
                requestOptions
            );
            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Pendaftaran Berhasil",
                    text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
                    icon: "success",
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = "https://logiccoffee.id.biz.id/login"; // Redirect ke halaman login
                    }
                });
            } else {
                Swal.fire("Gagal Mendaftar", result.message || "Terjadi kesalahan.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
        }
    });
});
