# README

## Requirements:
* Node >=12.14.0
* yarn

## Installing dependencies:
* Execute command `yarn install`

## Environment variables:
To add environment variables create `.env` file in the root of the project. 

Available variables:
```
# one of: prod, dev, stag
ENV=

# for production write url path here
BASE_URL=
BROWSER_PORT=3000

# non-mandatory. specify languages that need to be rendered, example: en,de,es,cz...
LANGUAGES=
```

## Build and run
#### For development:
* Change `ENV` environment variable to `dev`
* Execute command `yarn develop`

#### Running in production:
* Change `BASE_URL` environment variable to your domain
* Execute command `yarn build`. This will build project to `/dist` folder

#### Possible errors:
* If gulp commands do not work, try install gulp globally

## Available scripts:
* `yarn syncTerms` - will sync 'po' terms from `/locales` folder on git with POeditor. YOU MUST CONFIGURE WEBHOOKS IN POEDITOR AND CHANGE KEYS IN FILE `bin/config.js`
* `yarn exportTerms` - will export new translations from POeditor to `/locales`. YOU MUST CONFIGURE WEBHOOKS IN POEDITOR AND CHANGE KEYS IN FILE `bin/config.js`
* `yarn parseTerms`
