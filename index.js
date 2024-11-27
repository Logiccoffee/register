import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';

// Fungsi untuk menangani pendaftaran user
function registerUser(event) {
    event.preventDefault(); // Mencegah form melakukan reload halaman

    // Ambil nilai dari input form
    const name = document.getElementById("register-name").value.trim();
    const phoneNumber = document.getElementById("register-phone").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validasi input pengguna
    if (!name || !phoneNumber || !email || !password) {
        alert("Semua field wajib diisi!");
        return;
    }

    // Data yang akan dikirim ke backend
    const userData = {
        Name: name,
        PhoneNumber: phoneNumber,
        Email: email,
        Password: password,
    };

    // URL endpoint registrasi
    const targetUrl = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register";

    // Kirim data menggunakan fungsi postJSON
    postJSON(targetUrl, userData, function (response) {
        const { status, data } = response;

        // Tampilkan hasil berdasarkan status respons
        if (status === 200) {
            alert("Registrasi berhasil! Silakan masuk dengan akun Anda.");
            console.log(data);
            window.location.href = "https://logiccoffee.id.biz.id/login"; // Redirect ke halaman login
        } else {
            alert(`Registrasi gagal: ${data.response || "Terjadi kesalahan pada server."}`);
            console.error(data);
        }
    });
}

// Bind fungsi registerUser ke tombol dengan ID 'register-button'
document.addEventListener('DOMContentLoaded', () => {
    onClick('register-button', registerUser);
});
