#!/bin/bash

#npm version patch

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')

docker build -t "chapadany.azurecr.io/point-of-sale-api:$PACKAGE_VERSION" .


