import type { ErrorDetail } from '@/type/error';

const PASSWORD_LENGTH = 8;
const REGEX_AT_LEAST_ONE_UPPERCASE = new RegExp('[A-Z]');
const REGEX_AT_LEAST_ONE_LOWERCASE = new RegExp('[a-z]');
const REGEX_AT_LEAST_ONE_DIGIT = new RegExp('[0-9]');
const REGEX_AT_LEAST_ONE_SPEC_CHAR = new RegExp('[!@#$%^&*()_+\\-=[\\]{};\':"\\\\|,.<>/?]');
const REGEX_HAS_SPACE = new RegExp('\\s');

export function validateEmail(email: string): ErrorDetail[] {
  const emailErrors: ErrorDetail[] = [];

  if (!email) {
    emailErrors.push({ label: 'Error.Auth.Email.Validate.empty' });
    return emailErrors;
  }

  if (REGEX_HAS_SPACE.test(email)) {
    emailErrors.push({ label: 'Error.Auth.Email.Validate.space' });
  }

  if (!email.includes('@')) {
    emailErrors.push({ label: 'Error.Auth.Email.Validate.at' });
  } else {
    const [localPart, domainPart] = email.split('@');

    if (!localPart) {
      emailErrors.push({ label: 'Error.Auth.Email.Validate.localPart' });
    }

    if (!domainPart) {
      emailErrors.push({ label: 'Error.Auth.Email.Validate.domainPart' });
    } else if (!domainPart.includes('.')) {
      emailErrors.push({ label: 'Error.Auth.Email.Validate.point' });
    } else {
      const domainParts = domainPart.split('.');
      if (domainParts.some(part => part.length === 0) && domainParts.length > 2) {
        emailErrors.push({ label: 'Error.Auth.Email.Validate.empties' });
      }
      const tld = domainParts[domainParts.length - 1];
      if (tld.length < 2) {
        emailErrors.push({ label: 'Error.Auth.Email.Validate.highLevelDomain' });
      }
    }
  }

  return emailErrors;
}

export function validatePassword(password: string): ErrorDetail[] {
  const passwordErrors: ErrorDetail[] = [];

  if (!password) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.empty' });
    return passwordErrors;
  }

  if (password.length < PASSWORD_LENGTH) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.length', params: { length: PASSWORD_LENGTH } });
  }

  if (!REGEX_AT_LEAST_ONE_UPPERCASE.test(password)) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.uppercase' });
  }

  if (!REGEX_AT_LEAST_ONE_LOWERCASE.test(password)) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.lowercase' });
  }

  if (!REGEX_AT_LEAST_ONE_DIGIT.test(password)) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.digit' });
  }

  if (!REGEX_AT_LEAST_ONE_SPEC_CHAR.test(password)) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.char' });
  }

  if (REGEX_HAS_SPACE.test(password)) {
    passwordErrors.push({ label: 'Error.Auth.Password.Validate.space' });
  }

  return passwordErrors;
}

export function validateName(name: string): ErrorDetail[] {
  const nameErrors: ErrorDetail[] = [];

  if (!name) {
    nameErrors.push({ label: 'Error.Auth.Name.Validate.empty' });
  }

  return nameErrors;
}