Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@Stefanene 
osu-cs290-sp22
/
final-project-team-36
Public
Code
Issues
8
Pull requests
Discussions
Actions
Projects
Wiki
Security
Insights
Settings
final-project-team-36
/
README.md
in
Master
 

Spaces

2

Soft wrap
1
# Ghostvallis
2
​
3
Corvallis is a ghost town. There's nothing to do other than stu*dying*, eating, and spending Orange Cash. Ghostvallis is a multiplayer game lobby made entirely with Javascript, CSS, HTML, and a Firebase Live database.
4
​
5
You can test the live production demo [here](https://ghostvallis.firebaseapp.com/)
6
​
7
## How does it work?
8
​
9
There are two main factors that take place:
10
​
11
1. Player tracking
12
2. Orange cash tracking
13
​
14
In a nutshell...
15
​
16
- The client-side JS sends the player's data to the firebase live database
17
- The live-database triggers a callback in which all clients get notified
18
- The client-side JS renders all changes into the HTML
19
​
20
​
21
## Installation
22
​
23
In order to run the project, you need to set up a Firebase project. 
24
Use the following guide for [setting up Firebase](https://firebase.google.com/docs/web/setup)
25
​
26
The project can be run either on a web browser (opening the HTML) or through Firebase serve
27
​
28
(Must have npm and firebase installed to serve through firebase)
29
​
30
```bash
31
npm install firebase
32
```
33
​
34
### Setup firebase connection
35
​
36
Get the firebase configuration for your new firebase project. You can get this by navigating to *Project Overview* > *Project settings* >  *Your apps* > *Web App*
37
​
38
Replace the following in the *index.html* file with your own firebase configurations.
39
```javascript
40
// Import the functions you need from the SDKs you need
41
import { initializeApp } from "firebase/app";
42
import { getAnalytics } from "firebase/analytics";
43
// TODO: Add SDKs for Firebase products that you want to use
44
// https://firebase.google.com/docs/web/setup#available-libraries
No file chosen
Attach files by dragging & dropping, selecting or pasting them.
@Stefanene
Commit changes
Commit summary
Create README.md
Optional extended description
Add an optional extended description…
 Commit directly to the Master branch.
 Create a new branch for this commit and start a pull request. Learn more about pull requests.
 
© 2022 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
