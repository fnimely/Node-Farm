module.exports = replaceTemplate = function (temp, prod) {
  let outPut = temp.replace(/{%PRODUCTNAME%}/g, prod.productName);
  outPut = outPut.replace(/{%IMAGE%}/g, prod.image);
  outPut = outPut.replace(/{%PRICE%}/g, prod.price);
  outPut = outPut.replace(/{%FROM%}/g, prod.from);
  outPut = outPut.replace(/{%NUTRIENTS%}/g, prod.nutrients);
  outPut = outPut.replace(/{%QUANTITY%}/g, prod.quantity);
  outPut = outPut.replace(/{%DESCRIPTION%}/g, prod.description);
  outPut = outPut.replace(/{%ID%}/g, prod.id);

  if (!prod.organic) outPut = outPut.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return outPut;
};
