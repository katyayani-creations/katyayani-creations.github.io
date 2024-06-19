function download() {
    wget https://katyayani-creations.in/$1.php && mv $1.php $1.html
}

download "index"
download "contact"