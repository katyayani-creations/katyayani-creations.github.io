#!/bin/bash
source ./bin/common.sh

mkdir -p $1
echo "downloading file: $1"
wget https://katyayani-creations.in/$1 -o /dev/null -O $1/index.html
clean $1/index