import {
  Button,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { ToDoListData } from "@/data/todos";

export default function Index() {
  const styles = Styles();

  const { width } = Dimensions.get("window");
  const TabletSize = width >= 760;

  const Container =
    Platform.OS === "android" || "ios" ? SafeAreaView : ScrollView;
  return (
    <Container
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlatList
        style={[styles.FlatlistMobile, TabletSize && styles.FlatlistBigScreen]}
        data={ToDoListData}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.Header}>
            <TextInput style={styles.AddToDoText} />
            <Pressable
              style={({ pressed }) => [
                styles.AddBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text>Add</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.listFooter}> End of list</Text>
        }
        ItemSeparatorComponent={<View style={styles.Separator} />}
        renderItem={({ item }) => (
          <View style={styles.MainList}>
            <View style={styles.ListItem}>
              <Text>{item.title}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.DeleteBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <FontAwesome5 name="trash" size={15} color="black" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </Container>
  );
}

const Styles = () => {
  return StyleSheet.create({
    FlatlistMobile: {
      width: "100%",
    },
    FlatlistBigScreen: {
      width: "20rem",
    },
    Header: {
      flexDirection: "row",
      gap: 7,
      padding: 6,
    },
    HeaderButton: {
      flex: "1",
      color: "red",
    },
    MainList: {
      flex: 1,
      paddingHorizontal: 8,
    },
    ListItem: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },
    btnPressed: {
      opacity: 0.6,
    },
    AddBtn: {
      padding: 8,
      backgroundColor: "white",
      borderRadius: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    DeleteBtn: {
      padding: 10,
      backgroundColor: "red",
      borderRadius: "100%",
    },
    Separator: {
      height: 1,
      width: "100%",
      marginHorizontal: "auto",
      backgroundColor: "black",
    },
    listFooter: {
      width: "100%",
      textAlign: "center",
      alignContent: "center",
      height: 20,
      backgroundColor: "#858282",
    },
    AddToDoText: {
      flexGrow: 1,
      borderWidth: 1,
      backgroundColor: "white",
    },
  });
};
