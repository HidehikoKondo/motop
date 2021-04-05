// Get a reference to the database service
var database = firebase.database();

function writeUserData(userId, name, email, imageUrl) {
    firebase
        .database()
        .ref("users/" + userId)
        .set({
            username: name,
            email: email,
            profile_picture: imageUrl,
        });
}
function read() {
    var database = firebase.database();
    var dataRef = database.ref("/users");
    dataRef.once("value").then(function (snapshot) {
        console.log(snapshot.child("userId").child("email").val());
    });
}
writeUserData("userId5", "name4", "email4", "imageUrl4");
read();
