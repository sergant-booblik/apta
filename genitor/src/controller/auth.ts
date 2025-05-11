import { genitorDataSource } from '@/ormconfig';
import type { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { User } from '@/entity/user';
import { validateEmail, validateName, validatePassword } from '@/helper/credentials-validate';
import { calculateDefaultCurrency } from '@/helper/calculate-default-currency';
import type { ErrorData, ErrorDetail } from '@/type/error';

const createToken = (userId: string, type: 'access_token' | 'refresh_token', expiresIn: number): string => {
  return sign(
    { id: userId },
    type,
    { expiresIn },
  );
};

const setCookie = (res: Response, token: string, type: 'accessToken' | 'refreshToken', maxAge: number): void => {
  res.cookie(type, token, {
    httpOnly: true,
    maxAge: maxAge,
    path: '/',
  });
};

async function generateTokensAndSetCookies(res: Response, user: any): Promise<void> {
  const accessToken = createToken(user.id, 'access_token', 24 * 60 * 60);
  const refreshToken = createToken(user.id, 'refresh_token', 30 * 24 * 60 * 60);

  setCookie(res, accessToken, 'accessToken', 24 * 60 * 60 * 1000);
  setCookie(res, refreshToken, 'refreshToken', 7 * 24 * 60 * 60 * 1000);
}

const userRepository = genitorDataSource.getRepository(User);

//TODO Add to register instant login
export const authRegister = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, locale } = req.body;
  const errors: ErrorData = {};

  errors.name = validateName(name);
  errors.email = validateEmail(email);
  errors.password = validatePassword(password);
  errors.general = [] as ErrorDetail[];

  const isUserExist = await userRepository.findOne({
    where: { email: email },
  });

  if (isUserExist) {
    errors.email.push({ label:'Error.Auth.Register.Email.exist' });
  }

  if (errors.email.length > 0 || errors.password.length > 0) {
    res.status(400).send({
      message: 'Credentials are not valid',
      errors: errors,
    });

    return;
  }

  const defaultCurrency = await calculateDefaultCurrency(locale);

  if (!defaultCurrency) {
    res.status(503).send({
      message: 'Can\'t set default currency',
      errors,
    });

    return;
  }

  const user = await userRepository.save({
    name,
    email,
    password: await bcryptjs.hash(password, 12),
    locale,
    defaultCurrency,
    currencies: [defaultCurrency],
  });

  await generateTokensAndSetCookies(res, user);

  res.status(200).send({
    success: true,
  });
};

export const authLogin = async (req: Request, res: Response): Promise<void> => {
  const errors: ErrorData = {};

  const { email, password } = req.body;

  const user = await userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email: email })
    .getOne();

  errors.email = validateEmail(email);
  errors.password = [];
  if (!password) {
    errors.password.push({ label: 'Error.Auth.Password.Validate.empty' });
  }

  if (errors.email.length > 0 || errors.password.length > 0) {
    res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
    return;
  }

  if (!user) {
    errors.email.push({ label: 'Error.Auth.Email.Validate.notExist' });
    res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
    return;
  }

  if (!await bcryptjs.compare(password, user.password)) {
    errors.password.push({ label: 'Error.Auth.Password.Validate.invalid' });
  }

  if (errors.email.length > 0 || errors.password.length > 0) {
    res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
    return;
  }

  await generateTokensAndSetCookies(res, user);

  res.status(200).send({ success: true });
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessToken = req.cookies['accessToken'];

    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      res.status(401).send({
        success: false,
      });
      return;
    }

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error,
    });

    return;
  }
};

export const authRefresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = verify(refreshToken, 'refresh_token');

    if (!payload) {
      res.status(401).send({
        success: false,
        message: 'Unauthenticated. No payload',
      });

      return;
    }

    const accessToken = sign({
      id: payload.id,
    }, 'access_token', { expiresIn: 60 * 60 });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
    });

    res.send({
      success: true,
      message: 'success',
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: `Unauthenticated. Some other errors: ${error}`,
    });
    return;
  }
};

export const authLogout = async (res: Response): Promise<void> => {
  res.cookie('accessToken', 'deleted', { maxAge: 0 });
  res.cookie('refreshToken', 'deleted', { maxAge: 0 });
  res.send({
    success: true,
  });
};
