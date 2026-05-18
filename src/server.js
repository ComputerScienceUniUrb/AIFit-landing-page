const express = require("express");
const path = require("path");
const { I18n } = require("i18n");
const exphbs = require("express-handlebars");

const app = express();

// i18n CONFIG
const i18n = new I18n({
  locales: ["en", "it"],
  defaultLocale: "it",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
});

// INIT i18n
app.use(i18n.init);

// LANGUAGE PER REQUEST
app.use((req, res, next) => {
  let locale = i18n.getLocale();

  if (req.query?.lang === "it") locale = "it";
  if (req.query?.lang === "en") locale = "en";

  if (!req.query?.lang) {
    const browserLang = req.headers["accept-language"];

    if (browserLang?.startsWith("en")) {
      locale = "en";
    }
  }

  req.setLocale(locale);

  res.locals.currentLang = locale;
  res.locals.__ = res.__.bind(res);

  next();
});

// HANDLEBARS
const hbs = exphbs.create({
  helpers: {
    i18n: function (key, options) {
      return options.data.root.__?.(key) || key;
    },

    year: () => new Date().getFullYear(),

    component: (str) => encodeURIComponent(str),

    eq: (a, b) => a === b,
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// STATIC FILES
app.use(express.static("public"));

// ROUTES
app.get("/", (req, res) => {
  res.render("homepage");
});

// START SERVER
const listener = app.listen(process.env.PORT || 3000, () => {});
