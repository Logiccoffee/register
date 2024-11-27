import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/element.js';
import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.8/api.js';
import { validatePhoneNumber } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@main/validate.js';

async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById("register-name").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Define validation rules using jscroot
    const validationRules = {
        name: required(name, 'Nama is required'),
        phone: required(phone, 'Nomor Hp is required') && isPhone(phone, 'Nomor Hp must be valid'),
        email: required(email, 'Email is required') && isEmail(email, 'Email is not valid'),
        password: required(password, 'Password is required')
    };

    // Validate form data
    const validationResults = validate(validationRules);

    if (!validationResults.isValid) {
        alert(validationResults.errors.join("\n"));
        return;
    }

    // Create the user object to send to the backend
    const user = {
        Name: name,
        PhoneNumber: phone,
        Email: email,
        Password: password
    };

    // Add Content-Type header to the request
    postJSON(
        "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register",
        '', '', // No tokenkey and tokenvalue
        user,
        function (response) {
            if (response.status === 200) {
                alert('Pendaftaran berhasil! Silakan login.');
                window.location.href = 'https://logiccoffee.id.biz.id/login';
            } else {
                alert(`Error: ${response.data.Response}`);
            }
        },
        {
            "Content-Type": "application/json"
        }
    );
}

// Assign the registerUser function to a button with ID "register-button" using onClick
onClick("register-button", registerUser);

// Add Enter key listener for form submission
document.getElementById("register-form").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default behavior
        registerUser(event); // Trigger registerUser function
    }
});

// Validate phone number input on the fly
const phoneNumberInput = document.getElementById("register-phone");
phoneNumberInput.addEventListener("input", () => {
    validatePhoneNumber(phoneNumberInput); // Automatically format the phone number
});
