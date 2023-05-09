import { View, Text } from 'react-native'
import React from 'react'

const ProfileView = () => {
  return (
    <View>
        <View style={tw`mt-4 w-80 `}>
                <TextInput
                    editable
                    style={tw`text-yellow-800 text-base rounded-md h-12 px-4 border-2 border-yellow-800`}
                    placeholder="email address"
                    value={email}
                    placeholderTextColor="#ac610b"
                    onChangeText={(text) => {
                    setEmail(text);
                    console.log(text);
                    }}
                ></TextInput>
                </View>

                <View style={tw`mt-4 w-80`}>
                <TextInput
                    editable
                    style={tw`text-yellow-800 text-base rounded-md h-12 px-4 border-2 border-yellow-800`}
                    placeholder="password"
                    placeholderTextColor="#ac610b"
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
                    style={tw`text-yellow-800 text-base rounded-md h-12 px-4 border-2 border-yellow-800`}
                    placeholder="confirm password"
                    placeholderTextColor="#ac610b"
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
                ></TextInput>
                </View>
    </View>
  )
}

export default ProfileView