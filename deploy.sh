#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# da se reši usmerjevalne težave z ne-korenskimi (/) potmi
cp index.html 404.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com-interval-zaupanja:interval-zaupanja/interval-zaupanja.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com-interval-zaupanja:interval-zaupanja/web-app.git main:gh-pages

cd -
