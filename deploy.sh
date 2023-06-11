#!/bin/bash

echo "Start build project."
npm run build && cd./build
git init
git add .
git commit -m "Deploy to GitHub Pages"
git remote add origin git@github.com:pengfeiw/three-tester.git
git push -u --force origin gh-pahges
# git push --force "git@github.com:pengfeiw/three-tester.git" master:gh-pages
# rm -rf build
echo "Deploy to GitHub Pages - Success"
