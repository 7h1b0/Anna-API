Anna-API
=====================

## Project description

A simple REST api for home automation using NodeJS ans SQLite


## Rest API routes

* Command Controller

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /command        | GET 	  | Get all the commands     
| /command/       | POST      | Add command     
| /command/:id    | GET       | Execute a command          
| /command/:id    | PUT       | Update a command   
| /command/:id    | DELETE    | Delete a command

* Event Controller

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /event          | GET 	  | Get list of events  
| /event/         | POST      | Add event     
| /event/:id      | GET       | Get a single event           
| /event/:id      | PUT       | Update a event   
| /event/:id      | DELETE    | Delete a event

* Special Routes

| Path            | HTTP Verb | Description                 
|-----------------|-----------|-----------------------------
| /os		      | GET 	  | Get info about host


## Required

* NodeJS

## Installation

1. ```./Anna-API/npm install ```
2. ```./Anna-API/node app.js ```


## Developer

* 7h1b0