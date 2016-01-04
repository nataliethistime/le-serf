#!/usr/bin/env bash

echo Deploying...

git status
git push origin master
git checkout deploy
git merge master
git push origin deploy
git checkout master

echo
echo Done!
