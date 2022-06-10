module.exports = {
  okapi: {
    url: "https://bama-okapi.ci.folio.org",
    tenant: "diku",
  },
  config: {
    logCategories: "core,path,action,xhr",
    logPrefix: "--",
    showPerms: false,
    hasAllPerms: false,
    languages: ["en"],
    suppressIntlErrors: true,
  },
  modules: {
    "@folio/calendar": {},
  },
};
