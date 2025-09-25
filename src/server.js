const express = require('express');
const app = express();

const path = require('path');
const { I18n } = require('i18n');
const i18n = new I18n({
    locales: ['en', 'it'],
    fallbacks: {
        'en-*': 'en',
        'it-*': 'it',
    },
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
});
app.use(i18n.init);

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    helpers: {
        year: function () { return new Date().getFullYear(); },
        i18n: function (str) {
            if (!str) return str;
            return this.res.__(str);
        },
        component: (str) => encodeURIComponent(str),
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(function (req, res, next) {
    res.locals.res = res;
    next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('homepage', { });
});

/**
 * Start ’er up!
 */
const listener = app.listen(process.env.PORT, function () {
    console.log('Now listening on port ' + listener.address().port);
});
