export interface ErrorData {
  label: string,
  params?: Record<string, any>,
}

const PASSWORD_LENGTH = 8;
const REGEX_AT_LEAST_ONE_UPPERCASE = new RegExp('[A-Z]');
const REGEX_AT_LEAST_ONE_LOWERCASE = new RegExp('[a-z]');
const REGEX_AT_LEAST_ONE_DIGIT = new RegExp('[0-9]');
const REGEX_AT_LEAST_ONE_SPEC_CHAR = new RegExp('[!@#$%^&*()_+\\-=[\\]{};\':"\\\\|,.<>/?]');
const REGEX_HAS_SPACE = new RegExp('[\\s]');

export function validateEmail(email: string): ErrorData[] {
  const errors: ErrorData[] = [];

  if (!email) {
    errors.push({ label: 'Error.Auth.Email.Validate.empty' });
    return errors;
  }

  if (REGEX_HAS_SPACE.test(email)) {
    errors.push({ label: 'Error.Auth.Email.Validate.space' });
  }

  if (!email.includes('@')) {
    errors.push({ label: 'Error.Auth.Email.Validate.at' });
  } else {
    const [localPart, domainPart] = email.split('@');

    if (!localPart) {
      errors.push({ label: 'Error.Auth.Email.Validate.localPart' });
    }

    if (!domainPart) {
      errors.push({ label: 'Error.Auth.Email.Validate.domainPart' });
    } else if (!domainPart.includes('.')) {
      errors.push({ label: 'Error.Auth.Email.Validate.point' });
    } else {
      const domainParts = domainPart.split('.');
      if (domainParts.some(part => part.length === 0)) {
        errors.push({ label: 'Error.Auth.Email.Validate.empties' });
      }
      const tld = domainParts[domainParts.length - 1];
      if (tld.length < 2) {
        errors.push({ label: 'Error.Auth.Email.Validate.highLevelDomain' });
      }
    }
  }

  return errors;
}

export function validatePassword(password: string): ErrorData[] {
  const errors: ErrorData[] = [];

  if (!password) {
    errors.push({ label: 'Error.Auth.Password.Validate.empty' });
    return errors;
  }

  if (password.length < PASSWORD_LENGTH) {
    errors.push({ label: 'Error.Auth.Password.Validate.length', params: { length: PASSWORD_LENGTH } });
  }

  if (!REGEX_AT_LEAST_ONE_UPPERCASE.test(password)) {
    errors.push({ label: 'Error.Auth.Password.Validate.uppercase' });
  }

  if (!REGEX_AT_LEAST_ONE_LOWERCASE.test(password)) {
    errors.push({ label: 'Error.Auth.Password.Validate.lowercase' });
  }

  if (!REGEX_AT_LEAST_ONE_DIGIT.test(password)) {
    errors.push({ label: 'Error.Auth.Password.Validate.digit' });
  }

  if (!REGEX_AT_LEAST_ONE_SPEC_CHAR.test(password)) {
    errors.push({ label: 'Error.Auth.Password.Validate.char' });
  }

  if (REGEX_HAS_SPACE.test(password)) {
    errors.push({ label: 'Error.Auth.Password.Validate.space' });
  }

  return errors;
}
