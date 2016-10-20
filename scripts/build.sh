rm -rf dist/static
babel server -d dist
webpack
mv static dist/
