# IATI Organisation File Visualiser

Visualise IATI organisation files from the comfort of your own browser.

## Acceptance testing

 1. Either [`git clone` this repo](https://github.com/pwyf/iati-org-viz.git), or download [it as a zip file](https://github.com/pwyf/iati-org-viz/archive/master.zip) and unzip it.
 2. In Chrome, visit chrome://extensions and enable developer mode.
 3. Click “Load unpacked” and select the `dist` folder.
 4. Visit any organisation dataset on the IATI registry. [E.g. this one.](https://www.iatiregistry.org/dataset/unitedstates-dosandusaid)

## Development

You’ll need recent versions of `npm`, `node` and `gulp-cli`.

```shell
$ npm install
$ npm run watch
```
