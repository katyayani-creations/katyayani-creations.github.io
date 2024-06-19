function download() {
    wget https://katyayani-creations.in/$1.php && mv $1.php $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/contact/https:\/\/katyayani-creations.github.io\/contact/g' $2.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/terms-and-condition/https:\/\/katyayani-creations.github.io\/terms-and-condition/g' $2.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $2.html
}

download "index" "index"
download "contact" "index"
download "terms" "terms-and-condition"

git add .
git commit -am "update" && git push origin main