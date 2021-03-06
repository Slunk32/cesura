# Cesura

Cesura is music discovery web application. It uses Spotify's Web API to let users sample tracks related to artists they like. It also allows them to them create and edit playlists in order to enjoy the music they've discovered through the Spotify app.

See it live at [https://cesuradev.herokuapp.com](https://cesuradev.herokuapp.com).

## Test
`npm test`  
or  
`npm run testwatch`  
or  
`npm test -- watch`

## Setting up the Devlopment Environment
`npm install`  
`nvm use node`  
Note: must be running node 4.0 or higher  
`npm install -g nodemon`

## Starting the Server
`npm run watch`  
to build and start the watch task  
`nodemon .`  
to start the server

## Transpiling

Either use the atom babel package, or use gulp and babel to transpile from src to build.

## Atom Setup Tips

Use of the atom editor is not required. But if you choose to use atom here are some tips.

#### Install Atom Packages
`apm install linter linter-eslint language-babel editorconfig`

#### linter Settings
* Uncheck `Lint on fly`

#### linter-eslint Settings
* check `Disable When NoEslintrc File In Path`
* uncheck `Use Global Eslint` (unchecking seems to be necessary in order to use es2016)

#### language-babel Settings
* check `Transpile On Save`
* `src` in `Babel Source Path`
* `build` in `Babel Transpile Path`
* put `runtime` in `Optional Transformers`
