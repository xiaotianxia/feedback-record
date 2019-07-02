#!/usr/bin/env sh

# build 
cd front
echo "========================== start building ========================="
npx vue-cli-service build --target lib --name feedback-recorder src/index.js

# rename & remove extra files
cd dist
mv feedback-recorder.umd.min.js feedback-recorder.min.js
mv feedback-recorder.css index.css

rm demo.html
rm feedback-recorder.common.*
rm feedback-recorder.umd.*

echo "========================== building done! ========================="


