import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { authentication, db } from "../Firebase/firebase-config";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { setIsUserSignedIn } from "../slices/navSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { collection, doc, getDoc } from "firebase/firestore/lite";

export default function SignInScreen() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loginColor, setLoginColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#ac610b");
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth()
    const subsribe = onAuthStateChanged(auth, (user) => {
      if(user){
        navigateUserByRole();
      }
      else{
        console.log("User not logged in")
      }
    })

    subsribe();

  }, []);

  async function navigateUserByRole () {
    const auth = getAuth();

    const docRef = doc(db, "users", auth?.currentUser?.uid);
    const data = await getDoc(docRef);
      if (data) {
        const userInfo = data.data();

        if (userInfo.role === "driver") {
          navigation.navigate("HomeScreen");
        } else if (userInfo.role == "mechanic") {
          navigation.navigate("MechanicScreen");
        } else {
          console.log("Theres been an error with the user role ", userInfo.role);
        }
      } else {
        console.log("There was an error getting data");
      }
  }

  async function signIn() {
    try {
    const res = await signInWithEmailAndPassword(
      authentication,
      emailAddress,
      password
    );
      navigateUserByRole();
    } catch (err) {
      console.log(err, " error while fetching ");
    }
  }

  return (
    <SafeAreaView
      style={[
        tw`flex-1 items-center justify-center`,
        {
          backgroundColor: "#ffc300",
        },
      ]}
    >
      <View style={tw`p-8 w-full max-w-sm`}>
        <Text style={tw`text-4xl font-extrabold mb-6 text-black`}>Login</Text>

        <TextInput
          style={tw`w-full bg-white rounded-md h-12 px-4 mb-4`}
          placeholderTextColor="#000"
          placeholder="Enter email address"
          value={emailAddress}
          onChangeText={(text) => setEmailAddress(text)}
        />

        <TextInput
          style={tw`w-full bg-white rounded-md h-12 px-4 mb-6`}
          placeholderTextColor="#000"
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          style={[
            tw`h-12 border-2 border-white rounded-3xl flex flex-row justify-center items-center px-6`,
            {
              backgroundColor: loginColor,
            },
          ]}
          onPress={() => {
            if (emailAddress !== 0 && password.length !== 0) {
              setTextColor("#fff");
              signIn();
            } else {
              console.log("Cannot submit empty fields");
              setTextColor("#fff");
            }
          }}
        >
          <View style={tw`flex-1 flex items-center`}>
            <Text
              style={[
                tw`text-base font-bold text-2xl`,
                {
                  color: "#000",
                },
              ]}
            >
              Login
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
