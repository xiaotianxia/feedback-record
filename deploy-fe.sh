#!/usr/bin/env sh

cd front
echo "========================== start packing... ========================="
npm run build

# copy static files
rm -rf ../app/public/*
cp -rf ./dist/* ../app/public

echo "========================== packing done! ========================="


