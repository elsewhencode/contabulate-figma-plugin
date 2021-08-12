export const toTitle = (val: string) =>
  val
    .split(' ')
    .map(word => `${word[0].toLocaleUpperCase()}${word.substr(1)}`)
    .join(' ');
