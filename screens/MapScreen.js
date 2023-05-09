import { View, Text } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import Map from '../components/Map'
import { createStackNavigator } from '@react-navigation/stack'

const MapScreen = () => {
  const stack = createStackNavigator();
  return (
    <View>

      <View style={tw`h-1/2`}>
          <Map/>
      </View>
      
    </View>
  )
}

export default MapScreen