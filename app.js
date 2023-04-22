import fs from 'fs';
import chalk from 'chalk';
import csv from 'csvtojson';
import inquirer from 'inquirer';
import {
  promisify
} from 'util';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const defaultConfig = {
  "prefix_article_probality": 0.2,
  "prefix_probability": 0.8,
  "suffix_article_probability": 0.3,
  "suffix_adjectiv_probability": 0.5,
  "suffix_name_probability": 0.5,
  "seperator": " ",
  "fillword": "of",
  "selectedFiles": []
};

function getQuestions(askForFilesOnly) {
  const fileQuestion = {
    type: 'checkbox',
    name: 'selectedFiles',
    message: 'Welche Dateien (Themen) sollen verwendet werden?',
    choices: () => {
      try {
        const files = fs.readdirSync('csvData').filter(file => file.endsWith('.csv'));
        if (files.length === 0) {
          throw new Error('Keine CSV-Dateien gefunden');
        }
        return files;
      } catch (error) {
        if (error instanceof FileNotFoundError) {
          console.error(chalk.bgRed.white('Fehler beim Lesen des csvData-Verzeichnisses:\n') + error.message);
        } else {
          console.error(chalk.bgRed.white("Fehler beim Lesen der CSV-Datei " + chalk.inverse("(Starte mit '-f' oder '--file' neu):\n")) + error.message);
        }
        process.exit(1);
      }
    },
    default: () => {
      try {
        const files = fs.readdirSync('csvData').filter(file => file.endsWith('.csv'));
        if (files.length === 0) {
          throw new Error('Keine CSV-Dateien gefunden');
        }
        return [files[0]]; // Set the default value to the first file in the array
      } catch (error) {
        if (error instanceof FileNotFoundError) {
          console.error(chalk.bgRed.white('Fehler beim Lesen des csvData-Verzeichnisses:\n') + error.message);
        } else {
          console.error(chalk.bgRed.white("Fehler beim Lesen der CSV-Datei " + chalk.inverse("(Starte mit '-f' oder '--file' neu):\n")) + error.message);
        }
        process.exit(1);
      }
    },
    filter: input => input
  };

  if (askForFilesOnly) {
    return [fileQuestion];
  }

  const otherQuestions = [
    {
      type: 'number',
      name: 'prefix_article_probality',
      message: 'Wahrscheinlichkeit, "The" vor dem Präfix hinzuzufügen (0-1, z.B. 0.2):',
      default: 0.2
    },
    {
      type: 'number',
      name: 'prefix_probability',
      message: 'Wahrscheinlichkeit, ein Präfix zum Namen hinzuzufügen (0-1, z.B. 0.8):',
      default: 0.8
    },
    {
      type: 'number',
      name: 'suffix_article_probability',
      message: 'Wahrscheinlichkeit, "the" nach "of" hinzuzufügen (0-1, z.B. 0.3):',
      default: 0.3
    },
    {
      type: 'number',
      name: 'suffix_adjectiv_probability',
      message: 'Wahrscheinlichkeit, ein Adjektiv zum Suffix hinzuzufügen (0-1, z.B. 0.5):',
      default: 0.5
    },
    {
      type: 'number',
      name: 'suffix_name_probability',
      message: 'Wahrscheinlichkeit, einen Suffix-Namen hinzuzufügen (0-1, z.B. 0.5):',
      default: 0.5
    },
    {
      type: 'input',
      name: 'seperator',
      message: 'Trennzeichen zwischen den Teilen des Namens (z.B. Leerzeichen):',
      default: ' '
    },
    {
      type: 'input',
      name: 'fillword',
      message: 'Füllwort, das zwischen Name und Suffix hinzugefügt wird (z.B. "of"):',
      default: 'of'
    },
    {
      type: 'confirm',
      name: 'save_results_to_file',
      message: 'Sollen die Ausgaben gespeichert werden (z.B. "results.txt")?:',
      default: false
    }
  ];

  return [...otherQuestions, fileQuestion];
}


class FileNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileNotFoundError';
  }
}


async function createConfigFile(configFilePath) {
  const answers = await inquirer.prompt(getQuestions(false));
  const newConfig = {
    ...defaultConfig,
    ...answers
  };
  await writeFileAsync(configFilePath, JSON.stringify(newConfig, null, 2));
  return newConfig;
}

async function readCsvData(file) {
  try {
    const jsonData = await csv({
      delimiter: ';'
    }).fromFile(`csvData/${file}`);
    const data = {};

    jsonData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!data[key]) {
          data[key] = [];
        }
        data[key].push(item[key]);
      });
    });

    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new FileNotFoundError('Keine CSV-Dateien gefunden');
    } else {
      throw error;
    }
  }
}


async function loadLastSelectedCsvFiles(configFilePath) {
  const configData = JSON.parse(fs.readFileSync(configFilePath));
  const selectedFiles = configData.selectedFiles;

  let combinedData = {};

  for (const file of selectedFiles) {
    try {
      const csvData = await readCsvData(file);
      for (const key in csvData) {
        if (combinedData.hasOwnProperty(key)) {
          combinedData[key] = combinedData[key].concat(csvData[key]);
        } else {
          combinedData[key] = csvData[key];
        }
      }
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        console.error(chalk.bgRed.white('Fehler beim Lesen des csvData-Verzeichnisses:\n') + error.message);
      } else {
        console.error(chalk.bgRed.white("Fehler beim Lesen der CSV-Datei " + chalk.inverse("(Starte mit '-f' oder '--file' neu):\n")) + error.message);
      }
      process.exit(1);
    }
  }

  return combinedData;
}

// random index generator based on list length
function getRandomIndex(list) {
  return Math.floor(Math.random() * list.length);
}

// generate random name
function generateRandomName(wordList, config, seperator, fillword, lastUsedName) {
  const prefixArticleProbality = config['prefix_article_probality'];
  const prefixProbability = config['prefix_probability'];
  const suffixArticleProbability = config['suffix_article_probability'];
  const suffixAdjectivProbability = config['suffix_adjectiv_probability'];
  const suffixNameProbability = config['suffix_name_probability'];
  const prefixList = wordList['prefix'];
  const nameList = wordList['word'];
  const suffixAdjectiveList = wordList['suffix_adj'];
  const suffixNameList = wordList['suffix'];
  let prefix = prefixList[getRandomIndex(prefixList)];

  // add "The" before prefix with xx% probability
  if (Math.random() < prefixArticleProbality) {
    prefix = `The${seperator}${prefix}`;
  }

  const name = nameList[getRandomIndex(nameList)];
  const suffix_adjective = suffixAdjectiveList[getRandomIndex(suffixAdjectiveList)];
  const suffix_name = suffixNameList[getRandomIndex(suffixNameList)];

  let result = "";

  do {
    // write prefix if random number is less than prefix probability
    if (Math.random() < prefixProbability) {
      result = `${prefix}${seperator}${name}`;
    } else {
      result = `${name}`;
    }

    // write suffix if random number is less than suffix probability
    if (Math.random() < suffixNameProbability) {
      if (Math.random() < suffixAdjectivProbability) {
        result += `${seperator}${fillword}${seperator}${suffix_adjective}${seperator}${suffix_name}`;
      } else {
        result += `${seperator}${fillword}${seperator}${suffix_name}`;
      }
    }

    // add "the" after "of" with xx% probability
    if (result.includes("of") && Math.random() < suffixArticleProbability) {
      result = result.replace("of", `of${seperator}the`);
    }
  } while (result === lastUsedName);

  return result;
}

async function generateName(configFilePath, configData) {
  const separator = configData['seperator'];
  const fillword = configData['fillword'];
  const lastUsedName = configData['last_used_name'];

  const wordList = await loadLastSelectedCsvFiles(configFilePath);

  const name = generateRandomName(wordList, configData, separator, fillword, lastUsedName);

  configData['last_used_name'] = name;
  await writeFileAsync(configFilePath, JSON.stringify(configData, null, 2));

  console.log(name);
  return name;
}

async function saveResultsToFile(outputFilePath, text) {
  try {
  
    // check if output directory and file exists, else create them
    if (!fs.existsSync('output')) {
      fs.mkdirSync('output');
    }
    if (!fs.existsSync(outputFilePath)) {
      fs.writeFileSync(outputFilePath, '');
    }

    fs.appendFileSync(outputFilePath, text + '\n');
  } catch (error) {
    console.error(chalk.bgRed.white('Fehler beim Schreiben der Ausgabedatei:\n') + error.message);
    process.exit(1);
  }
}

async function main() {
  const configFilePath = 'config.json';
  const outputFilePath = 'output/output.txt';

  let configData;
  if (fs.existsSync(configFilePath)) {
    configData = JSON.parse(await readFileAsync(configFilePath));
  } else {
    configData = await createConfigFile(configFilePath);
  }

  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    console.log(`
Usage: node app.js [-f|--file] [-c|--config] [-h|--help]

Arguments:
-f, --file      Starts only the configuration to select files again.
-c, --config    Starts the complete configuration of the app
                (prompts for all probability values and which files to use).

-h, --help      Shows this help message and exits.

Examples:
node app.js -f
node app.js -c
node app.js --help
    `);
    process.exit(0);
  }

  if (args.includes('-f') || args.includes('--file')) {
    const answers = await inquirer.prompt(getQuestions(true));

    for (const key in answers) {
      configData[key] = answers[key];
    }

    await writeFileAsync(configFilePath, JSON.stringify(configData, null, 2));
    console.log('Config file updated successfully.\n');

    console.log('\n(ﾉ☉ヮ⚆)ﾉ ⌒*:･ﾟ✧ ✨');
    let output = await generateName(configFilePath, configData);

    if (configData['save_results_to_file']) {
      await saveResultsToFile(outputFilePath, output);
    }
  }

  else if (args.includes('-c') || args.includes('--config')) {
    const answers = await inquirer.prompt(getQuestions(false));

    for (const key in answers) {
      configData[key] = answers[key];
    }

    await writeFileAsync(configFilePath, JSON.stringify(configData, null, 2));
    console.log('Config file updated successfully.\n');

    console.log('\n(ﾉ☉ヮ⚆)ﾉ ⌒*:･ﾟ✧ ✨');
    let output = await generateName(configFilePath, configData);

    if (configData['save_results_to_file']) {
      await saveResultsToFile(outputFilePath, output);
    }
  }

  else {
    console.log('\n(ﾉ☉ヮ⚆)ﾉ ⌒*:･ﾟ✧ ✨');
    let output = await generateName(configFilePath, configData);

    if (configData['save_results_to_file']) {
      await saveResultsToFile(outputFilePath, output);
    }
  }
}

main();
