
  <h1><code>WordPress Gulp Workflow</code></h1>

🎯 An advanced & extensively documented Gulp WordPress workflow. Kick-start a build-workflow for your WordPress plugins and themes with Gulp.

This is a fork of the this [project](https://github.com/ahmadawais/WPGulp)


![Start](https://a.cl.ly/83f7dd38eb83/c)

## Getting Started

#### ⚡️ Quick Overview

Run step `#1`, `#2`, and `#3` quickly in one go — Run inside local WP install's theme/plugin folder E.g. `/wp.local/wp-content/plugins/your-plugin` or `/wp.local/wp-content/themes/your-theme` directory.

```sh
# 1— Install WPGulp in your WordPress wp-content/themes/your-theme
npm install
# 2— Now configure variables inside the `wpgulp.config.js` file.
# 3— Start your npm build workflow.
npm start
```



In case you are an absolute beginner to the world of `Node.js`, JavaScript, and `npm` packages — all you need to do is go to the Node's site [download + install](https://nodejs.org/en/download/) Node on your system. This will install both `Node.js` and `npm`, i.e., node package manager — the command line interface of Node.js.

You can verify the install by opening your terminal app and typing...

```sh
node -v
# Results into v16.15.1 — make sure you have Node >= 16 installed.

npm -v
# Results into 8.11.0 — make sure you have npm >= 8 installed.
```

</details>

### → `STEP #1` — Get the Required Files

1. In the terminal go to the root folder of your WordPress theme
2. Copy the WPGulp project into your theme directory.

_It'll take a couple of minutes to install._

```sh
npm install
```


![wpgulp install gif](https://a.cl.ly/c846c265e03a/c)

> ⚠️  I'm assuming that there are no previously present similar files in the root of your folder. Otherwise, you need to merge these very carefully. E.g. You can include the `scripts`, `devDependencies` in your current `package.json` file and so on for other files. If you run the above command all similar files will be overwritten.

### → `STEP #2` — Editing the Project Variables

Configure the project paths and other variables inside the `wpgulp.config.js` file. This is a compulsory step.

![wpgulp config](https://a.cl.ly/f2ca9bb4a740/c)

### → `STEP #3` — Start your project

Once the installation is done, you can open your project (WordPress plugin/theme) folder and run the start script.

```sh
npm start

# To stop press CTRL (⌃) + C
```

