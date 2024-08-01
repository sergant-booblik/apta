import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { genitorDataSource } from '../../ormconfig';
import { Admin } from '../entity/admin';
import { sign, verify } from "jsonwebtoken";

const adminRepository = genitorDataSource.getRepository(Admin);

//TODO Add to register instant login
export const AdminRegister = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).send({ message: 'Invalid Credentials'});
  }

  const admin = await adminRepository.save({
    email,
    password: await bcryptjs.hash(password, 12)
  });

  //TODO add logic for cases when user is already exist

  res.send(admin);
}

export const AdminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await adminRepository.findOne({
    where: {
      email: email,
    },
  });

  if (!admin) {
    return res.status(400).send({
      message: 'Invalid Credentials',
      errors: { email: 'User doesn\'t exist' },
    })
  }

  if (!await bcryptjs.compare(password, admin.password)) {
    return res.status(403).send({
      message: 'Invalid Credentials',
      errors: { password: 'Password incorrect' },
    })
  }

  const accessToken = sign({
    id: admin.id
  }, 'access_token', {expiresIn: 60 * 60});

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 //equivalent to 1 day
  });

  res.send({ ...admin });
}

export const authAdmin = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies['accessToken'];

    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      return res.status(401).send({
        message: 'Unauthenticated',
      });
    }

    const admin = await adminRepository.findOne({
      where: {
        id: payload.id,
      }
    });

    if(!admin) {
      return res.status(401).send({
        message: 'Unauthenticated. No user',
      });
    }

    const { password, ...data } = admin;

    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: 'Unauthenticated. Some errors',
    })
  }
}

export const AdminLogout = async (req: Request, res: Response) => {
  res.cookie('accessToken', '', { maxAge: 0 });
  res.send({
    message: 'success'
  })
}
