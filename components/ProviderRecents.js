import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { Image } from 'react-native-elements'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { db } from '../Firebase/firebase-config'
import CompareMap from './CompareMap';
const mechanicRecents = ({ data }) => {
  const [userData, setUserData] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [mechanicData, setmechanicData] = useState();
  const [mechanicRemarks, setmechanicRemarks] = useState();


  async function getUserData(){
    const userDocRef = doc(db, "users", data?.userId);
    const userSnap = getDoc(userDocRef);
    setUserData((await userSnap).data());
}

async function submitAction(requestStatus){
    let newData;

    if(mechanicRemarks){
        newData = {
            "status": requestStatus,
            "mechanicRemarks": mechanicRemarks,
        }
    }
    else{
        newData = {
            "status": requestStatus
        }
    }
    
    try{
        const serviceDocRef = doc(db, "services", data?.serviceId);
    
        await updateDoc(serviceDocRef, newData);
        console.log("Data updated successfully");
        setIsVisible(false);
    }
    catch(err){
        console.log("Error encountered ", err);
    }
}

async function getmechanicData(){
    const mechanicDocRef = doc(db, "users", data?.providerId);
    const mechanicSnap = getDoc(mechanicDocRef);
    setmechanicData((await mechanicSnap).data());
}


  const [statusColor, setStatusColor] = useState({
    pending: "#faad14",
    inProgress: "#1677ff",
    completed: "#52c41a",
    rejected: "#f5222d",
  });

  
  //The current status will change for every request.
  const [currentStatusColor, setCurrentStatusColor] = useState();
  useEffect(()=>{
    console.log("The data that has been brought ", data)

    switch(data?.status){
        case 'pending':
            setCurrentStatusColor(statusColor.pending);
            break;
        case 'inProgress':
            setCurrentStatusColor(statusColor.inProgress);
            break;
        case 'completed':
            setCurrentStatusColor(statusColor.completed);
            break;
        case 'rejected':
            setCurrentStatusColor(statusColor.rejected);
            break;
    }
    getUserData();
    getmechanicData();

    // console.log("\n\n provider data", data)
    // console.log("\n\n user data", userData)
}, [])

  return (
    <TouchableOpacity
    onPress={()=>{
      setIsVisible(true)
    }}
      style={[
        tw`bg-white rounded-3xl px-1 mx-2 my-1 w-1/2 shadow-md flex-col py-3`,
        { backgroundColor: "#fff" },
      ]}
    >
      <View
        style={[tw` w-full flex items-center justify-center rounded-3xl py-2`]}
      >
        <Image
          style={{
            height: 100,
            width: 150,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn.pixabay.com/photo/2018/01/16/15/49/house-3086212_1280.jpg",
          }}
        />
      </View>

      {/* Below shows the issue */}
      <View style={tw`flex w-full flex-col items-center justify-evenly `}>
        {/* FlexBox tricks here */}
        <Text style={[styles.smallText, tw`font-bold`]}>{data?.user}</Text>
        <Text style={[styles.smallText, tw`font-bold`]}>
          {data?.dateRequested} | {data?.timeRequested}
        </Text>
        <View
          style={[
            tw`flex flex-row items-center my-2 py-1 rounded-full justify-center px-2`,
            {
              backgroundColor: currentStatusColor,
            },
          ]}
        >
          <View style={tw`w-24 flex justify-center items-center`}>
          <Text style={tw`text-white text-base font-bold`}>{data?.status}</Text>
          </View>
        </View>
      </View>

      {/* Modal for displaying data */}

      <Modal visible={isVisible} transparent={true}>
        <View
          style={[
            tw`h-full flex justify-end`,
            {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          ]}
        >
          <View style={[tw`h-1/2`, { marginBottom: 0 }]}>
            {userData && (
              <CompareMap
                initialCoordinates={mechanicData?.data?.coordinates}
                finalCoordinates={userData?.data?.coordinates}
              />
            )}
          </View>
          <ScrollView>
            <View style={[tw`h-full bg-white flex flex-col pt-4 px-3`]}>
              <TouchableOpacity
                style={tw`h-7 w-16 self-end bg-yellow-400 items-center justify-center rounded-xl`}
                onPress={() => setIsVisible(false)}
              >
                <Text style={tw`text-white`}>Close</Text>
              </TouchableOpacity>

              <View style={tw`w-full flex flex-col`}>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Name</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{userData?.data?.name}</Text>
                  </View>
                </View>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Issue</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.requestData?.name}</Text>
                  </View>
                </View>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Date Requested</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.dateRequested}</Text>
                  </View>
                </View>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Time Requested</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.timeRequested}</Text>
                  </View>
                </View>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Price of Service</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.requestData?.price}</Text>
                  </View>
                </View>
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>Description</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.description}</Text>
                  </View>
                </View>
              </View>

              {!data?.mechanicRemarks ? (
                <View style={tw`flex-row w-full justify-center my-4`}>
                  <TextInput
                    onChangeText={(text) => setmechanicRemarks(text)}
                    placeholder="enter remarks"
                    style={[tw`h-20 w-4/5`, { borderWidth: 1 }]}
                  />
                </View>
              ) : (
                <View style={tw`w-full flex justify-evenly flex-row`}>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text style={tw`font-bold`}>mechanic remarks</Text>
                  </View>
                  <View style={tw`flex justify-start w-1/3 my-2`}>
                    <Text>{data?.mechanicRemarks}</Text>
                  </View>
                </View>
              )}
              {data?.status === "pending" ? (
                <View style={tw`flex-row w-full justify-evenly`}>
                  <TouchableOpacity
                    onPress={() => submitAction("inProgress")}
                    style={[
                      tw`h-8 flex items-center justify-center w-24 rounded-xl`,
                      {
                        backgroundColor: "#52c41a",
                      },
                    ]}
                  >
                    <Text style={tw`text-white font-bold`}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => submitAction("rejected")}
                    style={[
                      tw` h-8 flex items-center justify-center w-24 rounded-xl`,
                      {
                        backgroundColor: "#f5222d",
                      },
                    ]}
                  >
                    <Text style={tw`text-white font-bold`}>Reject</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                data?.status === "inProgress" && (
                  <View style={tw`flex-row w-full justify-evenly`}>
                    <TouchableOpacity
                      onPress={() => submitAction("completed")}
                      style={[
                        tw`h-8 flex items-center justify-center w-24 rounded-xl`,
                        {
                          backgroundColor: "#52c41a",
                        },
                      ]}
                    >
                      <Text style={tw`text-white font-bold`}>Complete</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default mechanicRecents;

const styles = StyleSheet.create({
  smallText: [tw`text-sm text-black`],
});
