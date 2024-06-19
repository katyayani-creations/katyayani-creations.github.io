#!/bin/bash
function changeURL() {
    while IFS= read -r str; do
        sed -i -e 's/https:\/\/katyayani-creations.in\//https:\/\/katyayani-creations.github.io/g' $str.html
        sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str.html
    done < cat.txt 
    sed -i -e 's/https:\/\/katyayani-creations.in\//https:\/\/katyayani-creations.github.io/g' index.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' index.html
}

# wget https://katyayani-creations.in/prod.php -o /dev/null  && mv prod.php prod.txt
# sed -i -e 's/##/\n/g' prod.txt

# wget https://katyayani-creations.in/cat.php -o /dev/null  && mv cat.php cat.txt
# sed -i -e 's/##/\n/g' cat.txt

# wget https://katyayani-creations.in/index.php -o /dev/null && mv index.php index.html

# while IFS= read -r str; do
#     echo "downloading file: $str"
#     wget https://katyayani-creations.in/$str -o /dev/null && mv $str $str.html 
# done < cat.txt

while IFS= read -r str; do
    arrIN=(${str//\// })
    # echo ${arrIN[0]} 
    eval "mkdir -p ${arrIN[0]}"
    echo "downloading file: $str"
    wget https://katyayani-creations.in/$str -o /dev/null -O $str  && mv $str $str.html 
    break
done < prod.txt

changeURL

rm -rf *-e cat.txt prod.txt
git add .
git commit -am "update" && git push origin main
