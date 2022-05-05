import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/performance';

/**
 * Usually Exposing our API Key inside of a react app is not a good idea.
 * In Firebase not only is it ok, it's vital for users to be able to connect and query our project.
 * We use Authentication steps and backend rules to verify and authenticate each query received by the api.
 */

const firebaseConfig = {
  apiKey: 'AIzaSyAzN6fIGwqedSkw4xj9AnY9XxThlEhFCAk',
  authDomain: 'bangor-procurement-system.firebaseapp.com',
  projectId: 'bangor-procurement-system',
  storageBucket: 'bangor-procurement-system.appspot.com',
  messagingSenderId: '394679565549',
  appId: '1:394679565549:web:58e3f93d1bc3e34be860e4',
};
firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();
const projectPersistence = firebase.auth;
// Initialize Performance Monitoring and get a reference to the service
const projectPerf = firebase.performance();

const timestamp = firebase.firestore.Timestamp;

export {
  projectFirestore,
  projectAuth,
  projectStorage,
  projectPersistence,
  timestamp,
};
