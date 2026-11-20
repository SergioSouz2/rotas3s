const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Permite importar arquivos SQL gerados pelo Drizzle
config.resolver.sourceExts.push("sql");

module.exports = config;
