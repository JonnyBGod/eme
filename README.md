IOS
===

## Test app

```
git clone git@github.com:JonnyBGod/eme.git
cd eme

npm install

find ./node_modules -type d -name fbjs -and -not -path ./node_modules/fbjs -print -exec rm -rf "{}" \;

npm start
```

Open ```./ios/eme.xcodeproj``` and build for any ios9+ device or emulator.


ANDROID
===

TODO
