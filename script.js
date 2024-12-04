import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

// Fungsi untuk menangani klik tombol "Daftar"
onClick("register-button", registerUser);

// Fungsi untuk validasi nomor telepon saat pengguna mengetik
const phoneNumberInput = document.getElementById("register-phone");
phoneNumberInput.addEventListener("input", () => {
    validatePhoneNumber(phoneNumberInput); // Memformat nomor telepon secara otomatis
});

// Fungsi utama untuk menangani pendaftaran
function registerUser() {
    // Ambil elemen input
    const getEmail = document.querySelector("input[name='Email']").value.trim();
    const getName = document.querySelector("input[name='Name']").value.trim();
    const getPassword = document.querySelector("input[name='Password']").value.trim();
    const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value.trim();

    // Validasi input
    const validations = [
        required(getName, "Nama wajib diisi."),
        required(getEmail, "Email wajib diisi."),
        required(getPassword, "Password wajib diisi."),
        required(getPhoneNumber, "Nomor telepon wajib diisi."),
        isPhone(getPhoneNumber, "Nomor telepon harus menggunakan format 62 dan angka yang valid."),
        isEmail(getEmail, "Format email tidak valid."),
    ];

    const errors = validations.filter((result) => result !== true); // Ambil semua pesan error

    if (errors.length > 0) {
        Swal.fire("Validasi Gagal", errors[0], "error"); // Tampilkan pesan error pertama
        return;
    }

    // Data JSON untuk dikirim ke server
    const datajson = {
        Email: getEmail,
        Name: getName,
        Password: getPassword,
        PhoneNumber: getPhoneNumber,
    };

    // Kirim data ke backend
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register", // URL backend
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datajson),
    };

    fetch(backend.register, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result && result.status === 200) {
                Swal.fire({
                    title: "Pendaftaran Berhasil",
                    text: "Silakan login menggunakan akun Anda.",
                    icon: "success",
                }).then(() => {
                    window.location.href = "/login"; // Arahkan ke halaman login
                });
            } else {
                Swal.fire("Gagal Mendaftar", result.message || "Terjadi kesalahan.", "info");
            }
        })
        .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Gagal terhubung ke server.", "error");
        });
}

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

// Fungsi untuk validasi email
function isEmail(value, message) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
        return message;
    }
    return true;
}

// Fungsi untuk memformat nomor telepon secara otomatis
function validatePhoneNumber(inputElement) {
    let value = inputElement.value.replace(/\D/g, ""); // Hapus karakter non-angka
    if (!value.startsWith("62")) {
        value = "62" + value; // Tambahkan "62" di depan jika belum ada
    }
    inputElement.value = value;
}

// Fungsi untuk menambahkan event listener berdasarkan ID
function onClick(buttonId, callback) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener("click", callback);
    }
}
