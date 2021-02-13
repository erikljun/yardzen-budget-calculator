import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

export default function App() {
  const firebaseApp = firebase.apps[0];

  const db = firebase.firestore(firebaseApp);
  db.collection('items')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    });

  return (
    <div>
      <h1>React and Firebase</h1>
      <code>
        <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
      </code>
    </div>
  );
}
