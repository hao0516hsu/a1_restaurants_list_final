const Handlebars = require('handlebars')

Handlebars.registerHelper("sortMethod", function (a, b) {
  if (a === b) { 
    return "selected"
   }
})