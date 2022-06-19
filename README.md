# Ghostvallis

Corvallis is a ghost town. There's nothing to do other than stu*dying*, eating, and spending Orange Cash. Ghostvallis is a multiplayer game lobby made entirely with Javascript, CSS, HTML, and a Firebase Live database.

You can test the live production demo [here](https://ghostvallis.web.app/)

## How does it work?

There are two main factors that take place:

1. Player tracking
2. Orange cash tracking

In a nutshell...

- The client-side JS sends the player's data to the firebase live database
- The live-database triggers a callback in which all clients get notified
- The client-side JS renders all changes into the HTML


## Installation

In order to run the project, you need to set up a Firebase project. 
Use the following guide for [setting up Firebase](https://firebase.google.com/docs/web/setup)

The project can be run either on a web browser (opening the HTML) or through Firebase serve

(Must have npm and firebase installed to serve through firebase)

```bash
npm install firebase
```

### Setup firebase connection

Get the firebase configuration for your new firebase project. You can get this by navigating to *Project Overview* > *Project settings* >  *Your apps* > *Web App*

Replace the following in the *index.html* file with your own firebase configurations.
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Replace your web app's Firebase configuration HERE!
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXX",
  authDomain: "XXXXXXXXXX",
  databaseURL: "XXXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  measurementId: "G-L2XXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### Setup firebase authentication

First, go to *build/Authentication/Sign-in Method*. Then, "Add new provider" using the Anonymous provider. 


## Database rules
Make sure to set up the rules for your specific database

```javascript
{
  "rules": {
    ".read": "auth != null",
    ".write": false,
    "players": {
      "$uid": {
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "coins": {
      ".write": "auth != null"
    }
  }
}
```
## To-Do Features
View [project issues](https://github.com/osu-cs290-sp22/final-project-team-36/issues)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
