const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);


// random index generator based on list length
function getRandomIndex(list) {
    return Math.floor(Math.random() * list.length);
}

//  generate random name
function generateRandomName(wordList, config, seperator, fillword, second_fillword) {
    const prefixProbability = config['prefix_probability'];
    const suffix_adjectiv_probability = config['suffix_adjectiv_probability'];
    const suffix_name_probability = config['suffix_name_probability'];

    const prefixList = wordList['prefix'];
    const nameList = wordList['name'];
    const suffixAdjectiveList = wordList['suffix_adjective'];
    const suffixNameList = wordList['suffix_name'];

    const prefix = prefixList[getRandomIndex(prefixList)];
    const name = nameList[getRandomIndex(nameList)];
    const suffix_adjective = suffixAdjectiveList[getRandomIndex(suffixAdjectiveList)];
    const suffix_name = suffixNameList[getRandomIndex(suffixNameList)];

    let result = "";

    // write prefix if random number is less than prefix probability
    if (Math.random() < prefixProbability) {
        result = `${prefix}${seperator}${name}`;
    } else {
        result = `${name}`;
    }

    // write suffix if random number is less than suffix probability
    if (Math.random() < suffix_name_probability) {
        if (Math.random() < suffix_adjectiv_probability) {
            result += `${seperator}${fillword}${seperator}${suffix_adjective}${seperator}${second_fillword !== null ? second_fillword : fillword}${seperator}${suffix_name}`;
        } else {
            result += `${seperator}${fillword}${seperator}${suffix_name}`;
        }
    }

    return result;
}

// main function
async function main() {
    // reading config file
    const config = await readFileAsync('config.json');
    const configData = JSON.parse(config);
    const seperator = configData['seperator'];
    const fillword = configData['fillword'];
    const second_fillword = configData['second_fillword'];

    // read word list data
    const data = await readFileAsync('word-list.json');
    const wordList = JSON.parse(data);

    // generate random name
    const name = generateRandomName(wordList, configData, seperator, fillword, second_fillword);

    // print name
    console.log(name);
}

main();