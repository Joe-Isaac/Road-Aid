import { View, Text, Platform, StatusBar, Modal, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

import Map from "../components/Map";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "../Firebase/firebase-config";
import moment from "moment";


const ServiceRequestScreen = () => {
  const notchHeight = StatusBar.currentHeight || 0;
  const statusBarHeight = Platform.OS === "android" ? notchHeight : 0;
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(0);
  const data = route.params.data;
  const navigation = useNavigation()
  const [requestData, setRequestData] = useState(null);
  const [serviceDescription, setServiceDescription] = useState(false);
  const [issueDescription, setIssueDescription] = useState()
  const [user, setUser] = useState();
  const [newArr, setNewArr] = useState();


  useEffect(()=>{
    const auth = getAuth()
    if(auth.currentUser){
      //Authorized
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then(res => {
        if(res.data()){
          setUser(res.data());
        }
      })
    }

    let newerArr = [];

    // We're going to create a layout array
    data?.data?.services.map((item, index)=>{
        if(index % 2 === 0){
            newerArr.push(data?.data?.services.slice(index, index+2));
        }
    })

    setNewArr(newerArr)
    

    console.log("\n\n\n\n\nThis is the data ", data)

  }, [])

  async function dataToFireStore(mydata){
    console.log("Sarah's request data ", mydata)
    try{
      const auth = getAuth();
      const userDocRef = doc(db, "users", auth?.currentUser?.uid);
      const providerDocRef = doc(db, "users", data?.uid)
      const serviceDocRef = collection(db, "services")
      
      const serviceDocSnap = await addDoc(serviceDocRef, mydata);
      console.log("This is the snap that returned ", serviceDocSnap.id)
      await updateDoc(userDocRef, {"history" : arrayUnion(serviceDocSnap.id)});
      await updateDoc(providerDocRef, {"history" : arrayUnion(serviceDocSnap.id)});
      await setDoc(doc(db, "services", serviceDocSnap.id), {"serviceId": serviceDocSnap.id}, {merge: true})
      console.log("Data has been submited ")
    }
    catch(e){
    console.log("There was an error submitting ", e)
    }
  }

  function submitData(){
    if((issueDescription) !== null){
      const auth = getAuth()
      console.log("This is auth ", auth );
      const createdData = {
        // name: name, 
        // imageUrl: imageUrl,
        // coordinates: coordinates,
        // history: null
        
        requestData: requestData,
        description: issueDescription,
        user: user?.data?.name,
        userId: user?.uid,
        provider: data?.data?.name,
        providerId: data?.uid,
        status: 'pending',
        dateRequested: moment().format("YYYY-MM-DD"),
        timeRequested: moment().format("HH:mm")
      }


      dataToFireStore(createdData);

    }
    else{
      console.log("one of the fields is missing a value")
    }
}


  return (
    <View
      style={[
        tw`bg-white`,
        {
          marginTop: statusBarHeight,
        },
      ]}
    >
        <View style={[tw` flex flex-row justify-between my-2 flex-1`, {
          backgroundColor: 'rgba(0,0,0,0.0)'
        }]}>
            <TouchableOpacity onPress={()=>navigation.navigate("HomeScreen")}>
              <Icon type="material" name="arrow-back" color={"white"} size={48}/>
            </TouchableOpacity>
        </View>

      <View style={tw`w-full bg-white flex-col`}>
        <View style={tw`flex flex-col justify-center`}>
          <View style={tw`self-center`}>
          <Text style={tw`text-xl font-extrabold px-8`}>{data?.data?.name}</Text>
          </View>
        </View>

      </View>

      <View style={tw`flex flex-col items-start justify-center`}>
      <Text style={tw`text-2xl my-2 self-center font-bold`}>Services</Text>
        <View style={tw`flex-col w-full`}>
           
            {
             newArr && newArr.map((x, index) => (
                    <View key={index} style={[tw`flex-row my-1`, {
                        
                    }]}>
                        {
                            x.map((y, index) =>  (
                                <TouchableOpacity
                                onPress={()=>{
                                    setServiceDescription(true);
                                    setRequestData(y);
                                }}
                                key={index} style={[tw`w-1/2 mx-1 flex-col justify-center items-start px-2 rounded-md shadow-md h-28 bg-yellow-400`, {
                                    // backgroundColor: '#f3f3f3'
                                }]}>
                                <Text style={tw`text-base pl-1 font-bold self-start`}>{y.name}</Text>
                                
                                <Text style={tw`text-xs`}>{y.description}</Text>
                                <Text style={tw`text-xs font-bold`}>{y.price}</Text>
                                </TouchableOpacity>
                               )
                        )
                        }
                    </View>
                    ))
            }
            
        </View>

        <View style={tw`flex flex-col justify-center items-center w-full my-2`}>
          

          <Modal
         transparent={true}
         visible={serviceDescription} 
         animationType='slide'>
          <View style={[{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.8)',
            
          }]}>
            
            
            {/* This is the actual form that has the details of the mechanics */}
            <View style={[tw`h-1/2 pt-10 w-full flex flex-col items-center `, {backgroundColor: '#f3f3f3'}]}>
            
            
            
            <View style={[tw`w-full bg-white h-20 flex justify-center my-2`]}>
            <TextInput
                placeholderTextColor="#000"
                value={issueDescription}
                placeholder="Description of issue"
                onChangeText={(text) => setIssueDescription(text)}
              />
            </View>

            <View style={tw` flex justify-center items-center my-4 `}>
              <TouchableOpacity 
              onPress={()=>{
                submitData()
                setServiceDescription(false);
              }}
              style={tw`h-12 w-80 rounded-xl flex justify-center items-center`}>
                <Text style={tw`text-3xl font-extrabold`}>Submit</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity
            onPress={()=>setServiceDescription(false)}
            style={[tw`h-12 w-24 rounded-xl flex flex-row items-center justify-center mx-6 bg-yellow-400`, {
              zIndex: 12
            }]}>
              <Text style={tw`font-bold text-white text-lg`}>Close</Text>
            </TouchableOpacity>

            </View>
            
          </View>
        </Modal>
          
          
        </View>
      </View>

      <View>
            <Map coordinates={data?.data?.coordinates}/>
      </View>

      
    </View>
  );
};

export default ServiceRequestScreen;
