import { Note } from "@/types/note";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NoteScreen() {
  const [note, setNote] = useState<Note | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    loadNote();
  }, []);

  const loadNote = async () => {
    const saved = await AsyncStorage.getItem("notes");
    if (!saved) return;

    const list: Note[] = JSON.parse(saved);
    const found = list.find((n) => n.id === id) || null;

    setNote(found);
  };

  const updateText = async (text: string) => {
    if (!note) return;

    const updated: Note = { ...note, text };
    setNote(updated);

    const saved = await AsyncStorage.getItem("notes");
    if (!saved) return;

    const list: Note[] = JSON.parse(saved);
    const newList = list.map((n) => (n.id === note.id ? updated : n));

    await AsyncStorage.setItem("notes", JSON.stringify(newList));
  };

  if (!note) return null;
  
  return (
    <View style={styles.container}>
      <TextInput
        multiline
        autoFocus
        value={note.text}
        onChangeText={updateText}
        style={styles.input}
        placeholder="Начните писать..."
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    lineHeight: 26,
  },
});
