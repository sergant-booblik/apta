import { Request, Response } from 'express';
import { genitorDataSource } from '../../ormconfig';
import { Translation } from '../entity/translation';

enum supportedLanguages { "en-US", "ru-RU", "fi-FI" }

const translationRepository = genitorDataSource.getRepository(Translation);

export const getTranslation = async (req: Request, res: Response) => {
  const lang = req.params.lang as keyof Translation["translation"];
  const langForResult = lang in supportedLanguages
    ? lang
    : "en-US";
  const translations = await translationRepository.find();

  const result = translations.reduce((obj, item) => Object.assign(
    obj, { [item.label]: item.translation[langForResult] }
  ), {});


  res.send(result);
}
