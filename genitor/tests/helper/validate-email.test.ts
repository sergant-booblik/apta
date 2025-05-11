import { validateEmail } from '@/helper/credentials-validate';

describe('validateEmail', () => {
  it('should return error if email is empty', () => {
    const result = validateEmail('');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.empty' }]);
  });

  it('should return error if email contains spaces', () => {
    const result = validateEmail('invalid email@example.com');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.space' }]);
  });

  it('should return error if email does not contain @', () => {
    const result = validateEmail('invalidemail.com');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.at' }]);
  });

  it('should return error if email has empty local part', () => {
    const result = validateEmail('@example.com');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.localPart' }]);
  });

  it('should return error if email has empty domain part', () => {
    const result = validateEmail('email@');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.domainPart' }]);
  });

  it('should return error if domain part does not contain a dot', () => {
    const result = validateEmail('email@com');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.point' }]);
  });

  it('should return error if domain contains empty parts', () => {
    const result = validateEmail('email@domain..com');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.empties' }]);
  });

  it('should return error if top-level domain is too short', () => {
    const result = validateEmail('email@domain.c');
    expect(result).toEqual([{ label: 'Error.Auth.Email.Validate.highLevelDomain' }]);
  });

  it('should return no errors for valid email', () => {
    const result = validateEmail('email@example.com');
    expect(result).toEqual([]);
  });
});