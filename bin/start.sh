categoryArr=(
    "home-and-decor"
    "contact" 
    "terms-and-conditions" 
    "toys"
    "stationery"
    "gift-packs"
    "return-gifts"
    "board-games"
    "products"
)

function changeURL() {
    for str in ${categoryArr[@]}; do
        sed -i -e 's/https:\/\/katyayani-creations.in\/'$str'/https:\/\/katyayani-creations.github.io\/'$str'/g' $str.html
        sed -i -e 's/https:\/\/katyayani-creations.in\/'$str'/https:\/\/katyayani-creations.github.io\/'$str'/g' index.html
        sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' $str.html
        sed -i -e 's/G-6VBNE8F9XL/G-TMFL4Z8DEZ/g' index.html
    done    
}

# wget https://katyayani-creations.in/index.php && mv index.php index.html

# for str in ${categoryArr[@]}; do
#     wget https://katyayani-creations.in/$str && mv $str $str.html
# done 

changeURL

git add .
git commit -am "update" && git push origin main
rm -rf *.html-e