module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmpassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'username should not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'email should not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be valid email address'
        }
    }
    if (password === '') {
        errors.password = 'Password must not be empty'
    } else if (password !== confirmpassword) {
        errors.confirmpassword = 'Passwords must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'username should not be empty';
    }
    if (password.trim() === '') {
        errors.username = 'password should not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}