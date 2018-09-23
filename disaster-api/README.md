## Disaster-api
 

## Requirements
* node v8 (https://nodejs.org)
* mongoDB v3.2 (https://www.mongodb.com/)

## Configuration

Update configuration in `src/localConfig.js`.  
In Bluemix, all settings should be provided by default via `VCAP_SERVICES`.  
Update `manifest.yml` to match your Bluemix configuration.  
Services "Compose for MongoDB" and "Push Notifications" should be connected.


## Install dependencies
`npm i`

## Running

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves the app in prod mode.|
|`dev`|Same as `npm start`, but enables nodemon for the server as well.|


## Deploy

Run `ibmcloud dev deploy`.  
Install cli here (https://console.bluemix.net/docs/cli/index.html#overview)