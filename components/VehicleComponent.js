import {
    Text,
    View,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, {useEffect, useState} from "react";
  import tw from "tailwind-react-native-classnames";

  import { Icon } from "react-native-elements";

const VehicleComponent = ({data}) => {
  return (
      <View
          style={[
            tw`rounded-r-3xl flex shadow-md`,
            {
              backgroundColor: "#f3f3f3",
              height: 300,
              width: "80%",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 1px 2px -2px, rgba(0, 0, 0, 0.12) 0px 3px 6px 0px, rgba(0, 0, 0, 0.09) 0px 5px 12px 4px",
            },
          ]}
        >
          <View style={tw`flex flex-row justify-between items-center`}>
            <View style={tw`p-2`}>
              <Text style={tw`text-black text-xl`}>My Vehicle</Text>
              <Text
                style={[
                  tw`font-extrabold text-black `,
                  {
                    fontSize: 65,
                  },
                ]}
              >
                {data?.vehicleName}
              </Text>
            </View>

            {/* <View>
              <Icon
                style={[
                  tw`mr-4 rounded-full p-3 bg-yellow-400`
                ]}
                name={"edit"}
                type="material"
                color={"#000"}
                size={28}
              />
            </View> */}
          </View>
          {/* The vehicle image goes here */}
          <View style={tw`flex flex-row w-full justify-evenly items-end`}>
            <View style={{ width: "75%", }}>
              <Image
                style={{
                  height: 150,
                  width: 300,
                  resizeMode: "contain",
                  marginLeft: -110,
                }}
                source={{
                  uri: "https://freepngimg.com/thumb/audi/36659-1-audi-car-real.png",
                }}
              />
            </View>

            <View style={[tw`pr-4 flex flex-row`, { width: "45%"}]}>
              <View style={tw`flex flex-col justify-between`}>
              <View style={tw`flex flex-row justify-evenly`}>
              <Text style={tw`text-black text-base font-bold`}>
                {data?.vehicleHp}
              </Text>
              <Icon name='done-all' type='material' color='black'/>
              </View>
              <View style={tw`flex flex-row justify-evenly`}>
              <Text style={tw`text-black text-base font-bold`}>
                {data?.vehicleTorque}
              </Text>
              <Icon name='done-all' type='material' color='black'/>
              </View>
              <View style={tw`flex flex-row justify-evenly`}>
              <Text style={tw`text-black text-base font-bold`}>
                {data?.vehicleBrakeType}
              </Text>
              <Icon name='done-all' type='material' color='black'/>
              </View>
              <View style={tw`flex flex-row justify-evenly`}>
              <Text style={tw`text-black text-base font-bold`}>
                {`model-${data?.vehicleModel}`}
              </Text>
              <Icon name='done-all' type='material' color='black'/>
              </View>
              </View>
            </View>
          </View>
        </View>
  )
}

export default VehicleComponent