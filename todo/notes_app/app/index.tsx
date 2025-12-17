import { Note } from "@/types/note";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const saved = await AsyncStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  };

  const createNote = async () => {
    const id = Date.now().toString();
    const newNote: Note = {
      id,
      text: "",
      createdAt: Date.now(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    await AsyncStorage.setItem("notes", JSON.stringify(updated));

    router.push(`/note/${id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={(item) => (
          <Link href={`/note/${item.item.id}`} style={styles.noteItem}>
            <Text numberOfLines={1} style={styles.noteText}>
              {item.item.text || "Новая заметка"}
            </Text>
          </Link>
        )}
      />

      <TouchableOpacity onPress={createNote} style={styles.addBtn}>
        <Entypo name="add-to-list" size={24} color="black" style={styles.addBtnText}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  noteItem: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  noteText: { fontSize: 16 },

  addBtn: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  addBtnText: { color: "#fff", fontSize: 32, lineHeight: 32 },
});
