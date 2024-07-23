#!/bin/bash

rm -rf dist
npm run build
rm -r ../site/*
cp -r dist/client/* ../site