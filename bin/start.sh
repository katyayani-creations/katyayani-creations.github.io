#!/bin/bash
source ./bin/common.sh

downloadIndexPage
downloadProducts

changeURL
source ./bin/commit.sh
downloadCategoryList
if [ -f cat.txt ]; then
    while IFS= read -r str; do
        source ./bin/downloadCat.sh $str
    done < cat.txt
fi

changeURL
source ./bin/commit.sh
downloadProductList
if [ -f prod.txt ]; then
    while IFS= read -r str; do
        source ./bin/downloadProd.sh $str
    done < prod.txt
fi

changeURL
source ./bin/commit.sh

