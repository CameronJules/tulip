import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  // Darker background for inputs
  const backgroundColor = '#F5F5F5';

  // Focus border color: #6F56FF at 30% opacity
  const focusBorderColor = '#6F56FF4D';

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <TextInput
      style={[
        styles.input,
        {
          color,
          backgroundColor,
          borderColor: isFocused ? focusBorderColor : 'transparent',
        },
        !editable && styles.readOnly,
        style,
      ]}
      editable={editable}
      placeholderTextColor={color + '80'} // Semi-transparent
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  readOnly: {
    opacity: 0.6,
  },
});
