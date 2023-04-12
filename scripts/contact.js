// Get the form and the submit button
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('input[type="submit"]');

// Add event listener to form submission
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from submitting
  
  // Check for errors
  let errors = false;
  
  // Check name field
  const nameField = form.querySelector('#name');
  const nameError = form.querySelector('#name-error');
  if (nameField.value.trim() === '') {
    errors = true;
    nameField.classList.add('error-field');
    nameError.textContent = 'Please fill out this field';
  } else {
    nameField.classList.remove('error-field');
    nameError.textContent = '';
  }
  
  // Check email field
  const emailField = form.querySelector('#email1');
  const emailError = form.querySelector('#email-error');
  if (emailField.value.trim() === '') {
    errors = true;
    emailField.classList.add('error-field');
    emailError.textContent = 'Please fill out this field';
  } else if (!isValidEmail(emailField.value)) {
    errors = true;
    emailField.classList.add('error-field');
    emailError.textContent = 'Please enter a valid email address';
  } else {
    emailField.classList.remove('error-field');
    emailError.textContent = '';
  }
  
  // Check phone field
  const phoneField = form.querySelector('#phone');
  const phoneError = form.querySelector('#phone-error');
  if (phoneField.value.trim() === '') {
    errors = true;
    phoneField.classList.add('error-field');
    phoneError.textContent = 'Please fill out this field';
  } else if (!isValidPhone(phoneField.value)) {
    errors = true;
    phoneField.classList.add('error-field');
    phoneError.textContent = 'Please enter a valid phone number';
  } else {
    phoneField.classList.remove('error-field');
    phoneError.textContent = '';
  }
  
  // Check if any errors
  if (errors) {
    alert('Some required information is missing or incomplete.'); 
    return false; 
  } else {
    alert('Thank you for your contact!'); 
    form.submit(); 
  }
});

// Function to validate email
function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

// Function to validate phone number
function isValidPhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}
