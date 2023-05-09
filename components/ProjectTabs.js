import React from 'react';
import { View, Text } from 'react-native';
import { TabView } from 'react-native-elements';


const Tabs = () => {
    
}


const tabs = [
    {
        title: "tab 1",
        render: ()=>(
            
        )
    }
]

const Tabs = () => (
  <TabView data={tabs} initialDataIndex={0} onChange={()=>console.log("Changed")}/>
);
<ScrollView horizontal>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            title={tab.title}
            active={index === activeTab}
            onPress={() => handleTabPress(index)}
          />
        ))}
      </ScrollView>

export default Tabs;
