/**
 * Custom Fetchq logger
 * used to exit the process in case of errors
 */

const levels = {
    INFO: "info",
    ERROR: "error",
    VERBOSE: "verbose",
    DEBUG: "debug",
    SILLY: "silly"
  };
  
  const levelsNum = [
    levels.ERROR,
    levels.INFO,
    levels.VERBOSE,
    levels.DEBUG,
    levels.SILLY
  ];
  
  class ConsoleLogger {
    constructor(settings = {}) {
      const inputLevel = settings.level || process.env.LOG_LEVEL || levels.ERROR;
      const inputLevelIdx = levelsNum.indexOf(inputLevel);
  
      this.level = inputLevelIdx >= 0 ? inputLevelIdx : 0;
  
      if (inputLevelIdx === -1) {
        console.log(
          `[fetchq] Logger: input level "${settings.level}" not recognized, using ERROR.`
        );
      } else {
        // console.log(
        //   `[fetchq] Logger: using level "${levelsNum[this.level]}"`,
        // );
      }
    }
  
    log(logType, ...args) {
      const index = levelsNum.indexOf(logType);
      if (index === -1) {
        console.log(
          `[fetchq] Logger: input level "${settings.level}" not recognized`
        );
        return;
      }
      if (index <= this.level) {
        console.log(`${levelsNum[index]}`, ...args);
      }
    }
    error(...args) {
      this.log(levels.ERROR, ...args);
      process.exit(-1);
    }
    info(...args) {
      this.log(levels.INFO, ...args);
    }
    verbose(...args) {
      this.log(levels.VERBOSE, ...args);
    }
    debug(...args) {
      this.log(levels.DEBUG, ...args);
    }
    silly(...args) {
      this.log(levels.SILLY, ...args);
    }
  }
  
  module.exports = ConsoleLogger;
  