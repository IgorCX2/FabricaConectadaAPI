const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

module.exports = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') obj[key] = DOMPurify.sanitize(obj[key]);
      else if (typeof obj[key] === 'object') sanitize(obj[key]);
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};