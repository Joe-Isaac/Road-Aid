import {
    Text,
    View,
    Image,
    TouchableOpacity,
  } from "react-native";


import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import React, {useState, useEffect} from "react";



const ServicesCard = ({data}) => {
  const [statusColor, setStatusColor] = useState({
    pending: '#faad14',
    inProgress: '#1677ff',
    completed: '#52c41a',
    rejected: '#f5222d'
  });
  
  useEffect(()=>{
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
}, [])

const [currentStatusColor, setCurrentStatusColor] = useState();


  return (
      <View
            style={[
              tw`bg-white rounded-3xl mx-2 my-3 shadow-md`,
              {
                backgroundColor: "#f3f3f3",
              },
            ]}
          >
            <View
              style={[
                tw` w-full flex flex-row items-center justify-evenly rounded-3xl h-28`,
                {
                  // backgroundColor: "#444451",
                },
              ]}
            >
              <View>
                <Image
                  style={{
                    height: 55,
                    width: 60,
                    resizeMode: "contain",
                    borderRadius: 100,
                  }}
                  source={{
                    uri: "https://cdn.pixabay.com/photo/2018/01/16/15/49/house-3086212_1280.jpg",
                  }}
                />
              </View>
              <View>
                <Text style={tw`text-black text-2xl `}>
                  {data?.provider}
                </Text>
                <Text style={tw`text-black font-bold text-base `}>
                  {`${data?.dateRequested} | ${data?.timeRequested}`}
                </Text>
              </View>
              {/* <View>
                <Icon name={"more-vert"} type={"material"} color="#854d0e" />
              </View> */}
            </View>

            {
              data?.description &&
              <View style={tw`w-full mb-3 flex justify-center items-center`}>
              <Text style={tw`font-bold text-base`}>Issue Description</Text>
              <Text style={tw`px-2`}>{data?.description}</Text>
              </View>
            }

            {
              data?.mechanicRemarks &&
              <View style={tw`w-full mb-3 flex justify-center items-center`}>
              <Text style={tw`font-bold text-base`}>Mechanic Remarks</Text>
              <Text style={tw`px-2`}>{data?.mechanicRemarks}</Text>
              </View>
            }

            <View style={tw`flex flex-row items-center justify-evenly mb-3`}>
              <View
                style={[
                  tw` flex flex-row items-center justify-evenly h-12`,
                  { width: "60%" },
                ]}
              >
                {/* FlexBox tricks here */}
                <View style={tw`flex flex-col`}>
                  <Text style={tw`text-black font-bold text-sm `}>{data?.requestData?.name}</Text>
                </View>
                <View style={tw`flex flex-col`}>
                  <Text style={tw`text-black font-bold text-sm `}>{data?.requestData?.price}</Text>
                </View>
              </View>

              <View>
                {/* Icon here */}
                <TouchableOpacity style={[tw`flex flex-row items-center h-12 rounded-full w-32 justify-center px-2`, {
                  backgroundColor: currentStatusColor
                }]}>
                  <Text style={tw`text-white text-xl font-bold`}>{data?.status}</Text>
                  
                </TouchableOpacity>
              </View>
            </View>
      </View>
  )
}

export default ServicesCard