# Intellibot

## Discord moderation bot

Not made for multiserver use at this point. Migth do this later.

## Installation

npm install (idk how yarn works)

## Usage

Start in dev mode with npm run start:dev
Start in production mode npm run start

Be sure to fill out the requiered fields in .env_example and rename the file to .env

Also a google firebase is requiered! You will have to create your own cloud firestore and add serviceAccount.json to src/config!

### Database

The database is used to store all mutes, warns and tempbans in case of a restart for now!

Create a collection called "mutes" (Repeat this process for "mutes", "bans" and "warnings").
Under that collection create a document called "users".
Under that document create a field called "ids" as a type Array.
