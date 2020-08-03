class CustomLog {
  static info(message) {
    console.log(`(INFO) price-checker-api: ${message}`);
  }

  static warn(message) {
    console.log(`(WARNING) price-checker-api: ${message}`);
  }

  static error(message) {
    console.log(`(ERROR) price-checker-api: ${message}`);
  }
}

module.exports = CustomLog;
