function twitterLogin() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().languageCode = "jp";
    provider.setCustomParameters({
        lang: "jp",
    });

    firebase.auth().signInWithRedirect(provider);
    console.log("twitter");

    // firebase
    //     .auth()
    //     .signInWithPopup(provider)
    //     .then((result) => {
    //         /** @type {firebase.auth.OAuthCredential} */
    //         var credential = result.credential;

    //         // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    //         // You can use these server side with your app's credentials to access the Twitter API.
    //         var token = credential.accessToken;
    //         var secret = credential.secret;

    //         // The signed-in user info.
    //         var user = result.user;
    //         // ...

    //         console.log("www");
    //     }).catch((error) => {
    //         // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         // The email of the user's account used.
    //         var email = error.email;
    //         // The firebase.auth.AuthCredential type that was used.
    //         var credential = error.credential;
    //         // ...
    //         console.log(error)
    //         console.log("zzz");
    //     });

    firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                console.log("twitterlogin");

                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                // You can use these server side with your app's credentials to access the Twitter API.
                var token = credential.accessToken;
                var secret = credential.secret;
                // ...

                console.log(result);
            }

            // The signed-in user info.
            var user = result.user;
        })
        .catch((error) => {
            // Handle Errors here.
            console.log("twitterlogin error");

            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...

            console.log(result);
        });
}

function twitterLogout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            console.log("logout success");
        })
        .catch((error) => {
            // An error happened.
            console.log("logout failed");
        });
    twitterStatus();
}

function twitterStatus() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("sign in.");
            twitterUser();
        } else {
            // No user is signed in.
            console.log("sign out.");
            document.getElementById("userIcon").src = "images/noname.png";
            document.getElementById("twitterName").innerHTML = "未ログイン";
            document.getElementById("userID").value = "";
            document
                .getElementById("logoutButton")
                .setAttribute("disabled", "true");
            document.getElementById("loginButton").removeAttribute("disabled");
        }
    });
}

function isLogin() {
    var login = false;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            login = true;
        } else {
            login = false;
        }
    });
    return login;
}

function twitterUser() {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }
    document.getElementById("userIcon").src = photoUrl;
    document.getElementById("twitterName").innerHTML = name;
    document.getElementById("userID").value = uid;
    document.getElementById("loginButton").setAttribute("disabled", "true");
    document.getElementById("logoutButton").removeAttribute("disabled");
}
