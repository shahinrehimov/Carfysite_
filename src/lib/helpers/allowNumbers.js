export const allowNumbers = (inputValue) => {
  const sanitizedValue = inputValue.replace(/\D/g, "");
  return sanitizedValue;
};
