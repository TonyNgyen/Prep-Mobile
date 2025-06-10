import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { supabase } from '~/utils/supabase';

export default function Stats() {
  // const [facing, setFacing] = useState<CameraType>('back');
  // const [permission, requestPermission] = useCameraPermissions();
  // const cameraRef = useRef<CameraView>(null);
  // const [photoUri, setPhotoUri] = useState<string | null>(null);

  // if (!permission) {
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>We need your permission to show the camera</Text>
  //       <Button onPress={requestPermission} title="Grant Permission" />
  //     </View>
  //   );
  // }

  // async function takePhoto() {
  //   if (cameraRef.current) {
  //     const photo = await cameraRef.current.takePictureAsync();
  //     setPhotoUri(photo.uri);
  //   }
  // }

  // function toggleCameraFacing() {
  //   setFacing((current) => (current === 'back' ? 'front' : 'back'));
  // }

  // if (photoUri) {
  //   return (
  //     <View style={styles.container}>
  //       <Image source={{ uri: photoUri }} style={styles.preview} />
  //       <Button title="Take Another" onPress={() => setPhotoUri(null)} />
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
  //       <View style={styles.buttonContainer}>
  //         <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
  //           <Text style={styles.text}>Flip Camera</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.button} onPress={takePhoto}>
  //           <Text style={styles.text}>Take Photo</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </CameraView>
  //   </View>
  // );
  return (
    // <View>
    //   <Text>This is under development!</Text>
    // </View>
    <>
      <Stack.Screen options={{ title: 'Stats' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/stats.tsx" title="Stats" />
        <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-around',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
});
