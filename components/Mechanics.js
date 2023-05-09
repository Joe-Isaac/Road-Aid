import { View, Text } from 'react-native'
import React from 'react'
import { Icon, Image } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

const Mechanics = ({index, data}) => {

    useEffect(()=>{
        console.log("\n\n\n\n\nMech data ", data)
    }, [])
    

  return (
    <TouchableOpacity
    onPress={()=>{}}
    style={tw`flex justify-center items-center bg-gray-50 px-2 shadow-sm rounded-lg`}>
        {/* Contents: Image, Name, Category of service, Rating, range of pricing */}
        <View style={tw`py-1`}>
            <Image
            source={{uri:data.item?.data?.imageUrl || "https://cdn.pixabay.com/photo/2014/07/31/23/37/motorbike-407186_1280.jpg"}}
            style={{
                width: 150,
                height: 110,
            }}
            />
        </View>
        <View style={tw` flex justify-center items-center`}>
            <Text style={tw`text-sm px-1 bg-yellow-100 rounded-sm font-bold`}>{data.item?.role}</Text>
        </View>
        <View>
            <Text style={tw`text-sm font-bold`}>{data.item?.data?.name}</Text>
        </View>
        <View style={tw`flex-row justify-center items-center py-1`}>
            <Icon name="star" type='material' size={12} color={'yellow'}/>
            <Text style={tw`text-sm px-1`}>4.9 (1.2k reviews)</Text>
        </View>
        <View style={tw`flex flex-row justify-center items-center`}>
            <Icon name='money' type='font-awesome' size={15} color={"gray"}/>
            <Text style={tw`text-sm px-1`}>{data.item?.data?.priceRange}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default Mechanics