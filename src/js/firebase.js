"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote = (productID) => {
    const votesRef = ref(database, "votes/");
    const newVoteRef = push(votesRef);

    return set(newVoteRef, {
        productID,
        timestamp: Date.now()
    })
        .then(() => ({ status: "success", message: "Vote saved successfully." }))
        .catch(error => ({ status: "error", message: error?.message || String(error) }));
};

let getVotes = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `votes/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return { status: "success", data: snapshot.val() };
            } else {
                return { status: "empty", message: "No hay datos" };
            }
        })
        .catch((error) => {
            console.error("Error getting votes:", error);
            return { status: "error", message: error?.message || String(error) };
        });
};

export { saveVote, getVotes };