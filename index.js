import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';

document.addEventListener("DOMContentLoaded", () => {
    const backend = {
        register: "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register",
    };

    // Fungsi untuk menangani pendaftaran
    const registerUser = async () => {
        // Ambil nilai input form
        const getEmail = document.querySelector("input[name='Email']").value;
        const getName = document.querySelector("input[name='Name']").value;
        const getPassword = document.querySelector("input[name='Password']").value;
        const getPhoneNumber = document.querySelector("input[name='PhoneNumber']").value;

        const datajson = {
            Email: getEmail,
            Name: getName,
            Password: getPassword,
            PhoneNumber: getPhoneNumber,
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datajson),
        };

        try {
            const response = await fetch(backend.register, requestOptions);
            const result = await response.json();

            if (response.status === 200) {
                Swal.fire({
                    title: "Pendaftaran Berhasil",
                    text: "Silakan login menggunakan WhatsAuth untuk melanjutkan.",
                    icon: "success",
                }).then(() => {
                    window.location.href = "/login";
                });
            } else {
                Swal.fire("Gagal Mendaftar", result.message || "Terjadi kesalahan.", "info");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Something went wrong!", "error");
        }
    };

    // Menghubungkan tombol "Daftar" dengan fungsi registerUser
    onClick("register-button", registerUser); // Untuk tombol daftar
});
