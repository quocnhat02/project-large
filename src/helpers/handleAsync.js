'use strict';

const handleAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next);
  };
};

module.exports = {
  handleAsync,
};
