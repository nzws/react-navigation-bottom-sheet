import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { ParamListBase, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { DetachedBottomSheetModalScreen } from './DetachedBottomSheetView';
import type {
  BottomSheetDescriptorMap,
  BottomSheetNavigationConfig,
  BottomSheetNavigationHelpers,
  BottomSheetNavigationProp,
  BottomSheetNavigationState,
} from './types';

type BottomSheetModalScreenProps = BottomSheetModalProps & {
  navigation: BottomSheetNavigationProp<ParamListBase>;
};

function BottomSheetModalScreen({
  navigation,
  index,
  ...props
}: BottomSheetModalScreenProps) {
  const ref = React.useRef<BottomSheetModal>(null);
  const lastIndexRef = React.useRef(index);

  // Present on mount.
  React.useEffect(() => {
    ref.current?.present();
  }, []);

  const isMounted = React.useRef(true);
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (index != null && lastIndexRef.current !== index) {
      ref.current?.snapToIndex(index);
    }
  }, [index]);

  const onChange = React.useCallback(
    (newIndex: number) => {
      lastIndexRef.current = newIndex;
      if (newIndex >= 0) {
        navigation.snapTo(newIndex);
      }
    },
    [navigation],
  );

  const onDismiss = React.useCallback(() => {
    // BottomSheetModal will call onDismiss on unmount, be we do not want that since
    // we already popped the screen.
    if (isMounted.current) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <BottomSheetModal
      ref={ref}
      index={index}
      onChange={onChange}
      onDismiss={onDismiss}
      {...props}
    />
  );
}

const DEFAULT_SNAP_POINTS = ['66%'];

type Props = BottomSheetNavigationConfig & {
  state: BottomSheetNavigationState<ParamListBase>;
  navigation: BottomSheetNavigationHelpers;
  descriptors: BottomSheetDescriptorMap;
};

export function BottomSheetView({ state, descriptors }: Props) {
  const { colors } = useTheme();
  const themeBackgroundStyle = React.useMemo(
    () => ({
      backgroundColor: colors.card,
    }),
    [colors.card],
  );
  const themeHandleIndicatorStyle = React.useMemo(
    () => ({
      backgroundColor: colors.border,
    }),
    [colors.border],
  );

  // Avoid rendering provider if we only have one screen.
  const shouldRenderProvider = React.useRef(false);
  shouldRenderProvider.current =
    shouldRenderProvider.current || state.routes.length > 1;

  const firstScreen = descriptors[state.routes[0].key];
  return (
    <>
      {firstScreen.render()}
      {shouldRenderProvider.current && (
        <BottomSheetModalProvider>
          {state.routes.slice(1).map((route) => {
            const { options, navigation, render } = descriptors[route.key];

            const {
              index,
              backgroundStyle,
              handleIndicatorStyle,
              snapPoints = DEFAULT_SNAP_POINTS,
              ...sheetProps
            } = options;

            const Component = options.detached
              ? DetachedBottomSheetModalScreen
              : BottomSheetModalScreen;

            return (
              <Component
                key={route.key}
                // Make sure index is in range, it could be out if snapToIndex is persisted
                // and snapPoints is changed.
                index={Math.min(
                  route.snapToIndex ?? index ?? 0,
                  snapPoints.length - 1,
                )}
                snapPoints={snapPoints}
                navigation={navigation}
                backgroundStyle={[themeBackgroundStyle, backgroundStyle]}
                handleIndicatorStyle={[
                  themeHandleIndicatorStyle,
                  handleIndicatorStyle,
                ]}
                {...sheetProps}
              >
                {render()}
              </Component>
            );
          })}
        </BottomSheetModalProvider>
      )}
    </>
  );
}
