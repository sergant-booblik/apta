import { validateName } from '@/helper/credentials-validate';

describe('validatePassword', () => {
  it('should return error if name is empty', () => {
    expect(validateName('')).toEqual([
      { label: 'Error.Auth.Name.Validate.empty' },
    ]);
  });

  it('should return empty array for valid name', () => {
    expect(validateName('Name')).toEqual([]);
  });
});