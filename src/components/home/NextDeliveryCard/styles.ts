import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    gap: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexShrink: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#102f63",
  },

  statusBadge: {
    backgroundColor: "#fff7ed",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#c2410c",
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  companyIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },

  companyInfo: {
    flex: 1,
    gap: 4,
  },

  companyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  address: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
  },

  routeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#102f63",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  routeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
});
