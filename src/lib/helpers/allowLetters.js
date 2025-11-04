export const allowLetters = (inputValue) => {
  const sanitizedValue = inputValue.replace(/[^a-zA-ZƏəÇçĞğİıÖöŞşÜü]+/g, "");
  return sanitizedValue;
};
