const tagRegex = /^\s*<[^>]+>\s*$/;
const tagWordRegex = /<[^\s>]+/;
const whitespaceRegex = /^(?:\s|&nbsp;)+$/;
const wordRegex = /[\p{Script_Extensions=Latin}\d@#]+/u;

const specialCaseWordTags = ['<img', '<input'];

function isTag(item: string): boolean {
  return (
    !specialCaseWordTags.some((tag) => item !== null && item.startsWith(tag)) &&
    tagRegex.test(item)
  );
}

function stripTagAttributes(word: string): string {
  const tag = tagWordRegex.exec(word)?.[0];

  if (tag) {
    word = tag + (word.endsWith('/>') ? '/>' : '>');
  }

  return word;
}

function wrapText(text: string, tagName: string, cssClass: string): string {
  return `<${tagName} class="${cssClass}">${text}</${tagName}>`;
}

const isStartOfTag = (val: string) => val === '<';

const isEndOfTag = (val: string) => val === '>';

const isStartOfEntity = (val: string) => val === '&';

const isEndOfEntity = (val: string) => val === ';';

const isWhiteSpace = (value: string | undefined) =>
  value !== undefined && whitespaceRegex.test(value);

function stripAnyAttributes(word: string): string {
  return isTag(word) ? stripTagAttributes(word) : word;
}

const isWord = (text: string | undefined) =>
  text !== undefined && wordRegex.test(text);

export {
  isTag,
  stripTagAttributes,
  wrapText,
  isStartOfTag,
  isEndOfTag,
  isStartOfEntity,
  isEndOfEntity,
  isWhiteSpace,
  stripAnyAttributes,
  isWord,
};
