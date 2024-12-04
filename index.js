import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';

document.addEventListener("DOMContentLoaded", () => {
    // Pastikan elemen dengan ID 'register-button' ada di DOM
    const button = document.querySelector("#register-button");
    if (!button) {
        console.error("Elemen #register-button tidak ditemukan!");
        return;
    }

    // Gunakan onClick dari jscroot
    onClick("#register-button", async (event) => {
        event.preventDefault(); // Mencegah reload halaman

        // Ambil nilai input form
        const getEmail = document.querySelector("input[name='Email']").value.trim();
        const getName = document.querySelector("input[name='Name']").value.trim();
        const getPassword = document.querySelector("input[name='Password']").value.trim();
        const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value.trim();

        // Validasi input
        const errors = [];
        if (!getEmail) errors.push("Email tidak boleh kosong.");
        if (!getName) errors.push("Nama tidak boleh kosong.");
        if (!getPassword) errors.push("Password tidak boleh kosong.");
        if (!/^62[0-9]{8,15}$/.test(getPhoneNumber)) errors.push("Nomor telepon harus dimulai dengan '62' dan memiliki panjang yang sesuai.");

        if (errors.length > 0) {
            Swal.fire("Validasi Gagal", errors.join("<br>"), "warning");
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datajson),
        };

        try {
            // Kirim data ke backend
            const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", requestOptions);
            const result = await response.json();

            if (response.status === 200) {
                Swal.fire({
                    title: "Pendaftaran Berhasil",
                    text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
                    icon: "success",
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.location.href = "/login"; // Ganti dengan URL halaman login
                    }
                });
            } else {
                Swal.fire("Gagal Mendaftar", result.message || "Terjadi kesalahan.", "info");
            }
        } catch (error) {
            console.error("Error saat pendaftaran:", error);
            Swal.fire("Error", "Terjadi kesalahan pada server. Coba lagi nanti.", "error");
        }
    });
});
