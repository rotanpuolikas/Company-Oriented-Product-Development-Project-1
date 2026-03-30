import { colours } from "./Colours.js"

import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  kuukausiTeksti: {
    marginTop: 30,
    fontSize: 20,
  },
  etusivu: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hCenter: {
    flex: 1,
    alignItems: "center",
  },
  vCenter: {
    flex: 1,
    justifyContent: "center",
  },
  arrowsFrontpage: {
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    bottom: 40,
  },
  buttonFrontpage: {
    backgroundColor: colours.button,
    padding: 15,
    borderRadius: 50,
    width: '35%',
    alignSelf: 'center',
    height: '10%',
    alignItems: "center",
    justifyContent: 'center',
  },

  popup: {
    backgroundColor: colours.background,
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  popupOverlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colours.textPrimary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colours.card,
    color: colours.blackText,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colours.borderColour,
  },
  button: {
    backgroundColor: colours.button,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colours.blackText,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colours.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  flag: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: colours.imgBorder, 
  },
  countryName: {
    fontSize: 16,
    color: colours.textPrimary,
  },
  error: {
    color: colours.error,
    padding: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colours.blackText,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: colours.textSecondary,
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: colours.primary,
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: colours.button,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  mapButtonText: {
    color: colours.whiteText,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: colours.button,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
    devButton: {
    backgroundColor: colours.button,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: colours.blackText,
    fontSize: 16,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: colours.textSecondary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  ratingStars: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 5,
  },
  ratingStarsClickable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-start",
    position: "absolute",
    left: 0,
    right: 0,
    top: 10, // half of ratingbox padding
  },
  ratingBox: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colours.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colours.borderColour,
  },
  countryMiddlePart: {
    paddingTop: 15,
    justifyContent: "center",
  },
})
