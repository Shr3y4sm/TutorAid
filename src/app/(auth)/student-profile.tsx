import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import supabase from "@/config/supabase";

import {
  searchTeacher,
  registerStudent,
  TeacherLookupResponse,
} from "@/api/auth";

export default function StudentProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const [teacher, setTeacher] =
    useState<TeacherLookupResponse | null>(null);

  const [loading, setLoading] = useState(false);

  async function verifyTeacher() {
    if (!teacherCode.trim()) {
      Alert.alert("Enter Teacher Code");
      return;
    }

    try {
      setLoading(true);

      const data = await searchTeacher(
        teacherCode.trim().toUpperCase()
      );

      setTeacher(data);
    } catch {
      setTeacher(null);

      Alert.alert(
        "Teacher not found",
        "Please check the Teacher Code."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createStudent() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Please login again.");
      return;
    }

    if (!teacher) {
      Alert.alert(
        "Please verify your teacher first."
      );
      return;
    }

    try {
      setLoading(true);

      await registerStudent({
        auth_user_id: user.id,
        full_name: fullName,
        email: user.email ?? "",
        phone,
        class: studentClass,
        parent_name: parentName,
        parent_phone: parentPhone,
        teacher_code: teacher.teacher_code,
      });

      router.replace("/(student)/home");
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Unable to register student."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Complete Student Profile
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Class / Grade"
        value={studentClass}
        onChangeText={setStudentClass}
      />

      <TextInput
        style={styles.input}
        placeholder="Parent Name"
        value={parentName}
        onChangeText={setParentName}
      />

      <TextInput
        style={styles.input}
        placeholder="Parent Phone"
        value={parentPhone}
        onChangeText={setParentPhone}
      />

      <Text style={styles.section}>
        Teacher Code
      </Text>

      <TextInput
        style={styles.input}
        placeholder="TA-XXXXXX"
        autoCapitalize="characters"
        value={teacherCode}
        onChangeText={setTeacherCode}
      />

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={verifyTeacher}
      >
        <Text style={styles.buttonText}>
          Verify Teacher
        </Text>
      </TouchableOpacity>

      {teacher && (
        <View style={styles.teacherCard}>
          <Text style={styles.verified}>
            ✓ Verified Teacher
          </Text>

          <Text style={styles.teacherName}>
            {teacher.full_name}
          </Text>

          <Text style={styles.teacherInfo}>
            {teacher.subjects}
          </Text>

          <Text style={styles.teacherInfo}>
            {teacher.organization}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={createStudent}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            Continue
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  verifyButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  continueButton: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },

  teacherCard: {
    backgroundColor: "#ECFDF5",
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  verified: {
    color: "#15803D",
    fontWeight: "700",
    marginBottom: 8,
  },

  teacherName: {
    fontSize: 18,
    fontWeight: "700",
  },

  teacherInfo: {
    marginTop: 4,
    color: "#374151",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});