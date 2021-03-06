function setErrors(errors) {
  return { type : 'SET_ERRORS', errors };
};

function hideErrors() {
  return { type : 'HIDE_ERRORS' };
};

function clearErrors() {
  return { type : 'CLEAR_ERRORS' };
};
export { setErrors, hideErrors, clearErrors };