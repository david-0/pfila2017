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


## Production Mode

In Production Mode, the server will use a public and a private key for jwt token.
Without the keys, he will not start. To start the server in production mode, set
the environment variable NODE_ENV to 'production'. 

* The private.key file must be named '../../ha-key'
* The public.key file must be named '../../ha-key.pub'

To create this key, you can use:
```
openssl genpkey -algorithm RSA -out ../../ha-key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in ../../ha-key -out ../../ha-key.pub
```

### key and cert for SSL
```
openssl req -new > cert.csr
openssl rsa -in privkey.pem -out key.pem
openssl x509 -in cert.csr -out cert.pem -req -signkey key.pem -days 1001
```

### Allow port 80 and 443 without root
https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps#give-safe-user-permission-to-use-port-80
Port less than 1024
```
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/bin/nodejs
```
