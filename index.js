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

    // Directly pass the URL to postJSON
    postJSON('https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/auth/register', '', '', user, function(response) {
        if (response.status === 200) {
            alert('Pendaftaran berhasil! Silakan login.');
            // Optionally, redirect the user to the login page
            window.location.href = 'https://logiccoffee.id.biz.id/login';
        } else {
            alert(`Error: ${response.data.Response}`);
        }
    });
}
