import { colours } from "./Colours.js"

import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    backgroundColor: colours.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colours.borderColour,
  },
  button: {
    backgroundColor: colours.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colours.whiteText,
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: colours.error,
    padding: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.textPrimary,
    marginBottom: 5,
  },
})
