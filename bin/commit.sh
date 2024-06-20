#!/bin/bash

rm -rf *.html-e *.txt-e cat.txt prod.txt
git add .
git commit -am "update" && git push origin main