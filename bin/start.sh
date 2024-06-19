#!/bin/bash

wget https://katyayani-creations.in/cat.php  && mv cat.php cat.txt
sed -i -e 's/##/\n/g' cat.txt

function changeURL() {
    while IFS= read -r str; do
        sed -i -e 's/https:\/\/katyayani-creations.in\//https:\/\/katyayani-creations.github.io/g' $str.html
        sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str.html
    done < cat.txt 
    sed -i -e 's/https:\/\/katyayani-creations.in\//https:\/\/katyayani-creations.github.io/g' index.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' index.html
}

wget https://katyayani-creations.in/index.php && mv index.php index.html

while IFS= read -r str; do
    echo "downloading file: $str"
    wget https://katyayani-creations.in/$str && mv $str $str.html
done < cat.txt

changeURL

git add .
git commit -am "update" && git push origin main
rm -rf *-e