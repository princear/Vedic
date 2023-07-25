export const isEmailValid = email => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;
  else return false;
};
