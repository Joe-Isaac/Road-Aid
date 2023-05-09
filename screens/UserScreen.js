import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { db } from '../Firebase/firebase-config';
import { useState } from 'react';
import { Image } from 'react-native-elements';


const UserScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState();
  const [history, setHistory] = useState();

  useEffect(()=>{
        //First step is to check if the user is authorized
        const auth = getAuth();
        if(auth){
            //user is authenticated, proceed to fetch data
            getUserData(auth);
            
        }
        else{
            //user is not authenticated
            navigation.navigate("SignInScreen")
        }
  }, [])

  async function getUserData(auth){
            
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            getHistoryData(data?.history);
            setUserData(data);
  }

  async function getHistoryData(array){
    setHistory([]);
    console.log("This is array ", array)
    const historyQueryRef = collection(db, "services");

    const queryData = await (await getDocs(historyQueryRef, where("id", "array-contains-any", array))).docs;
    queryData.map(data => setHistory(y => [...y, data.data()]))
  }

  return (
    <View style={tw`bg-white h-full`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <Image source={{uri: userData?.data?.imageUrl}} style={tw`rounded-full h-12 w-12`}/>
        <Text style={tw`text-black text-lg mb-2`}>Name: {userData?.data?.name}</Text>
        <Text style={tw`text-black text-lg mb-2`}>Email: {userData?.email}</Text>
      </View>

      
    </View>
  );
};

export default UserScreen;
