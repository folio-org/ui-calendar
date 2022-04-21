module.exports = {
  okapi: { url: "https://bama-okapi.ci.folio.org", tenant: "diku" },
  config: {
    autoLogin: { username: "diku_admin", password: "admin" },
    // logCategories: 'core,redux,connect,connect-fetch,substitute,path,mpath,mquery,action,event,perm,interface,xhr'
    // logPrefix: 'stripes'
    // logTimestamp: false
    // showPerms: false
    // showHomeLink: false
    // listInvisiblePerms: false
    // disableAuth: false
    // hasAllPerms: false
  },
  modules: {
    "@folio/users": {},
  },
};
