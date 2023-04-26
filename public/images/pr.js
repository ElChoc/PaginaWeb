const Handlebars = require("handlebars");
        
Handlebars.registerHelper('isEqual', (a, b, opts) => {
    return a == b ? opts.fn(this) : opts.inverse(this);
});

