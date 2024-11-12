import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');

async function getProject() {
  const projectName = process.argv[2];
  const projectDir = join(rootDir, `apps/${projectName}`);
  const projectJsonFile = join(projectDir, 'project.json');

  return JSON.parse((await fsPromises.readFile(projectJsonFile)).toString());
}

async function getMessages(project) {
  const extractI18n = project.targets['extract-i18n'];

  if (extractI18n.options.format !== 'json') {
    return Promise.reject(new Error('The i18n format must be json.'));
  }

  const messagesJsonPath = join(
    rootDir,
    extractI18n.options.outputPath || '',
    extractI18n.options.outFile || 'messages.json',
  ).toString();

  return JSON.parse((await fsPromises.readFile(messagesJsonPath)).toString());
}

async function getLocaleEntries(project) {
  return Object.entries(project.i18n.locales).map(([locale, localeConfig]) => [
    locale,
    join(rootDir, localeConfig.translation),
  ]);
}

async function mergeTranslations(messages, locale, localePath) {
  const newData = { ...messages, locale };

  if (fs.existsSync(localePath)) {
    const oldData = JSON.parse(
      (await fsPromises.readFile(localePath)).toString(),
    );

    for (const [key, value] of Object.entries(newData.translations)) {
      if (!oldData.translations[key]) {
        oldData.translations[key] = value;
      }
    }

    for (const [key, value] of Object.entries(oldData.translations)) {
      if (newData.translations[key]) {
        newData.translations[key] = value;
      }
    }
  }

  return newData;
}

async function writeDataToFile(filePath, data) {
  return fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));
}

(async () => {
  try {
    const project = await getProject();
    const messages = await getMessages(project);
    const localeEntries = await getLocaleEntries(project);

    for (const [locale, localePath] of localeEntries) {
      await writeDataToFile(
        localePath,
        await mergeTranslations(messages, locale, localePath),
      );
    }
  } catch (err) {
    console.error('Unable to merge locales: ' + err);
  }
})();
