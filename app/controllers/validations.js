exports.validateEmail = email => /^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(email);

exports.validatePassword = password => /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(password);
