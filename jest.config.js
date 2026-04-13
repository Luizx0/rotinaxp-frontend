/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/tests"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      { presets: [["react-app", { runtime: "automatic" }]] },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: ["/node_modules/(?!(axios)/)"],
  testPathIgnorePatterns: ["/node_modules/"],
};
