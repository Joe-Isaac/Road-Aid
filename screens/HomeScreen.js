import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Map from "../components/Map";
import { FlatList, ScrollView, TextInput, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import { authentication } from "../Firebase/firebase-config";
import { signOut } from "firebase/auth";
import { collection, getDocs, getDoc, doc, where, setDoc, updateDoc, query } from "firebase/firestore/lite";
import { db } from "../Firebase/firebase-config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import ServicesCard from "../components/ServicesCard";
import VehicleComponent from "../components/VehicleComponent";
import * as Location from "expo-location";
import { Modal } from "react-native";
import Mechanics from "../components/Mechanics";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const notchHeight = StatusBar.currentHeight || 0;
  const statusBarHeight = Platform.OS === "android" ? notchHeight : 0;
  const [mechanicsData, setMechanicsData] = useState([]);
  const [userAddress, setUserAdress] = useState(null);
  const [userData, setUserData] = useState();

  const [coordinates, setCoordinates] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [authorized, setAuthorized] = useState(null)
  const [history, setHistory] = useState()
  const [vehicleBrakeType, setVehicleBrakeType] = useState();
  const [vehicleHp, setVehicleHP] = useState();
  const [vehicleModel, setVehicleModel] = useState();
  const [vehicleTorque, setVehicleTorque] = useState();
  const [vehicleName, setVehicleName] = useState();
  const [vehicleImageUrl, setVehicleImageUrl] = useState();
  const [userFormVisible, setUserFormVisible] = useState(false)

  // New Variables
  const [imageUrl, setImageUrl] = useState();
  const [name, setName] = useState();

  const [firstName, setFirstName] = useState();
  const [MechIsVisible, setMechIsVisible] = useState(false);
  const [currentMechanic, setCurrentMechanic] = useState()
  const [serviceRecord, setServiceRecord] = useState(false);

  console.log("This is the notch height of this device ", notchHeight);

  useEffect(() => {
    function checkAuth() {
      onAuthStateChanged(authentication, (user) => {
        if (user) {
          setAuthorized(user);
        } else {
          console.log("User is not authenticated ");
          navigation.navigate("signInScreen");
        }
      });
    }
  

    checkAuth();

  }, []);

  async function getHistoryData(array){
    setHistory([]);
    console.log("This is array ", array)
    const historyQueryRef = collection(db, "services");
    
    const queryData = await (await getDocs(historyQueryRef, where("id", "array-contains-any", array))).docs;
    queryData.map(data => setHistory(y => [...y, data.data()]))
  }



  useEffect(()=>{
    async function getLocation (){
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status) {
        let location = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setCoordinates(location);
        console.log("This is geocode ", geocode)
        setUserAdress(geocode);
      } else {
        console.log("Permission denied");
      }
  
    };
  
    async function getMechanics() {
      setMechanicsData([]);
      const mechCollectionRef = await collection(db, "users");
      const q = query(mechCollectionRef, where("role", "==", "mechanic"))
      const mechSnapShot = await getDocs(q);
      
      const mechSnapData = mechSnapShot.docs.map(x => x.data());

      setMechanicsData(mechSnapData);
    }

    async function getUserInfo(){
      const auth = getAuth()
      const userDocRef = await doc(db, "users", auth.currentUser.uid);
      const userSnapShot = await getDoc(userDocRef);
      if(userSnapShot != null){
        if(userSnapShot.data().data === null){
          setUserFormVisible(true)
        }
        else{
          setUserData(userSnapShot.data())
          if(userSnapShot.data().history){
            getHistoryData(userSnapShot?.data().history)
          }
          else{
            setHistory(null)
          }
        }
      }
      else{
        console.log("user details does not exist")
      }
    }

    getLocation();
    getMechanics();
    getUserInfo();

      return ()=>{
        console.log("\n")
      }
  }, [authorized])
  


function submitData(){
  if((name) !== null){
    const createdData = {
      name: name, 
      imageUrl: imageUrl || null,
      coordinates: coordinates,
      vehicleDetails: {
        vehicleBrakeType : vehicleBrakeType,
        vehicleHp : vehicleHp,
        vehicleModel : vehicleModel, 
        vehicleTorque : vehicleTorque, 
        vehicleName :  vehicleName, 
        vehicleImageUrl : vehicleImageUrl || null,
      }
    }

    console.log("This is the data being created ", createdData)

    dataToFireStore(createdData);

  }
  else{
    console.log("one of the fields is missing a value")
  }
}

const renderItem = (data) => (
  <TouchableWithoutFeedback
  onPress={()=>{
    setCurrentMechanic(data.item);
    setMechIsVisible(true);
    navigation.navigate("ServiceRequestScreen", {
      data: data.item
    })
  }}
  style={[tw`mx-1 rounded-md shadow-md my-2 `, {backgroundColor: '#f3f3f3'}]}>
       <Mechanics data={data}/>
   </TouchableWithoutFeedback>
)

async function dataToFireStore(mydata){
  try{
    const auth = getAuth();
  const docRef = doc(db, "users", auth?.currentUser?.uid);
  await updateDoc(docRef, {"data" : mydata});
  console.log("Data has been submited ")
  setUserFormVisible(false);
  setUserData((await getDoc(docRef)).data());
  }
  catch(e){
    console.log("There was an error ", e)
  }
}

  // Sign Out function

  function signOutUser() {
    signOut(authentication)
      .then((res) => {
        console.log("\n\nThis user has been signed out \n", res);
        navigation.navigate("LandingScreen");
      })
      .catch((err) => {
        console.log("\n\nThere was an error signing out the user \n", err);
      });
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View
        style={[
          tw`h-full`,
          {
            marginTop: statusBarHeight,
            backgroundColor: "",
          },
        ]}
      >
        {/* Header section contains quick details about the user, such as the name, avatar, and location */}
        <View style={tw`mx-2 flex flex-row justify-between items-center my-2`}>
          <View
            style={[
              tw`h-20 w-44 rounded-full flex bg-yellow-400 shadow-lg flex-row items-center justify-evenly`,
              {
                // backgroundColor: "#f3f3f3",
              },
            ]}
          >
            <View style={tw``}>
              <Icon
                style={[
                  tw`mr-4 rounded-full p-3`,
                  {
                    backgroundColor: "",
                  },
                ]}
                name={"account-circle"}
                type="material"
                color={"black"}
                size={36}
                onPress={() => {
                  setServiceRecord(true);
                }}
              />
            </View>

            <View style={tw`w-1/2`}>
              <Text style={tw`text-black `}>Welcome</Text>
              <Text style={tw`text-black font-bold text-sm`}>{userData?.data?.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={()=>{setIsVisible(true); console.log("Touched")}}
            style={[
              tw`h-20 w-44 rounded-full flex flex-row items-center bg-yellow-400 shadow-lg justify-evenly`,
              {
                // backgroundColor: "#f3f3f3",
              },
            ]}
          >
            <View>
              <Icon
                style={[
                  tw`rounded-full p-1`,
                  {
                    backgroundColor: "",
                  },
                ]}
                name={"location-on"}
                type="material"
                color={"black"}
                size={34}
              />
            </View>
            <View>
              <Text style={tw`text-black`}>Your Location</Text>
              {userAddress ? (
                <Text style={tw`text-black font-bold text-base`}>
                  {userAddress[0]?.district + " " + userAddress[0]?.country}
                </Text>
              ) : (
                <Text style={tw`text-white font-bold text-base`}>Unknown</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        

        {/* Search for something general, like a mechanic you may know of */}
        <View style={tw`flex-row my-4 justify-evenly items-center`}>
        <TouchableOpacity
        onPress={()=>{signOutUser()}}>
         <Icon
         type="material"
         name="logout"
         size={30}
         />
        </TouchableOpacity>
        <View
          style={[
            tw`my-4 w-2/3 h-12 rounded-full flex flex-row justify-between items-center`,
            {
              backgroundColor: "#f3f3f3",
            },
          ]}
        >
        
        </View>
        </View>

        {/* This section shows quick details of the vehicle this user owns */}

        <VehicleComponent data={userData?.data?.vehicleDetails} />

        {/* This section covers quick info such as the vehicles history of services */}

        <View>
          <View
            style={tw`w-full flex flex-row justify-around items-center pt-5`}
          >
            <Text style={tw`text-black font-bold text-3xl `}>
              Mechanics
            </Text>
          </View>
          {/* Map the service history here */}
            <View style={tw`w-full`}>
            <FlatList
            style={tw`bg-white w-full`}
            data={mechanicsData}
            renderItem={renderItem}
            keyExtractor={(data, index) => index.toString()}
            horizontal={true}
            />
            </View>
        </View>

            {/* This modal will be used to show user's location */}
        <Modal
        
         transparent={true}
         visible={isVisible} 
         animationType='slide'
         >
          <View style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <View style={{
              borderRadius: 20,
              paddingTop: 15,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}>
            <TouchableOpacity
            onPress={()=>setIsVisible(false)}
            style={[tw`h-12 w-24 rounded-xl flex flex-row items-center justify-center mx-6 bg-yellow-500`, {
              marginBottom: -26,
              zIndex: 12
            }]}>
              <Text style={tw`font-bold text-lg`}>Close</Text>
            </TouchableOpacity>
            <Map coordinates={coordinates}/>
            </View>
          </View>
        </Modal>



          {/* This is the Modal used to fill data by clients */}
        <Modal
         transparent={true}
         visible={userFormVisible} 
         animationType='slide'>
          <View style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }}>
            
            <TouchableOpacity
            onPress={()=>setUserFormVisible(false)}
            style={[tw`h-12 w-24 rounded-xl flex flex-row items-center justify-center mx-6 bg-yellow-500`, {
              marginBottom: -26,
              zIndex: 12
            }]}>
              <Text style={tw`font-bold text-white text-lg`}>Close</Text>
            </TouchableOpacity>
            {/* This is the actual form that has the details of the mechanics */}
            <View style={[tw`h-5/6 pt-10 w-full flex flex-col items-center `, {backgroundColor: '#f3f3f3'}]}>
            <ScrollView>
            <Text style={tw`text-4xl font-bold my-4`}>Enter details</Text>
            
            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="name"
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="image address"
                value={imageUrl}
                onChangeText={(text) => setImageUrl(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Vehicle Name"
                value={vehicleName}
                onChangeText={(text) => setVehicleName(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Vehicle image address"
                value={vehicleImageUrl}
                onChangeText={(text) => setVehicleImageUrl(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Vehicle Model"
                value={vehicleModel}
                onChangeText={(text) => setVehicleModel(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="horse powers"
                value={vehicleHp}
                onChangeText={(text) => setVehicleHP(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Brake type"
                value={vehicleBrakeType}
                onChangeText={(text) => setVehicleBrakeType(text)}
              />
            </View>

            <View style={[tw`w-full bg-white h-10 flex justify-center my-2`]}>
            <TextInput
                style={styles.textInput}
                placeholderTextColor="#000"
                placeholder="Torque"
                value={vehicleTorque}
                onChangeText={(text) => setVehicleTorque(text)}
              />
            </View>

            <View style={tw` flex justify-center items-center my-4 `}>
              <TouchableOpacity 
              onPress={()=>{
                submitData()
            }
            }
              style={tw`h-12 w-80 rounded-xl bg-white flex justify-center items-center`}>
                <Text style={tw`text-3xl font-extrabold`}>Submit</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

            </View>
            
          </View>
        </Modal>  

            {/* Modal below will show the history of the user */}
        <Modal
        transparent={true}
        visible={serviceRecord} 
        animationType='slide'>
        <View style={[tw`w-full h-full flex-col justify-end`, {
          backgroundColor: 'rgba(0,0,0,0.7)'
        }]}>
        <View style={tw`bg-yellow-400 h-2/3 rounded-t-3xl flex-col items-center justify-center`}>
        
        <View style={tw`w-full flex-row justify-between items-center px-8`}>
        <View style={tw``}>
        <Text style={tw`text-white text-xl font-bold mb-4 pt-3 mx-3`}>History of requests</Text>
        </View>

        <TouchableOpacity
        onPress={()=>setServiceRecord(false)}
        style={tw`bg-white h-7 rounded-xl flex items-center justify-center w-16`}>
          <Text style={tw`font-bold`}>Close</Text>
        </TouchableOpacity>
        </View>
        <ScrollView>
        {
            history && history.map((data, index)=>{
                return (
                    <ServicesCard key={index} data={data}/>
                )
            })
                
        }
        </ScrollView>
        </View>
        </View>
        </Modal>
      </View>
      
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
