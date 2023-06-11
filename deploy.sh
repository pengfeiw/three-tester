#!/bin/bash

echo "Start build project."
npm run build && cd./build
git init
git add .
git commit -m "Deploy to GitHub Pages"
git push --force "git@github.com:pengfeiw/three-tester.git" master:gh-pages > /dev/null 2>&1
# rm -rf build
echo "Deploy to GitHub Pages - Success"
