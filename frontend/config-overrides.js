module.exports = function override(config, env) {
  // Completely remove ESLint from webpack config
  config.module.rules = config.module.rules.filter((rule) => {
    if (rule.use) {
      if (Array.isArray(rule.use)) {
        return !rule.use.some(
          (use) => use.loader && use.loader.includes("eslint-loader"),
        );
      }
      return !rule.use.loader || !rule.use.loader.includes("eslint-loader");
    }
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf.map((oneOfRule) => {
        if (oneOfRule.use) {
          if (Array.isArray(oneOfRule.use)) {
            oneOfRule.use = oneOfRule.use.filter(
              (use) => !use.loader || !use.loader.includes("eslint-loader"),
            );
          } else if (
            oneOfRule.use.loader &&
            oneOfRule.use.loader.includes("eslint-loader")
          ) {
            oneOfRule.use = [];
          }
        }
        return oneOfRule;
      });
    }
    return true;
  });
  return config;
};
