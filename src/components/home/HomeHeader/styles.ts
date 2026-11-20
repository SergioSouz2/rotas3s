import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#102f63",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    width: 200,
    height: 70,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    width: 200,
    height: 70,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 23,
    color: "#ffffff",
  },
});
