import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },

  primaryButton: {
    backgroundColor: "#15803d",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },

  secondaryRow: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
  },

  finishButton: {
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fff7f7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },

  finishButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#dc2626",
  },

  disabledButton: {
    opacity: 0.5,
  },

  disabledFinishButton: {
    opacity: 0.5,
  },
});
