const cssfy = require('../index');

//Exceptions are thrown for invalid css even when we can parse the object so that the bug can be caught on time by the developer

test('Null throws TypeError', () => {
  expect(() => cssfy(null)).toThrow(TypeError);
});

test('Non Pojo argument throws TypeError', () => {
  expect(() => cssfy("Invalid css")).toThrow(TypeError);
});

test('Non nested plain pojo throws TypeError', () => {
  const pojo = {opacity: 1, height: '1px'}; //This is valid style but does not have a selector
  expect(() => cssfy(pojo)).toThrow(TypeError);
});

test('Nested plain pojo with some missing selectors throws TypeError', () => {
  const pojo = {h1:{opacity: 1, height: '1px'}, h2: 1}; //Second property should failed because 1 is not a valid style
  expect(() => cssfy(pojo)).toThrow(TypeError);
});


test('Over nested plain pojo throws TypeError', () => {
  const pojo = {h1:{opacity: 1, height: '1px'}, h2: {'color': [1, 2]}}; //A style attribute accepts only a number or a string
  expect(() => cssfy(pojo)).toThrow(TypeError);
});

test('Null is not a valid style attribute value', () => {
  const pojo = {h1:{opacity: 1, height: null}, h2: {'color': 'green'}}; //A style attribute accepts only a number or a string
  expect(() => cssfy(pojo)).toThrow(TypeError);
});

test('Correctly parses a valid pojo style', () => {
  const pojo = {h1:{opacity: 1, height: '1px'}, '.success': {color: 'green' }, '.expand:hover':{width: '100px'}};
  const expected = "h1{opacity:1;height:1px;} .success{color:green;} .expand:hover{width:100px;} "
  expect(cssfy(pojo)).toBe(expected);
});

