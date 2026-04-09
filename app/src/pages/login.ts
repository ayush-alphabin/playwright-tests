import { login, logout, getCurrentUser } from '../utils/auth';
import { validateEmail, validatePassword } from '../utils/validation';

export function renderLogin(container: HTMLElement): void {
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Login';
  container.appendChild(heading);

  const currentUser = getCurrentUser();

  if (currentUser) {
    renderLoggedInState(container, currentUser.name);
    return;
  }

  renderLoginForm(container);
}

function renderLoggedInState(container: HTMLElement, name: string): void {
  const successMsg = document.createElement('div');
  successMsg.setAttribute('data-testid', 'login-success');
  successMsg.className = 'login-success';
  successMsg.textContent = `Welcome back, ${name}!`;
  container.appendChild(successMsg);

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn btn-secondary';
  logoutBtn.setAttribute('data-testid', 'logout-btn');
  logoutBtn.textContent = 'Logout';
  logoutBtn.addEventListener('click', () => {
    logout();
    renderLogin(container);
  });
  container.appendChild(logoutBtn);
}

function renderLoginForm(container: HTMLElement): void {
  const form = document.createElement('form');
  form.className = 'login-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  // Email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';

  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  emailLabel.htmlFor = 'email';
  emailGroup.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.placeholder = 'Enter your email';
  emailInput.setAttribute('data-testid', 'email-input');
  emailGroup.appendChild(emailInput);

  const emailError = document.createElement('div');
  emailError.className = 'field-error';
  emailGroup.appendChild(emailError);

  form.appendChild(emailGroup);

  // Password field
  const passGroup = document.createElement('div');
  passGroup.className = 'form-group';

  const passLabel = document.createElement('label');
  passLabel.textContent = 'Password';
  passLabel.htmlFor = 'password';
  passGroup.appendChild(passLabel);

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.id = 'password';
  passInput.placeholder = 'Enter your password';
  passInput.setAttribute('data-testid', 'password-input');
  passGroup.appendChild(passInput);

  const passError = document.createElement('div');
  passError.className = 'field-error';
  passGroup.appendChild(passError);

  form.appendChild(passGroup);

  // Error message
  const errorMsg = document.createElement('div');
  errorMsg.setAttribute('data-testid', 'login-error');
  errorMsg.className = 'login-error';
  form.appendChild(errorMsg);

  // Success message
  const successMsg = document.createElement('div');
  successMsg.setAttribute('data-testid', 'login-success');
  successMsg.className = 'login-success';
  form.appendChild(successMsg);

  // Login button
  const loginBtn = document.createElement('button');
  loginBtn.type = 'submit';
  loginBtn.className = 'btn btn-primary';
  loginBtn.setAttribute('data-testid', 'login-btn');
  loginBtn.textContent = 'Login';

  loginBtn.addEventListener('click', () => {
    // Clear previous messages
    emailError.textContent = '';
    passError.textContent = '';
    errorMsg.textContent = '';
    successMsg.textContent = '';

    const email = emailInput.value.trim();
    const password = passInput.value;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      emailError.textContent = emailValidation.error || 'Invalid email';
      return;
    }

    // Validate password
    const passValidation = validatePassword(password);
    if (!passValidation.valid) {
      passError.textContent = passValidation.errors.join('. ');
      return;
    }

    // Attempt login
    const result = login(email, password);
    if (result.success) {
      renderLogin(container);
    } else {
      errorMsg.textContent = result.error || 'Login failed';
    }
  });

  form.appendChild(loginBtn);
  container.appendChild(form);
}
