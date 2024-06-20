#!/bin/bash

function changeURL() {
    if [ -f cat.txt ]; then
        while IFS= read -r str; do
            sed -i -e 's/katyayani-creations.in/katyayani-creations.github.io/g' $str.html
            sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str.html
        done < cat.txt 
    fi

    if [ -f prod.txt ]; then
        while IFS= read -r str; do
            sed -i -e 's/katyayani-creations.in/katyayani-creations.github.io/g' $str/index.html
            sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str/index.html
        done < prod.txt 
    fi
    sed -i -e 's/katyayani-creations.in/katyayani-creations.github.io/g' index.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' index.html
}

function clean() {
    sed -i -e "s/^[ \t]*//g" $1.html
    sed -i -e "/^$/d" $1.html
    sed -i -e "s/^[ \t]*//g" $1.html
}

function downloadProductList() {
    wget https://katyayani-creations.in/prod.php -o /dev/null  && mv prod.php prod.txt
    sed -i -e 's/##/\n/g' prod.txt
}

function downloadCategoryList() {
    wget https://katyayani-creations.in/cat.php -o /dev/null  && mv cat.php cat.txt
    sed -i -e 's/##/\n/g' cat.txt
}

function downloadIndexPage() {
    wget https://katyayani-creations.in/index.php -o /dev/null && mv index.php index.html
    clean "index"
}