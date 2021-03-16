import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7JQf8rlIobzAKrMJlcwKNhD-Z_1s_zf0",
  authDomain: "firestore-react-9810b.firebaseapp.com",
  projectId: "firestore-react-9810b",
  storageBucket: "firestore-react-9810b.appspot.com",
  messagingSenderId: "423203516846",
  appId: "1:423203516846:web:0c7888e9882fc92c40183f",
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  window.location.reload();
}

export function checkAuth(callback) {
  auth.onAuthStateChanged(callback);
}

export async function logout() {
  await auth.signOut();
  window.location.reload();
}

export async function getCollection(id) {
  const snapshot = await db.collection(id).get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log(data);
}

export async function getUserLists(userId) {
  const snapshot = await db
    .collection("lists")
    // .where("author", "==", userId)
    .where("userIds", "array-contains", userId)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function uploadCoverImage(file) {
  const uploadTask = storage
    .ref(`images/${file.name}-${file.lastModified}`)
    .put(file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => console.log("Image uploading..", snapshot),
      reject,
      () => {
        storage
          .ref("images")
          .child(`${file.name}-${file.lastModified}`)
          .getDownloadURL()
          .then(resolve);
      }
    );
  });
}

export async function createList(list, user) {
  const { name, description, image } = list;
  await db.collection("lists").add({
    name,
    description,
    image: image ? await uploadCoverImage(image) : null,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    author: user.uid,
    userIds: [user.uid],
    users: [
      {
        id: user.uid,
        name: user.displayName,
      },
    ],
  });
}

export async function getList(listId) {
  try {
    const list = await db.collection("lists").doc(listId).get();
    if (!list) throw Error("List doesn't exist");
    return list.data();
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
}

export async function createListItem({ user, listId, item }) {
  try {
    const SHOT_KEY = "NZITZHAVGFKAO08SX1SADWGXDBCTCIYX";

    const response = await fetch(
      `https://screenshotapi.net/api/v1/screenshot?url=${item.link}&token=${SHOT_KEY}`
    );
    console.log(response);
    const { screenshot } = await response.json();
    console.log(screenshot);

    db.collection("lists")
      .doc(listId)
      .collection("items")
      .add({
        name: item.name,
        link: item.link,
        image: screenshot,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        author: { id: user.uid, username: user.displayName },
      });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function subscribeToListItem(listId, callback) {
  return db
    .collection("lists")
    .doc(listId)
    .collection("items")
    .orderBy("created", "desc")
    .onSnapshot(callback);
}

export function deleteListItem(listId, itemId) {
  return db
    .collection("lists")
    .doc(listId)
    .collection("items")
    .doc(itemId)
    .delete();
}

export async function addUserToList(user, listId) {
  await db
    .collection("lists")
    .doc(listId)
    .update({
      userIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
      users: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        name: user.displayName,
      }),
    });
  window.location.reload();
}
