const tagRegex = /^\s*<\/?[^>]+>\s*$/;
const tagWordRegex = /<[^\s>]+/;
const whitespaceRegex = /^(\s|&nbsp;)+$/;
const wordRegex = /(\p{Script_Extensions=Latin}|[\d@#])+/u;

const specialCaseWordTags = ["<img"];

const isTag = (item: string): boolean => {
  return (
    !specialCaseWordTags.some((tag) => item !== null && item.startsWith(tag)) &&
    tagRegex.test(item)
  );
};

const stripTagAttributes = (word: string): string => {
  const tag = tagWordRegex.exec(word)?.[0];

  if (tag) {
    word = tag + (word.endsWith("/>") ? "/>" : ">");
  }

  return word;
};

const wrapText = (text: string, tagName: string, cssClass: string): string =>
  `<${tagName} class="${cssClass}">${text}</${tagName}>`;

const isStartOfTag = (val: string) => val === "<";

const isEndOfTag = (val: string) => val === ">";

const isStartOfEntity = (val: string) => val === "&";

const isEndOfEntity = (val: string) => val === ";";

const isWhiteSpace = (value: string) => whitespaceRegex.test(value);

const stripAnyAttributes = (word: string): string =>
  isTag(word) ? stripTagAttributes(word) : word;

const isWord = (text: string) => wordRegex.test(text);

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
