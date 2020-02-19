export const parseVersionsList = (data: string): string[] => {
  const regex = new RegExp(/.* (.*)/gm);
  const result = [];
  let match = regex.exec(data);

  while (match != null) {
    result.push(match[1]);
    match = regex.exec(data);
  }

  return result;
};
