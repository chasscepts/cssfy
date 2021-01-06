'use strict'

const pojoConstructor = ({}).constructor;

const isPojo = (pojo) => pojo && pojo.constructor === pojoConstructor;

//Use duck typing to check for number or string
const isNumberOrString = (val) => val === 0 || (val && (val.toFixed || val.substring))

module.exports = function cssfy(pojo) {
  if(!pojo) throw new TypeError("Input evaluated to false");
  if(!isPojo(pojo))  throw new TypeError("Input does not have a valid css syntax");
  return Object.keys(pojo).reduce((css, selector) => {  //iterate over the selectors
    const stylePojo = pojo[selector];
    //  A valid style syntax must be provided for each selector
    if(!isPojo(stylePojo)) throw new TypeError(`The style provide for selector ${selector} is not valid!`);

    return `${css}${selector}{${
      Object.keys(stylePojo).reduce((style, attribute) => {
        const value = stylePojo[attribute];
        //  value must either be a string or a number
        if(!isNumberOrString(value)) throw new TypeError(`${value} is not valid for style attribute ${attribute} in selector ${selector}`);
        return `${style}${attribute}:${value};`;
      }, '')
    }} `;
  }, '');
};

