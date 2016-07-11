// vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2
exports.config = {
  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:7777',

  framework: 'jasmine' 

};
