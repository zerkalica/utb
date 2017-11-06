import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'
import resolve from 'rollup-plugin-node-resolve'

import globals from 'rollup-plugin-node-globals'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'
import alias from 'rollup-plugin-alias'

import fs from 'fs'
import path from 'path'
import fr from 'find-root'
import rimraf from 'rimraf'

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')))
const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')))

const magic = 'commonjs'
babelrc.babelrc = false
babelrc.plugins = babelrc.plugins.map(
    plugin => (Array.isArray(plugin) ? (plugin[0] || ''): plugin).indexOf(magic) >= 0 ? null : plugin
).filter(Boolean)

const isUglify = process.env.UGIFY === 1 || process.env.NODE_ENV === 'production'

const baseConfig = {
    sourcemap: isUglify,
    plugins: [
        resolve({
            browser: true,
            module: true
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        commonjs({
            namedExports: {
                'mobx': ['observable'],
                'mobx-react': ['observer'],
                'inferno-mobx': ['observer'],
                'inferno-compat': ['render', 'createElement', 'Component'],
                'react-dom': ['render', 'findDOMNode', 'unstable_batchedUpdates'],
                'react': ['createElement', 'Component', 'Children']
            },
            include: [
                'node_modules/create-react-class/**',
                'node_modules/hoist-non-react-statics/**',
                'node_modules/preact-classless-component/**',
                'node_modules/fbjs/**',
                'node_modules/object-assign/**',
                'node_modules/react/**',
                'node_modules/react-dom/**',
                'node_modules/prop-types/**',
                'node_modules/inferno*/**',
                'node_modules/hoist-non-inferno-statics/**',
                'node_modules/preact/**',
                'node_modules/mobx/**',
                'node_modules/inferno-mobx/**',
                'node_modules/mobx-react/**',
                'node_modules/mobx-preact/**'

            ],
            exclude: [
                 'node_modules/process-es6/**',
                //  'node_modules/preact/**',
                 'node_modules/reactive-di/**',
                 'node_modules/lom_atom/**'
            ]
        }),

        sourcemaps(),
        babel(babelrc),
        globals(),
    ].concat(isUglify ? [uglify({}, minify)] : [])
}

function toConfig({frm, stateFrm}) {
    const stName = formatName(stateFrm)
    const name = `${frm.name}-${stName}`

    return Object.assign({}, baseConfig, {
        input: `src/perf/${stName}/index.js`,
        output: [
            {file: `docs/examples/${name}/bundle.js`, format: 'iife', name: name.replace(/\-/g, '_')}
        ],
        plugins: baseConfig.plugins.concat([
            alias({
                'react-stubs': `src/stubs/${frm.name}.js`,
                'mobx-stubs': `src/stubs-mobx/${frm.name}.js`
            })
        ])
    })
}

function getInfoPart(rawName) {
    const name = path.basename(rawName, '.js')
    const pkgStr = name === 'raw' ? null : ('' + fs.readFileSync(path.join(fr(require.resolve(name)), 'package.json')))
    return {
        name,
        pkg: pkgStr ? JSON.parse(pkgStr) : null
    }
}

function getInfo(rawName) {
    const parts = rawName.split('--')
    return parts.length > 1 ? parts.map(getInfoPart) : getInfoPart(rawName)
}

function intersect(a1, a2) {
    return a1.reduce((acc, frm) => {
        return acc.concat(a2.map((stateFrm) => ({
          frm,
          stateFrm
        })))
    }, [])
}


function formatSingleVersion({name, pkg}) {
    return `${name}${pkg ? ` ${pkg.version}` : ''}`
}

function formatVersion(items) {
    return Array.isArray(items) ? items.map(formatSingleVersion).join(' + ') : formatSingleVersion(items)
}

function formatSingleName({name}) {
    return name
}
function formatName(items) {
    return Array.isArray(items) ? items.map(formatSingleName).join('--') : formatSingleName(items)
}

function genIndex(items) {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Demo examples</title>
  </head>
  <body>
      <div id="app"></div>
      <a href="./benchmark">mol benchmark</a><br/>
      <ul>
        ${items.map(({frm, stateFrm}) => `
            <li>
              <a href="./examples/${frm.name}-${formatName(stateFrm)}/index.html">
                ${formatVersion(frm)} + ${formatVersion(stateFrm)}
              </a>
            </li>
          `).join("\n")}
      </ul>
  </body>
</html>
`
}

function genLearn(frms, stateFrms) {
    const obj = {}

    frms.forEach((frm) => {
        const key = `${frm.name}_utb`
        const pkg = frm.pkg || {}
        obj[key] = {
            name: formatVersion(frm),
            description: pkg.description || frm.name,
            homepage: pkg.homepage || null,
            examples: stateFrms.map((stateFrm) => ({
                name: formatVersion(stateFrm),
                url: `examples/${frm.name}-${formatName(stateFrm)}`
            }))
        }
    })

    return JSON.stringify(obj, null, '  ')
}

function genFrmIndex(frm) {
  return `<!doctype html>
<html lang="en" data-framework="${frm.name}">
  <head><meta charset="utf-8">
    <title>${frm.name}, ${frm.pkg ? frm.pkg.version : ''} • TodoMVC</title>
    <link rel="stylesheet" href="../../bower_components/todomvc-common/base.css">
    <link rel="shortcut icon" href="/favicon.ico">
  </head>
  <body>
    <section id="todoapp"></section>
    <script src="../../bower_components/todomvc-common/base.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
`
}

// main
const stubsDir = path.join(__dirname, 'src', 'stubs')
const perfDir = path.join(__dirname, 'src', 'perf')

const defaultComponentLib = process.env.COMPONENT_LIB
const defaultStateLib = process.env.STATE_LIB

const componentDirs = defaultComponentLib
    ? [path.join(stubsDir, defaultComponentLib)]
    : fs.readdirSync(stubsDir)

const stateLibDirs = defaultStateLib
    ? [path.join(perfDir, defaultStateLib)]
    : fs.readdirSync(perfDir)

const componentFrameworks = componentDirs.map(getInfo)
const stateFrameworks = stateLibDirs.map(getInfo)
const items = intersect(componentFrameworks, stateFrameworks)
const learnItems = genLearn(componentFrameworks, stateFrameworks)

const exampleDir = path.join(__dirname, 'docs', 'examples')
rimraf.sync(exampleDir)
fs.mkdirSync(exampleDir)

fs.writeFileSync(path.join(__dirname, 'docs', 'index.html'), genIndex(items))
fs.writeFileSync(path.join(__dirname, 'docs', 'learn.json'), learnItems)

items.forEach(({frm, stateFrm}) => {
    const dir = path.join(exampleDir, `${frm.name}-${formatName(stateFrm)}`)
    fs.mkdirSync(dir)
    fs.writeFileSync(path.join(dir, 'index.html'), genFrmIndex(frm))
})

export default items.map(toConfig)
