import { Pipe, PipeTransform } from '@angular/core';

const NUMBERS_WORDS = [
  ['', ' один', ' два', ' три', ' четыре', ' пять', ' шесть', ' семь', ' восемь', ' девять'],
  [' десять', ' одиннадцать', ' двенадцать', ' тринадцать', ' четырнадцать', ' пятнадцать',
    ' шестнадцать', ' семнадцать', ' восемнадцать', ' девятнадцать'],
  ['', '', ' двадцать', ' тридцать', ' сорок', ' пятьдесят', ' шестьдесят', ' семьдесят', ' восемьдесят', ' девяносто'],
  ['', ' сто', ' двести', ' триста', ' четыреста', ' пятьсот', ' шестьсот', ' семьсот', ' восемьсот', ' девятьсот'],
  ['', ' одна', ' две']
];

const NUMERIC_DIGITS = [
  ['', 'тысяч', 'миллион', 'миллиард', 'триллион', 'квадриллион', 'квинтиллион',
    'секстиллион', 'септиллион', 'октиллион', 'нониллион', 'дециллион'],
  ['а', 'и', ''],
  ['', 'а', 'ов']
];

@Pipe({
  name: 'mySumLetters',
})
export class SumLettersPipe implements PipeTransform {
  transform(value: number, ...args: any[]): any {
    return sumLetters(value);
  }
}

/**
 * округлить до сотых и сделать массив двух чисел: до точки и после неё
 */
function sumLetters(price) {
  price = Number(price).toFixed(2).split('.');
  return razUp(`${numLetters(price[0], false)}${declOfNum(price[0], 'рубл', ['ь', 'я', 'ей'])} ${price[1]}
  ${declOfNum(price[1], 'копе', ['йка', 'йки', 'ек'])}`);
}

/**
 * целое число прописью
 */
function numLetters(price, isCorrection) {
  let i = '';
  if (price === '' || price === '0') {
    return ' ноль';
  }

  // разбить число в массив с трёхзначными числами
  price = price.split(/(?=(?:\d{3})+$)/);

  if (price[0].length === 1) {
    price[0] = `00${price[0]}`;
  }

  if (price[0].length === 2) {
    price[0] = `0${price[0]}`;
  }

  // соединить трёхзначные числа в одно число, добавив названия разрядов с окончаниями
  for (let j = (price.length - 1); j >= 0; j--) {
    if (price[j] !== '000') {
      i = (((isCorrection && j === (price.length - 1)) || j === (price.length - 2)) && (price[j][2] === '1' || price[j][2] === '2') ?
        convert3DigitNumbers(price[j], true) : convert3DigitNumbers(price[j], false)) +
        declOfNum(price[j], NUMERIC_DIGITS[0][price.length - 1 - j], (j === (price.length - 2) ?
          NUMERIC_DIGITS[1] : NUMERIC_DIGITS[2])) + i;
    }
  }
  return i;
}

/**
 * преобразовать трёхзначные числа
 */
function convert3DigitNumbers(value, isCorrection) {
  return NUMBERS_WORDS[3][value[0]] + (value[1] === 1 ? NUMBERS_WORDS[1][value[2]] :
    NUMBERS_WORDS[2][value[1]] + (isCorrection ? NUMBERS_WORDS[4][value[2]] : NUMBERS_WORDS[0][value[2]]));
}

/**
 * склонение именительных рядом с числительным: число (typeof = string), корень (не пустой), окончание
 */
function declOfNum(value, root, endings) {
  const endingIndex = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2];
  return (root === '' ? '' : ` ${root}${(value[value.length - 2] === '1' ? endings[2] : endings[endingIndex[value[value.length - 1]]])}`);
}

/**
 * сделать первую букву заглавной и убрать лишний первый пробел
 */
function razUp(result) {
  return `${result[1].toUpperCase()}${result.substring(2)}.`;
}

