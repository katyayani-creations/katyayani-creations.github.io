#!/bin/bash

function sedfile() {
    sed -i -e 's/katyayani-creations.in/katyayani-creations.github.io/g' $1
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $1
    sed -i -e 's/products.php/products.html/g' $1
    echo "$(cat $1 | tr '\n' ' ' | sed -e 's/> \?/>\n/g')" >  $1
    sed -i -e 's/\t/    /g' $1
    sed -i -e 's/  */ /g' $1 
}
function changeURL() {
    if [ -f cat.txt ]; then
        while IFS= read -r str; do
            sedfile $str.html
        done < cat.txt 
    fi

    if [ -f prod.txt ]; then
        while IFS= read -r str; do
            sedfile $str/index.html
        done < prod.txt 
    fi
    sedfile index.html
    sedfile products.html
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

function downloadProducts() {
    wget https://katyayani-creations.in/products.php -o /dev/null && mv products.php products.html
    clean "products"
}