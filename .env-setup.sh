#!/bin/sh

# Set .env file values from environment (aka env | grep ...)
# usage:
# setenv -env GOOGLE_API_KEY .env // for getting from environment
# setenv TEST value .env.local
setenv(){
    # key=""
    # value=""
    
    if [ $1 = "-env" ]; then
        key=$2
        # get from environment var
        envKV=$(env | grep $key)
        # extract just value from env grep
        value=$(echo "$envKV" | sed "s/$key=//")
        file=$3
    else
        key=$1
        value=$2
        file=$3
    fi
    sed  -i  "/$key/c\\$key=\"$value\"" $file
}

# set env files
cp .env.example .env
setenv -env GOOGLE_API_KEY .env
setenv SESSION_SECRET $(openssl rand -hex 32) .env

echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲 .env file has been configured 🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
