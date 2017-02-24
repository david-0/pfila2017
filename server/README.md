# Homeautomation-Project Server

## Install required modules
`npm install`

## Configure Database
Use either of following options (to be selected in models/db.service.ts):
* Use installed MongoDB, see https://docs.mongodb.com/manual/administration/install-community/
* Use TingoDB, see http://www.tingodb.com/info/ (**NOTE:** not yet implemented)
* Use internet based DB server: `mongodb://admin:hallihallo62@ds050879.mlab.com:50879/homeautomation`

## Optional: In case of Database Option [1]
open terminal
change to the root folder of the project 2
```
mkdir data
"C:\Program Files\MongoDB\Server\3.4\bin\mongod" --dbpath .\data
```

## MongoDB Terminal
```
  mongo
  use homeautomation
  show collections
  var schema = db.users.findOne();
  for (var key in schema) { print (key) ; }`
```

## Start the server
starting the server with continuous building of the typescript files
```
open terminal
change to project2/server folder
npm start
```

## Debugging the server in Webstrom
* Create a 'node.js' Run-Configuraton. 
  * Choose the current **server** folder as working folder and **app.js** (which initially doesn't exists) as javascript file.
  * Add a **Before Launch** step:  **Compile typescript** and use the tsconfig.js in the server-folder as configuration.


## Just building the server
continuous building, but not starting the server, i.e. for debugging in Webstorm)
```
gulp watch
```

## Initial User
If the homeautomation server is started, then admin user **admin**, password **1234546** will be created if not yet existing.

## Testing the REST Interface
Server and test running in one terminal:
* Pre-Condition: Built server.
* Open terminal
* Change to project2/server folder and execute `gulp test`

Optionally you can run the server and the test in dedicated terminal:
* Start the server in one terminal
* Execute `jasmine` or `gulp jasmine` in a 2nd terminal
