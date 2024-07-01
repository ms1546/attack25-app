#!/bin/bash

set -e

FUNCTION_NAME="backend"
ZIP_FILE="main.zip"

GOOS=linux GOARCH=amd64 go build -o main main.go
zip $ZIP_FILE main

aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$ZIP_FILE
