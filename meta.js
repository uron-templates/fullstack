const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

module.exports = {
  metalsmith: {
    before: (metalsmith, options, helpers) => {
      Object.assign(
        metalsmith.metadata(),
        {
          templateVersion,
        },
      )
    }
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A uron project',
    },
    author: {
      type: 'string',
      message: 'Author',
    },
    staticRootDir: {
      type: 'string',
      required: true,
      message: 'Folder of static files',
      default: './public'
    },
    graphql: {
      type: 'confirm',
      message: 'Use graphql?',
      default: true
    },
    db: {
      when:'!graphql',
      type: 'confirm',
      message: 'Use db?',
      default: true
    },
    autoInstall: {
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
    'public/**/*': 'staticRootDir === "./public"',
    'src/server/schema/**/*': 'graphql',
    'src/server/model/**/*': 'db',
    'src/server/service/base/**/*': 'db',
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
