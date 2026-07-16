import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Colors from "@/theme/colors";
import { updateAssignment } from "@/api/teacherAssignments";

export default function EditAssignmentScreen() {
  const params = useLocalSearchParams();

  const [title, setTitle] = useState(
    String(params.title ?? "")
  );

  const [subject, setSubject] = useState(
    String(params.subject ?? "")
  );

  const [description, setDescription] = useState(
    String(params.description ?? "")
  );

  const [dueDate, setDueDate] = useState(
    String(params.due_date ?? "")
  );

  const [maxMarks, setMaxMarks] = useState(
    String(params.max_marks ?? "")
  );

  async function save() {
  try {
    await updateAssignment(
      String(params.id),
      {
        teacher_id: String(params.teacher_id),

        title,

        subject,

        description,

        due_date: dueDate,

        max_marks: Number(maxMarks),

        students: [],
      }
    );

    Alert.alert(
      "Success",
      "Assignment updated."
    );

    router.replace("/(teacher)/assignments");

  } catch (err) {
    console.log(err);

    Alert.alert(
      "Error",
      "Unable to update assignment."
    );
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Assignment
      </Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />

      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject"
      />

      <TextInput
        style={[styles.input,{height:120}]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />

      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="YYYY-MM-DD"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={maxMarks}
        onChangeText={setMaxMarks}
        placeholder="Max Marks"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={save}
      >
        <Text style={styles.buttonText}>
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.background,
    padding:20,
  },

  title:{
    fontSize:28,
    fontWeight:"700",
    marginBottom:24,
  },

  input:{
    backgroundColor:"#FFF",
    borderRadius:12,
    padding:14,
    marginBottom:16,
    borderWidth:1,
    borderColor:"#E5E7EB",
  },

  button:{
    backgroundColor:Colors.primary,
    padding:16,
    borderRadius:12,
    alignItems:"center",
    marginTop:10,
  },

  buttonText:{
    color:"#FFF",
    fontWeight:"700",
    fontSize:16,
  },
});