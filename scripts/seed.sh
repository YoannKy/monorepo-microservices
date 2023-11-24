#!/usr/bin/env bash
mongoimport --authenticationDatabase=admin \
   --username=$MONGO_INITDB_ROOT_USERNAME \
   --password=$MONGO_INITDB_ROOT_PASSWORD \
   --mode upsert \
   --host 127.0.0.1 \
   --db ${MONGO_INITDB_DATABASE} \
   --collection ${MONGO_INITDB_DATABASE} \
   /docker-entrypoint-initdb.d/${MONGO_INITDB_DATABASE}.json \
   --jsonArray

 mongosh ${MONGO_INITDB_DATABASE} --authenticationDatabase=admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "db.createUser({user: '${MONGO_USER}', pwd: '${MONGO_PASSWORD}', roles: [{role: 'readWrite', db: '${MONGO_INITDB_DATABASE}'}]});"
