import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { Pressable } from "react-native";
import { authentication, db } from "../Firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import { collection, doc, setDoc } from "firebase/firestore/lite";

const LandingScreen = () => {
  const [yellowButtonColor, setYellowButtonColor] = useState("#ffc300");
  const [textColor, setTextColor] = useState("#ffc300");
  const [whiteButtonColor, setWhiteButtonColor] = useState("#fff");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [passwordsEqual, setPasswordsEqual] = useState(false);
  const navigation = useNavigation();
  const [role, setRole] = useState('driver');

  

  // function registerUser() {
  //   console.log("signing up this user");
  //   createUserWithEmailAndPassword(authentication, email, password)
  //     .then((res) => {
  //       console.log(res);
  //       navigation.navigate("signInScreen");
  //     })
  //     .catch((err) => {
  //       console.log(err, " is the error");
  //     });
  // }

  async function registerUser() {
    try {
      // create user with email and password
      const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
      console.log("User created ", userCredential.user.uid)
      // save user role to Firestore
      const user = userCredential.user;
      const userCollectionRef = collection(db, "users");
      const docRef = doc(userCollectionRef, user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        role: role,
        data: null,
      });

      //Take the user to the sign In screen when this process completes successfully
      navigation.navigate('signInScreen')
    } catch (error) {
      // handle error
      console.log(error);
      return null;
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#ffc300",
      }}
    >
      <ScrollView
        contentContainerStyle={[tw`bg-white  justify-between h-full `]}
      >
        <View style={tw`h-2/5 justify-center items-center`}>
          <Image
            style={[
              tw`mt-2 w-64 h-64 `,
            ]}
            source={{
              uri: "https://i.pinimg.com/564x/a2/a4/18/a2a418044caf5657364bc8f2dafb9fce.jpg",
            }}
          />
        </View>

        <View style={[tw`h-3/5 items-center`]}>
          <View
            style={[
              tw`justify-center items-center h-full`,
              {
                backgroundColor: "#fff",

                
              },
            ]}
          >
            <Text
              style={[
                tw`text-3xl mt-3 font-black`,
                {
                  color: "#000",
                },
              ]}
            >
              Create your account
            </Text>

            <Text
              style={[
                tw`p-1 mt-3`,
                {
                  color: "#000",
                  // padding: 5,
                  // marginTop: 8
                },
              ]}
            >
              Enter your details below
            </Text>
            <View style={tw`flex flex-row justify-evenly items-center`}>
            <Text style={tw`text-black text-base text-yellow-500 w-2/5`}>Select role</Text>
            <View style={tw` border-black border-2 h-12 w-2/5`}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
            >
              <Picker.Item label="Driver" value="driver" />
              <Picker.Item label="Mechanic" value="mechanic" />
            </Picker>
            </View>
          </View>
            <View style={tw`mt-4 w-80 `}>
              <TextInput
                editable
                style={tw`text-black text-base rounded-md h-12 px-4 border-2 border-black`}
                placeholder="email address"
                value={email}
                placeholderTextColor="#000"
                onChangeText={(text) => {
                  setEmail(text);
                  console.log(text);
                }}
              ></TextInput>
            </View>

            <View style={tw`mt-4 w-80`}>
              <TextInput
                editable
                style={tw`text-black text-base rounded-md h-12 px-4 border-2 border-black`}
                placeholder="password"
                placeholderTextColor="#000"
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text);
                  console.log(text);
                }}
              ></TextInput>
            </View>

            <View style={tw`mt-4 w-80 `}>
              <TextInput
                editable
                style={tw`text-black text-base rounded-md h-12 px-4 border-2 border-black`}
                placeholder="confirm password"
                placeholderTextColor="#000"
                secureTextEntry={true}
                onChangeText={(text) => {
                  if (password.length !== 0) {
                    text !== password
                      ? console.log(
                          "Password ",
                          text,
                          " not equal to ",
                          password
                        )
                      : setPasswordsEqual(true);
                  } else {
                    console.log("please type in password");
                  }
                }}
              />
            </View>

            <View style={tw`mt-4 w-80 flex-row justify-between`}>
              <Pressable
                style={[
                  tw`p-2 w-28  rounded-2xl justify-center items-center`,
                  {
                    backgroundColor: yellowButtonColor,
                  },
                ]}
                onPress={() => {
                  setYellowButtonColor("white");
                  setTimeout(() => {
                    setYellowButtonColor("#ffc300");
                  }, 50);

                  //Call the register user function

                  if (passwordsEqual) {
                    registerUser();
                  } else {
                    console.log("Your passwords do not match, try again");
                  }
                }}
              >
                <Text style={tw`text-white font-bold text-2xl`}>Sign up</Text>
              </Pressable>

              <Pressable
                style={[
                  tw` p-2 w-28 rounded-xl justify-center items-center border-2 border-black`,
                  {
                    backgroundColor: whiteButtonColor,
                    color: textColor,
                  },
                ]}
                onPress={() => {
                  setWhiteButtonColor("#ffc300");
                  setTextColor("#fff");
                  setTimeout(() => {
                    setTextColor("#ffc300");
                    setWhiteButtonColor("#fff");
                  }, 50);
                  navigation.navigate("signInScreen");
                }}
              >
                <Text style={tw`text-black font-bold text-xl`}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
