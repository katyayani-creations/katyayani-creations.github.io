#!/bin/bash

# wget https://katyayani-creations.in/cat.php  && mv cat.php cat.txt
sed -i -e 's/##/\n/g' cat.txt

function changeURL() {
    while IFS= read -r str; do
        while IFS= read -r str1; do
            sed -i -e 's/https:\/\/katyayani-creations.in\/'$str'/https:\/\/katyayani-creations.github.io\/'$str'/g' $str1.html
            sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str1.html
        done < cat.txt
        sed -i -e 's/https:\/\/katyayani-creations.in\/'$str'/https:\/\/katyayani-creations.github.io\/'$str'/g' index.html
        sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' index.html
    done < cat.txt 
}

wget https://katyayani-creations.in/index.php && mv index.php index.html

while IFS= read -r str; do
    echo "Text read from file: $str"
    wget https://katyayani-creations.in/$str && mv $str $str.html
done < cat.txt

changeURL

git add .
git commit -am "update" && git push origin main
rm -rf *-e