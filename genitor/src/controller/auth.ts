import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { genitorDataSource } from '../../ormconfig';
import { User } from '../entity/user';
import { sign, verify } from "jsonwebtoken";

const userRepository = genitorDataSource.getRepository(User);

//TODO Add to register instant login
export const AuthRegister = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;


  //TODO rewrite for empty credentials
  if (!name || !email || !password) {
    return res.status(400).send({
      message: 'Invalid Credentials',
      error: 'Error.Invalid.Credentials',
    });
  }

  const user = await userRepository.save({
    name,
    email,
    password: await bcryptjs.hash(password, 12)
  });

  //TODO add logic for cases when user is already exist

  res.send(user);
}

export const AuthLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findOne({
    where: {
      email: email,
    }
  });

  if (!user) {
    return res.status(400).send({
      message: 'Invalid Credentials',
      error: 'Error.Invalid.Credentials',
    })
  }

  if (!await bcryptjs.compare(password, user.password)) {
    return res.status(400).send({
      message: 'Invalid Credentials',
      error: 'Error.Invalid.Credentials',
    })
  }

  const accessToken = sign({
    id: user.id
  }, 'access_token', {expiresIn: 24 * 60 * 60});

  const refreshToken = sign({
    id: user.id
  }, 'refresh_token', {expiresIn: 30 * 24 * 60 * 60 });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 //equivalent to 7 days
  });

  return res.status(200).send({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

export const AuthUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      return res.status(401).send({
        message: 'Unauthenticated',
        error: 'Error.Invalid.Unauthenticated',
      });
    }

    const user = await userRepository.findOne({
      where: {
        id: payload.id,
      }
    });

    if(!user) {
      return res.status(401).send({
        message: 'Unauthenticated. No user',
        error: 'Error.Invalid.Unauthenticated',
      });
    }

    const { password, ...data } = user;

    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: 'Unauthenticated. Some errors',
      error: 'Error.Invalid.Unauthenticated',
    })
  }
}

//TODO it doesn't work
export const AuthRefresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];

    const payload: any = verify(refreshToken, 'refresh_token');

    if (!payload) {
      return res.status(401).send({
        message: 'Unauthenticated. No payload'
      })
    }

    const accessToken = sign({
      id: payload.id,
    }, 'access_token', { expiresIn: 60 * 60 })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
    });

    res.send({
      message: 'success'
    })
  } catch (e) {
    return res.status(401).send({
      message: 'Unauthenticated. Some other errors'
    })
  }
}

export const AuthLogout = async (req: Request, res: Response) => {
  res.cookie('accessToken', '', { maxAge: 0 });
  res.cookie('refreshToken', '', { maxAge: 0 });
  res.send({
    message: 'success'
  })
}
