#!/bin/bash
source ./bin/common.sh

echo "downloading file: $1"
wget https://katyayani-creations.in/$1 -o /dev/null && mv $1 $1.html 
clean $1