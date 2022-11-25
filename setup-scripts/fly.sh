# Installing Fly Deployment Stuff

if ! command -v flyctl &> /dev/null
then
    echo "flyctl could not be found. installing..."
    curl -L https://fly.io/install.sh | sh
    exit
fi

export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
