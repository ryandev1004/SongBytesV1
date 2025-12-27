
# Song Bytes (V1)

This is a concept project for a web application called 'Song Bytes.' An online web application where users can collect and auction off their favorite songs. This application is only semi-functional, as this was used more as a learning experience to adjust to using Vue.js. I eventually plan on coming back to this and creating a V2 for this project, so I wanted to have the information for the project stored somewhere.




## Overview

As stated above this is a **concept project** so it will lack certain features that I have plan on adding. On the application right now, if set up correctly you can do the following:

- Create a profile and view auctioned off songs on the home page.
- Request your own song and receive a 'byte' value based on the amount of streams.
- Filter through various songs to find one that matches your taste.

You'll notice you're unable to actually 'bid' on these songs, this is because this is primarily a test on my frontend development skills. It's because of this, I wasn't necessarily focused on too much of a backend for this version (hence why I'm using Google Firebase's free version). If I ever decide to come back to 'V1' to update this, then this section of the README will be removed but as of right now I plan on leaving this feature for the full fledged version.
## Authors

- [@ryandev1004](https://github.com/ryandev1004)


## Deployment

In order to run this project, you must create a google firebase database and a clourdinary media library. You can do that by going to the following links:

- [Google Firebase](https://firebase.google.com/)
- [Cloudinary](https://cloudinary.com/)

After you get all of this set up, set up an **.env** file in your root directory and fill out like this:

```
VITE_FIREBASE_API_KEY={API}
VITE_FIREBASE_AUTH_DOMAIN={DOMAIN}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID={PROJECTID}
VITE_FIREBASE_STORAGE_BUCKET={DOMAIN}.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID={SENDER ID}
VITE_FIREBASE_APP_ID={APP ID}
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/{CLOUD NAME}/image/upload
```

Anything in the curly braces should be pilled in with your own information.

Finally, to deploy the application, you can run it on vite's development server. That's what I ran it on as I did not create this version of the app to be fully deployed, so just run the following:

```
cd .\{project-name}\
```

```bash
npm install
```

```bash
npm run dev
```
