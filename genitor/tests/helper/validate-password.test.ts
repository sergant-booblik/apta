import { validatePassword } from '@/helper/credentials-validate';

describe('validatePassword', () => {
  it('should return error if password is empty', () => {
    expect(validatePassword('')).toEqual([
      { label: 'Error.Auth.Password.Validate.empty' },
    ]);
  });

  it('should return error if password is too short', () => {
    expect(validatePassword('Ab1!')).toEqual([
      { label: 'Error.Auth.Password.Validate.length', params: { length: 8 } },
    ]);
  });

  it('should return error if no uppercase letter', () => {
    expect(validatePassword('abc1!def')).toContainEqual({
      label: 'Error.Auth.Password.Validate.uppercase',
    });
  });

  it('should return error if no lowercase letter', () => {
    expect(validatePassword('ABC1!DEF')).toContainEqual({
      label: 'Error.Auth.Password.Validate.lowercase',
    });
  });

  it('should return error if no digit', () => {
    expect(validatePassword('Abc!Defg')).toContainEqual({
      label: 'Error.Auth.Password.Validate.digit',
    });
  });

  it('should return error if no special character', () => {
    expect(validatePassword('Abc1Defg')).toContainEqual({
      label: 'Error.Auth.Password.Validate.char',
    });
  });

  it('should return error if contains spaces', () => {
    expect(validatePassword('Abc1! De')).toContainEqual({
      label: 'Error.Auth.Password.Validate.space',
    });
  });

  it('should return all relevant errors for a bad password', () => {
    expect(validatePassword('abc')).toEqual(expect.arrayContaining([
      { label: 'Error.Auth.Password.Validate.length', params: { length: 8 } },
      { label: 'Error.Auth.Password.Validate.uppercase' },
      { label: 'Error.Auth.Password.Validate.digit' },
      { label: 'Error.Auth.Password.Validate.char' },
    ]));
  });

  it('should return empty array for valid password', () => {
    expect(validatePassword('Abc1!def')).toEqual([]);
  });
});