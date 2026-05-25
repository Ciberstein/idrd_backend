const isFirstLetterUpperCase = (value) => {
  return /^[A-Z]/.test(value);
};

const containsSpecialCharacters = (value) => {
  const regex = /^[A-Za-z0-9]+$/;
  return regex.test(value);
};

const isEmailValid = (value) => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(value);
};

module.exports = { isFirstLetterUpperCase, containsSpecialCharacters, isEmailValid };
