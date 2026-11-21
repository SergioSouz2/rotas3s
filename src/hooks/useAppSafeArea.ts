import { useMemo } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppSafeAreaOptions {
  top?: boolean;
  bottom?: boolean;
  horizontal?: boolean;
}

export function useAppSafeArea({
  top = true,
  bottom = true,
  horizontal = false,
}: AppSafeAreaOptions = {}) {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const isAndroid = Platform.OS === "android";
    const isIOS = Platform.OS === "ios";

    const paddingTop = top ? insets.top : 0;
    const paddingBottom = bottom ? insets.bottom : 0;
    const paddingLeft = horizontal ? insets.left : 0;
    const paddingRight = horizontal ? insets.right : 0;

    return {
      isAndroid,
      isIOS,

      insets,

      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,

      containerStyle: {
        flex: 1 as const,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
      },

      topStyle: {
        paddingTop,
      },

      bottomStyle: {
        paddingBottom,
      },
    };
  }, [insets, top, bottom, horizontal]);
}
