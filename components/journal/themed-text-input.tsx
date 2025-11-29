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
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor(
    { light: lightBorderColor, dark: darkBorderColor },
    'inputBorder'
  );

  return (
    <TextInput
      style={[
        styles.input,
        {
          color,
          backgroundColor,
          borderColor,
        },
        !editable && styles.readOnly,
        style,
      ]}
      editable={editable}
      placeholderTextColor={color + '80'} // Semi-transparent
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
