#!/bin/bash
source ./bin/common.sh

downloadIndexPage
downloadCategoryList
downloadProductList

if [ -f cat.txt ]; then
    while IFS= read -r str; do
        echo "downloading file: $str"
        wget https://katyayani-creations.in/$str -o /dev/null && mv $str $str.html 
        clean $str
    done < cat.txt
fi

if [ -f prod.txt ]; then
    while IFS= read -r str; do
        source ./bin/downloadProd.sh $str
        # arrIN=(${str//\// })
        # mkdir -p $str
        # echo "downloading file: $str"
        # wget https://katyayani-creations.in/$str -o /dev/null -O $str/index.html
        # clean $str/index
    done < prod.txt
fi

changeURL
source ./bin/commit.sh
