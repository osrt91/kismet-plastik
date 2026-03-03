#!/bin/bash
cd "C:/Users/osrt91/Desktop/Proje/kismetplastik-new"
npm install 2>&1 | tee "C:/Users/osrt91/Desktop/Proje/kismetplastik-new/_npm_output.txt"
echo "EXIT_CODE=$?" >> "C:/Users/osrt91/Desktop/Proje/kismetplastik-new/_npm_output.txt"
