'use strict'

const pojoConstructor = ({}).constructor;

const isPojo = (pojo) => pojo && pojo.constructor === pojoConstructor;

//Use duck typing to check for number or string
const isNumberOrString = (val) => val === 0 || (val && (val.toFixed || val.substring))

const randomId = () => 0

const convertToCss = function(pojo){
  if(!pojo) throw new TypeError("Input evaluated to false");
  if(!isPojo(pojo))  throw new TypeError("Input does not have a valid css syntax");
  return Object.keys(pojo).map((selector) => {  //iterate over the selectors
    const stylePojo = pojo[selector];
    //  A valid style syntax must be provided for each selector
    if(!isPojo(stylePojo)) throw new TypeError(`The style provide for selector ${selector} is not valid!`);
    return `${selector}{${
      Object.keys(stylePojo).map(attribute => { //  iterate over attributes
        const value = stylePojo[attribute];
        //  value must either be a string or a number
        if(!isNumberOrString(value)) throw new TypeError(`${value} is not valid for style attribute ${attribute} in selector ${selector}`);
        return `${attribute}:${value};`
      }).join('')
    }}`
  }).join(' ');
}

/**
 * 
 * @param {*} pojo A valid css object
 * @param {*} id Something unique to identify this css. If this is a component that will be mounted many times, we should have a way to avoid injecting the same style into the dom tree all the time. If an id is provided we inject the style if the id is not already in DOM. If an id is not provide, we generate a random id . you should save this id and provide it the next time you call the function.
 */
const injectStyle = function(pojo, id){
  if(id){
    if(document.getElementById(id)){
      return id;
    }
  }
  else{
    id = randomId();
  }
  let css = convertToCss(pojo, id),
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
  head.appendChild(style);
  if(style.styleSheet){
    style.styleSheet.cssText = css;
  }
  else{
    style.appendChild(document.createTextNode(css));
  }
  return id;
}

module.exports = {
  tocss: convertToCss,
  inject: injectStyle
}

