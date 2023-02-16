export const flattenDeep = function (arr: any[]) {
  let res: any[] = [];

  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(flattenDeep(item));
    } else {
      res.push(item);
    }
  })

  return res;
}
