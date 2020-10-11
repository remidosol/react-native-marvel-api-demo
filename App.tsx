import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AppearanceProvider } from "react-native-appearance"
import AnimatedSplash from 'react-native-animated-splash-screen'

import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper"


import { Main } from "./src/main"
import { Dimensions } from "react-native"

export default function App() {

  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    // return () => {
    //   setIsLoaded(false)
    // }
  }, [])

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isLoaded}
      logoImage={require('./assets/marvelll.png')}
      backgroundColor={'#f0141e'}
      logoHeight={Dimensions.get('window').height - 50}
      logoWidth={Dimensions.get('window').width - 50}
    >
    <Provider>
      <SafeAreaProvider>
        <AppearanceProvider>
          <Main />
        </AppearanceProvider>
      </SafeAreaProvider>
    </Provider>
    </AnimatedSplash>
  )
}