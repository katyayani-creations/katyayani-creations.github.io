function download() {
    wget https://katyayani-creations.in/$1.php && mv $1.php $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/contact/https:\/\/katyayani-creations.github.io\/contact/g' $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/terms-and-condition/https:\/\/katyayani-creations.github.io\/terms-and-condition/g' $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/toys/https:\/\/katyayani-creations.github.io\/toys/g' $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/stationery/https:\/\/katyayani-creations.github.io\/stationery/g' $2.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $2.html
}

download "index" "index"
download "contact" "index"
download "terms" "terms-and-condition"
download "filter.php?id=11&type=CATEGORY" "toys"
download "filter.php?id=13&type=CATEGORY" "stationery"


git add .
git commit -am "update" && git push origin main
rm -rf *.html-e