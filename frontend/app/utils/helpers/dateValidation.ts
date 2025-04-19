export default function validateDateInput(value: string) {
  // Remove any non-digit characters
  const numbers = value.replace(/\D/g, "");

  // Add hyphens automatically
  let formattedValue = "";
  for (let i = 0; i < numbers.length && i < 8; i++) {
    if (i === 4 || i === 6) {
      formattedValue += "-";
    }
    formattedValue += numbers[i];
  }

  return formattedValue;
};
