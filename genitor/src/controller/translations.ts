import type { Request, Response } from 'express';

const tolgeeTranslationsAPI = {
  endpoint: process.env.TOLGEE_TRANSLATIONS_ENDPOINT as string,
  access_key: process.env.TOLGEE_TRANSLATIONS_ACCESS_KEY as string,
};

export const fetchTranslations = async (req: Request, res: Response): Promise<void> => {
  const url = new URL(`${tolgeeTranslationsAPI.endpoint}/${req.params.lang}`);
  const translations = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-API-Key': tolgeeTranslationsAPI.access_key,
    },
  }).then((resp) => resp.json())
    .then((resp) => resp);

  res.send(translations);
};
