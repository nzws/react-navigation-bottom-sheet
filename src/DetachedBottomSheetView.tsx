import {
  BottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import type { ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { LayoutHandlerContext } from './LayoutHandlerContext';
import type { BottomSheetNavigationProp } from './types';

type BottomSheetModalScreenProps = BottomSheetModalProps & {
  navigation: BottomSheetNavigationProp<ParamListBase>;
};

const initialDetachedSnapPoints = ['CONTENT_HEIGHT'];

export function DetachedBottomSheetModalScreen({
  navigation,
  index,
  children,
  detached,
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

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialDetachedSnapPoints);

  const detachedOptions = detached
    ? {
        handleHeight: animatedHandleHeight,
        snapPoints: animatedSnapPoints,
        contentHeight: animatedContentHeight,
      }
    : {};

  return (
    <BottomSheetModal
      ref={ref}
      index={index}
      onChange={onChange}
      onDismiss={onDismiss}
      detached={detached}
      {...props}
      {...detachedOptions}
    >
      <LayoutHandlerContext.Provider value={handleContentLayout}>
        {children}
      </LayoutHandlerContext.Provider>
    </BottomSheetModal>
  );
}
