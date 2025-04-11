import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { genitorDataSource } from '../../ormconfig';
import { User } from '../entity/user';
import { sign, verify } from "jsonwebtoken";
import { validateEmail, validateName, validatePassword } from '../helper/credentials-validate'
import { ErrorData, ErrorDetail } from '../type/error'
import { calculateDefaultCurrency } from '../helper/calculate-default-currency'

const userRepository = genitorDataSource.getRepository(User);

//TODO Add to register instant login
export const authRegister = async (req: Request, res: Response) => {
  const { email, password, name, locale } = req.body;
  const errors: ErrorData = {};

  errors.name = validateName(name);
  errors.email = validateEmail(email);
  errors.password = validatePassword(password);
  errors.general = [] as ErrorDetail[];

  const isUserExist = await userRepository.findOne({
    where: { email: email }
  });

  if (isUserExist) {
    errors.email.push({ label:'Error.Auth.Register.Email.exist' })
  }

  if (errors.email.length > 0 || errors.password.length > 0) {
    return res.status(400).send({
      message: 'Credentials are not valid',
      errors: errors,
    });
  }

  const defaultCurrency = await calculateDefaultCurrency(locale);

  if (!defaultCurrency) {
    return res.status(503).send({
      message: 'Can\'t set default currency',
      errors,
    })
  }

  const user = await userRepository.save({
    name,
    email,
    password: await bcryptjs.hash(password, 12),
    locale,
    defaultCurrency,
    currencies: [defaultCurrency],
  });

  const accessToken = sign({
    id: user.id
  }, 'access_token', {expiresIn: 24 * 60 * 60});

  const refreshToken = sign({
    id: user.id
  }, 'refresh_token', {expiresIn: 30 * 24 * 60 * 60 });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.status(200).send({
    success: true,
  });
}

export const authLogin = async (req: Request, res: Response) => {
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
    return res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
  }

  if (!user) {
    errors.email.push({ label: 'Error.Auth.Email.Validate.notExist' });
    return res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
  }

  if (!await bcryptjs.compare(password, user.password)) {
    errors.password.push({ label: 'Error.Auth.Password.Validate.invalid' });
  }

  if (errors.email.length > 0 || errors.password.length > 0) {
    return res.status(400).send({
      message: 'Invalid Credentials',
      errors: errors,
    });
  }

  const accessToken = sign({
    id: user.id
  }, 'access_token', {expiresIn: 24 * 60 * 60});

  const refreshToken = sign({
    id: user.id
  }, 'refresh_token', {expiresIn: 30 * 24 * 60 * 60 });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return res.status(200).send({ success: true });
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      return res.status(401).send({
        success: false,
      });
    }

    res.status(200).send({
      success: true,
    })
  } catch (e) {
    return res.status(401).send({
      success: false,
    })
  }
}

export const authRefresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = verify(refreshToken, 'refresh_token');

    if (!payload) {
      return res.status(401).send({
        success: false,
        message: 'Unauthenticated. No payload'
      });
    }

    const accessToken = sign({
      id: payload.id,
    }, 'access_token', { expiresIn: 60 * 60 })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
    });

    res.send({
      success: true,
      message: 'success',
    })
  } catch (e) {
    return res.status(401).send({
      success: false,
      message: 'Unauthenticated. Some other errors'
    });
  }
}

export const authLogout = async (req: Request, res: Response) => {
  res.cookie('accessToken', 'deleted', { maxAge: 0 });
  res.cookie('refreshToken', 'deleted', { maxAge: 0 });
  res.send({
    success: true,
  })
}
