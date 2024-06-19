function download() {
    wget https://katyayani-creations.in/$1.php && mv $1.php $1.html
    sed -i -e 's/https:\/\/katyayani-creations.in\/contact/https:\/\/katyayani-creations.github.io\/contact/g' $1.html
    sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $1.html

    
}

download "index"
download "contact"

git commit -am "update" && git push origin main