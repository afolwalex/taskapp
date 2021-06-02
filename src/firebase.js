import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBveHGlcGXmyU0TUzTvwPF-jptQgOLUpB8",
    authDomain: "taskapp-c3737.firebaseapp.com",
    projectId: "taskapp-c3737",
    storageBucket: "taskapp-c3737.appspot.com",
    messagingSenderId: "561966008308",
    appId: "1:561966008308:web:f75b4993525f9bd2709ba1",
    measurementId: "G-P8029JD9CP"
}

const fireDb = firebase.initializeApp(firebaseConfig)

export default fireDb.database().ref()