import chalk from 'chalk';

const errorPrefix = chalk.white('[') + chalk.red('ERROR') + chalk.white(']');
const infoPrefix = chalk.white('[') + chalk.gray('INFO') + chalk.white(']');

export function error(message) {
    console.log(errorPrefix, message);
};

export function info(message) {
    console.log(infoPrefix, message);
};
