# IATI Organisation File Visualiser

Visualise IATI organisation files from the comfort of your own browser.

 * [Chrome extension](https://chrome.google.com/webstore/detail/iati-organisation-file-vi/akignlamolglcjboilhajenkkkcnohjj)
 * [Firefox add-on](https://addons.mozilla.org/en-GB/firefox/addon/iati-org-file-visualiser/)

## Development

You’ll need `git`, as well as recent versions of `npm`, `node` and `gulp-cli`.

```shell
$ git clone https://github.com/pwyf/iati-org-viz.git
$ cd iati-org-viz
$ npm install
$ npm run watch
```

Then:

 1. In Chrome, visit chrome://extensions and enable developer mode.
 2. Click “Load unpacked” and select the `dev` folder.
 3. Visit any organisation dataset on the IATI registry. [E.g. this one.](https://www.iatiregistry.org/dataset/unitedstates-dosandusaid)

## Build for distribution

1. First, be sure to bump the version number in `package.json`, `src/manifest.json`, and `CHANGELOG.md`.
2. Then run:

   ```shell
   npm run dist
   ```

   This should update the files in the `dist` folder (which are in version control) and create an extension.zip file (which isn’t in version control).

3. Commit changes in the `dist` folder
4. Create a new github release:

   ```shell
   npx gh-release
   ```

5. Finally, upload extension.zip to:

    * [the chrome webstore](https://chrome.google.com/webstore/developer/dashboard/)
    * [the firefox add-on store](https://addons.mozilla.org/en-GB/developers/addons).
