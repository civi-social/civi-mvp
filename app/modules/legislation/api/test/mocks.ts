// For local development
const mockDataCurrent = new Map([
  ["civi-legislation-data:chicago", require("./data/chicago.legislation.json")],
  [
    "civi-legislation-gpt-data:chicago",
    require("./data/chicago.legislation.gpt.json"),
  ],
  [
    "civi-legislation-data:illinois",
    require("./data/illinois.legislation.json"),
  ],
  [
    "civi-legislation-gpt-data:illinois",
    require("./data/illinois.legislation.gpt.json"),
  ],
  ["civi-legislation-data:usa", require("./data/usa.legislation.json")],
  ["civi-legislation-gpt-data:usa", require("./data/usa.legislation.gpt.json")],
]);

const mockDataPrevious = new Map([
  [
    "civi-legislation-data:chicago",
    require("./data_previous/chicago.legislation.json"),
  ],
  [
    "civi-legislation-gpt-data:chicago",
    require("./data_previous/chicago.legislation.gpt.json"),
  ],
  [
    "civi-legislation-data:illinois",
    require("./data_previous/illinois.legislation.json"),
  ],
  [
    "civi-legislation-gpt-data:illinois",
    require("./data_previous/illinois.legislation.gpt.json"),
  ],
  [
    "civi-legislation-data:usa",
    require("./data_previous/usa.legislation.json"),
  ],
  [
    "civi-legislation-gpt-data:usa",
    require("./data_previous/usa.legislation.gpt.json"),
  ],
]);

export { mockDataCurrent, mockDataPrevious };
