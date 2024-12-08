/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// * MARK: TOP
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const { children } = props;

  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //* MARK: Firebase singUp and login functions
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData(null);
    return signOut(auth);
  }

  //*MARK: Global State
  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  };

  useEffect(() => {
    //* authentication listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('CURRENT USER: ', user);
      setGlobalUser(user);
      //* if there is no user, empty the user state and return from listener
      if (!user) {
        console.log('No Active user');
        return;
      }

      //* if there is a user, check if the user has data in the db, if they do then fetch said data, and update the global state.

      try {
        setIsLoading(true);

        //* first create a reference for the document, (a labeled json object)
        const docRef = doc(db, 'users', user.uid);
        //* Then fetch and snapshot the doc, to see if there is anything there.
        const docSnap = await getDoc(docRef);

        let firebaseData = {};
        if (docSnap.exists()) {
          firebaseData = docSnap.data();
          console.log('Found user data', firebaseData);
        }
        setGlobalData(firebaseData);
      } catch (err) {
        console.error('Error: ', err.message);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {}
      {children}
    </AuthContext.Provider>
  );
}
