export const validatePassword = (password) => {
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  let strength = 'weak';
  let isValid = false;
  
  if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
    strength = 'strong';
    isValid = true;
  } else if (password.length >= 6 && hasUpperCase && hasLowerCase) {
    strength = 'good';
    isValid = true;
  } else if (password.length >= 6) {
    strength = 'fair';
    isValid = true;
  }
  
  const messages = {
    strong: '✓ Strong password',
    good: '✓ Good password',
    fair: 'Password should include uppercase, lowercase letters and numbers',
    weak: 'Password must be at least 6 characters'
  };
  
  return {
    isValid,
    message: messages[strength],
    strength
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const isValid = password === confirmPassword && confirmPassword.length > 0;
  return {
    isValid,
    message: isValid ? '✓ Passwords match' : 'Passwords do not match'
  };
};