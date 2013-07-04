#!/bin/bash

CORE=core
UTIL=utils
CONST=const
MODULES=modules
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

for file in $MODULES/*
do
	echo casperjs test $file --includes=$INCLUDES
	casperjs test $file --includes=$INCLUDES
done

# echo casperjs test modules/* --includes=$INCLUDES
# casperjs test modules/* --includes=$INCLUDES