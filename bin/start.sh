function changeURL() {
    sed -i -e 's/https:\/\/katyayani-creations.in\/contact/https:\/\/katyayani-creations.github.io\/contact/g' $1.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/terms-and-condition/https:\/\/katyayani-creations.github.io\/terms-and-condition/g' $1.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/toys/https:\/\/katyayani-creations.github.io\/toys/g' $1.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/stationery/https:\/\/katyayani-creations.github.io\/stationery/g' $1.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $1.html
}
function download() {
    wget https://katyayani-creations.in/$1.php && mv $1.php $2.html
    changeURL $2
}

function downloadCategory() {
    wget https://katyayani-creations.in/$1 && mv $1 $1.html
    changeURL $1
}

download "index" "index"

downloadCategory "contact"
downloadCategory "terms-and-conditions"
downloadCategory "toys"
downloadCategory "stationery"
downloadCategory "gift-packs"
downloadCategory "return-gifts"

git add .
git commit -am "update" && git push origin main
rm -rf *.html-e