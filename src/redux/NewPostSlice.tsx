import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export const userStore = () => {
  const getUsersList = async () => {
    try {
      const userCollection = collection(db, "userDetails");
      const userDocs = await getDocs(userCollection);
      const usersList: any = [];

      userDocs.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          uid: userData.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      });

      return usersList;
    } catch (error) {
      console.error("Error fetching users list:", error);
      return [];
    }
  };
  return { getUsersList };
};
