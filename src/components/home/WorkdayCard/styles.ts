import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#166534",
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    flex: 1,
  },

  infoRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 5,
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: "#102f63",
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
