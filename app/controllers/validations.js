exports.validateEmail = valor => {
  return /^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(valor);
};

exports.validatePassword = valor => {
  return /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(valor);
};
