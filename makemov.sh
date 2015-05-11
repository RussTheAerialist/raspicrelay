#!/bin/sh

cat `ls *.jpg | sort` | ffmpeg -f image2pipe -r 30 -vcodec mjpeg -i - -c:v libx264 -r 30 output.mp4
