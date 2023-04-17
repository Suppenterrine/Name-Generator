const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const args = process.argv.slice(2);

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toSentenceCase(str) {
    return str.replace(/([.?!])\s*(\w)/g, (_, punct, letter) => {
        return `${punct} ${letter.toUpperCase()}`;
    }).replace(/^[a-z]/, (match) => match.toUpperCase());
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function toAlternatingCase(str) {
    return str.split('').map((char, index) => {
        return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
}

function toInverseCase(str) {
    return str.split('').map((char) => {
        return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
    }).join('');
}

async function generateRandomName(numNames, usePrefix, useSuffix, separator, casing) {
    const data = await readFileAsync('word-list.json');
    const wordList = JSON.parse(data);

    let name = '';

    if (usePrefix) {
        const prefixList = wordList['prefix list'];
        const prefixIndex = Math.floor(Math.random() * prefixList.length);
        const prefix = prefixList[prefixIndex];
        name += prefix + separator;
    }

    for (let i = 0; i < numNames; i++) {
        const nameList = wordList['name list'];
        const nameIndex = Math.floor(Math.random() * nameList.length);
        const namePart = nameList[nameIndex];
        name += namePart + separator;
    }

    if (useSuffix) {
        const suffixList = wordList['suffix list'];
        const suffixIndex = Math.floor(Math.random() * suffixList.length);
        const suffix = suffixList[suffixIndex];
        name += suffix;
    }

    switch (casing) {
        case 'lower':
            name = name.toLowerCase();
            break;
        case 'upper':
            name = name.toUpperCase();
            break;
        case 'capitalized':
            name = capitalizeFirstLetter(name.toLowerCase());
            break;
        case 'sentence':
            name = toSentenceCase(name.toLowerCase());
            break;
        case 'title':
            name = toTitleCase(name.toLowerCase());
            break;
        case 'alternating':
            name = toAlternatingCase(name.toLowerCase());
            break;
        case 'inverse':
            name = toInverseCase(name.toLowerCase());
            break;
        default:
            break;
    }

    return name;
}

const numNames = process.argv[2];
const usePrefix = process.argv[3] === 'true';
const useSuffix = process.argv[4] === 'true';
const separator = process.argv[5] || '-';
const casing = process.argv[6] || 'lower';

if (args.includes('--help') || args.includes('help') || args.includes('-h') || args.includes('showhelp')) {
    console.log(`
Usage: node app.js <numNames> <usePrefix> <useSuffix> <separator> <casing>

Arguments:
<numNames>      The number of names to generate.
<usePrefix>     Whether to use a prefix in the name (true/false).
<useSuffix>     Whether to use a suffix in the name (true/false).
<separator>     The separator to use between names (default: "-").
<casing>        The casing to use for the name (default: "lower").
                Available options:
                    - "lower",
                    - "upper",
                    - "capitalized",
                    - "sentence",
                    - "title",
                    - "alternating",
                    - "inverse"
<help>          Display this help message (true/false).
    `);
} else {
    generateRandomName(numNames, usePrefix, useSuffix, separator, casing).then((name) => {
        console.log(name);
    });
}
