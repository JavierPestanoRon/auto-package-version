const Version = function constructor(symbol, major, minor, patch) {
  const model = {};
  model.symbol = symbol;
  model.major = Number(major);
  model.minor = Number(minor);
  model.patch = Number(patch);
  return model;
};

export default Version;
