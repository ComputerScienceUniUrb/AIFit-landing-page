const express = require("express");
const path = require("path");
const { I18n } = require("i18n");
const exphbs = require("express-handlebars");

const app = express();

// i18n CONFIG
const i18n = new I18n({
  locales: ["en", "it"],
  defaultLocale: "en",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
});

// INIT i18n
app.use(i18n.init);

// LANGUAGE PER REQUEST
app.use((req, res, next) => {
  let locale = "it";

  // 1. URL override
  if (req.query?.lang === "it") locale = "it";
  if (req.query?.lang === "en") locale = "en";

  // 2. fallback to browser language
  if (!req.query?.lang) {
    const browserLang = req.headers["accept-language"];
    if (browserLang?.startsWith("it")) {
      locale = "it";
    }
  }

  req.setLocale(locale);

  console.log("FINAL LOCALE:", req.getLocale());

  // expose to templates
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
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port " + listener.address().port);
});
