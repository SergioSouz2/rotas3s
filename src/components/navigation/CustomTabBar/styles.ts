import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
    paddingHorizontal: 8,
  },

  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 5,
  },

  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#64748b",
  },

  activeLabel: {
    fontWeight: "700",
    color: "#2563eb",
  },
});
