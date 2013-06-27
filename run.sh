#!/bin/bash

CORE=core
UTIL=utils
CONST=const
INCLUDES=""

for folder in $CORE/* $UTIL/* $CONST/*
do
	for file in $folder
	do
	  if [[ $INCLUDES = "" ]]; then
	  	INCLUDES=$file
	  else
	  	INCLUDES=$INCLUDES,$file
	  fi
	done
done

casperjs test tests --includes=$INCLUDES