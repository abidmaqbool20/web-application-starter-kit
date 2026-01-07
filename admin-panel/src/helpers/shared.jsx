export const extractErrorMessage = (error) => {
  if (error.response && error.response.data) {
    // If the error response contains a message, return it
    return error.response.data.message || "An error occurred";
  } else if (error.message) {
    // If the error has a message property, return it
    return error.message;
  } else {
    // Fallback message
    return "An unknown error occurred";
  }
}
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
export const formatDateTime = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString(undefined, options);
}
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
}
export const formatPercentage = (number) => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(number);
}
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return null;
}