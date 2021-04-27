// Get a reference to the database service
var database = firebase.database();

//Todo: 引数に一意のIDを追加
function writeUserData(userID, name, lat, lng, area, comment) {
    firebase
        .database()
        .ref("users/" + userID)
        .set({
            userID: userID,
            username: name,
            lat: lat,
            lng: lng,
            area: area,
            comment: comment,
        });
    console.log("書き込み完了");
}
function read() {
    var database = firebase.database();
    var dataRef = database.ref("/users");
    dataRef.once("value").then(function (snapshot) {
        console.log(snapshot.child("userId").child("email").val());
    });
}
//writeUserData("userId5", "name4", "email4", "imageUrl4");
read();
