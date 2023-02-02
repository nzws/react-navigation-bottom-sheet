import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import {
  BottomSheetScreenProps,
  createBottomSheetNavigator,
  useLayoutHandler,
} from '@th3rdwave/react-navigation-bottom-sheet';
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type BottomSheetParams = {
  Home: undefined;
  Sheet: { id: number };
  Sheet2: { id: number };
};

const BottomSheet = createBottomSheetNavigator<BottomSheetParams>();

function HomeScreen({
  navigation,
}: BottomSheetScreenProps<BottomSheetParams, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Open sheet"
        onPress={() => {
          navigation.navigate('Sheet', { id: 1 });
        }}
      />
      <Button
        title="Open detached sheet"
        onPress={() => {
          navigation.navigate('Sheet2', { id: 1 });
        }}
      />
    </View>
  );
}

function SheetScreen({
  route,
  navigation,
}: BottomSheetScreenProps<BottomSheetParams, 'Sheet'>) {
  const onLayout = useLayoutHandler();
  console.log(onLayout);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text>Sheet Screen {route.params.id}</Text>
      <Button
        title="Open new sheet"
        onPress={() => {
          navigation.navigate('Sheet', { id: route.params.id + 1 });
        }}
      />
      <Button
        title="Open new detached sheet"
        onPress={() => {
          navigation.navigate('Sheet2', { id: route.params.id + 1 });
        }}
      />
      <Button
        title="Close sheet"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Button
        title="Snap to top"
        onPress={() => {
          navigation.snapTo(1);
        }}
      />
    </View>
  );
}

export function SimpleExample() {
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  return (
    <NavigationContainer>
      <BottomSheet.Navigator
        screenOptions={{
          snapPoints: ['70%', '90%'],
          backdropComponent: renderBackdrop,
        }}
      >
        <BottomSheet.Screen name="Home" component={HomeScreen} />
        <BottomSheet.Screen
          name="Sheet"
          component={SheetScreen}
          getId={({ params }) => `sheet-${params.id}`}
        />
        <BottomSheet.Screen
          name="Sheet2"
          component={SheetScreen}
          getId={({ params }) => `sheet-${params.id}`}
          options={{
            snapPoints: undefined,
            detached: true,
            bottomInset: 28,
            style: {
              marginHorizontal: 14,
              borderRadius: 18,
              overflow: 'hidden',
            },
          }}
        />
      </BottomSheet.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
