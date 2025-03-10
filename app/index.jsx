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
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import Octicons from "@expo/vector-icons/Octicons";

import Animated, { LinearTransition } from "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  const styles = Styles(theme, colorScheme);
  const [loaded, error] = useFonts({ Inter_500Medium });

  const { width } = Dimensions.get("window");
  const TabletSize = width >= 760;

  const Container =
    Platform.OS === "android" || "ios" ? SafeAreaView : ScrollView;

  const AddToDo = () => {
    if (text.trim()) {
      const newId = toDo.length > 0 ? toDo[0].id + 1 : 1;

      setToDo([{ id: newId, title: text, completed: false }, ...toDo]);

      setText("");
    }
  };

  const toggleTodo = (id) => {
    setToDo(
      toDo.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const removeToDo = (id) => {
    setToDo(toDo.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageToDos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageToDos && storageToDos.length > 0) {
          setToDo(storageToDos.sort((a, b) => b.id - a.id));
        } else {
          setToDo(ToDoListData.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [ToDoListData]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(toDo);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (error) {
        console.log(error);
      }
    };

    storeData();
  }, [toDo]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Container style={styles.container}>
      <Animated.FlatList
        style={[styles.FlatlistMobile, TabletSize && styles.FlatlistBigScreen]}
        data={toDo}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.Header}>
            <TextInput
              value={text}
              style={styles.AddToDoText}
              onChangeText={(value) => setText(value)}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                style={({ pressed }) => [
                  styles.AddBtn,
                  pressed && styles.btnPressed,
                ]}
                onPress={() => AddToDo()}
              >
                <Text style={styles.AddBtnText}>Add</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  setColorScheme(colorScheme === "light" ? "dark" : "light")
                }
                style={{ marginLeft: 10 }}
              >
                <Octicons
                  name={colorScheme === "dark" ? "moon" : "sun"}
                  size={36}
                  color={theme.text}
                  selectable={undefined}
                  style={{ width: 36 }}
                />
              </Pressable>
            </View>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.listFooter}> End of list</Text>
        }
        ItemSeparatorComponent={<View style={styles.Separator} />}
        renderItem={({ item }) => (
          <View style={styles.MainList}>
            <View style={styles.ListItem}>
              <Text
                style={[
                  styles.toDoText,
                  item.completed && styles.completedText,
                ]}
                onPress={() => toggleTodo(item.id)}
              >
                {item.title}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.DeleteBtn,
                  pressed && styles.btnPressed,
                ]}
                onPress={() => removeToDo(item.id)}
              >
                <FontAwesome5 name="trash" size={15} color="black" />
              </Pressable>
            </View>
          </View>
        )}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </Container>
  );
}

const Styles = (theme, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    FlatlistMobile: {
      width: "100%",
      marginHorizontal: "auto",
    },
    FlatlistBigScreen: {
      width: "25rem",
      marginHorizontal: "auto",
    },
    Header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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

      backgroundColor: theme.button,
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
    AddBtnText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
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
      backgroundColor: theme.text,
    },
    listFooter: {
      width: "100%",
      textAlign: "center",
      alignContent: "center",
      height: 20,
      backgroundColor: "#858282",
    },
    AddToDoText: {
      flex: 1,
      borderWidth: 1,
      backgroundColor: theme.background,
      padding: 5,
      fontFamily: "Inter_500Medium",
      color: theme.text,
      borderColor: theme.text,
    },

    toDoText: {
      fontSize: 18,
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      opacity: 0.5,
    },
  });
};
