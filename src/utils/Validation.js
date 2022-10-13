export function checkPassword(password) {
    if (!(password.trim() === "")) {
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{8,}/;
        const uppercasePassword = uppercaseRegExp.test(password);
        const lowercasePassword = lowercaseRegExp.test(password);
        const digitsPassword = digitsRegExp.test(password);
        const specialCharPassword = specialCharRegExp.test(password);
        const minLengthPassword = minLengthRegExp.test(password);

        let errMsg = "";

        if (!uppercasePassword) {
            errMsg = "at least one uppercase";
        } else if (!lowercasePassword) {
            errMsg = "at least one lowercase";
        } else if (!digitsPassword) {
            errMsg = "at least one digit";
        } else if (!specialCharPassword) {
            errMsg = "at least one special characters";
        } else if (!minLengthPassword) {
            errMsg = "at least 8 characters";
        } else {
            return errMsg = "";
        }
        if (errMsg) {
            return ({
                errorMessage: errMsg,
                isPasswordValid: false

            })
        }
    }
    return true

}
