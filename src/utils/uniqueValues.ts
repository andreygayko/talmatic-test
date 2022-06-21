const filterCallback = (value, index, self) => {
  return self.indexOf(value) === index;
};

module.exports = (array) => {
  return array.filter(filterCallback);
};
