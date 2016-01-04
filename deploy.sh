#!/usr/bin/env bash

echo Deploying...

git status
git push origin master

echo

git checkout deploy
git merge master
git push origin deploy

echo

git checkout master

echo
echo Done!
