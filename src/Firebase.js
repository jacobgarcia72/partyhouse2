
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

import config from './config/keys';


firebase.initializeApp(config);
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();