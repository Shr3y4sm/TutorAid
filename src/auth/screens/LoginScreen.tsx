import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    // Backend authentication will be added later

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.logo}>
          TutorAid
        </Text>

        <Text style={styles.subtitle}>
          Learn Anywhere. Teach Everywhere.
        </Text>

      </View>

      <View style={styles.form}>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#FFF"/>
          ) : (
            <Text style={styles.buttonText}>
              Login
            </Text>
          )}
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container:{

    flex:1,

    backgroundColor:"#F8FAFC",

    justifyContent:"center",

    paddingHorizontal:24

  },

  header:{

    marginBottom:50,

    alignItems:"center"

  },

  logo:{

    fontSize:40,

    fontWeight:"700",

    color:"#2563EB"

  },

  subtitle:{

    marginTop:10,

    fontSize:16,

    color:"#64748B"

  },

  form:{

    gap:18

  },

  input:{

    backgroundColor:"#FFF",

    borderRadius:14,

    paddingHorizontal:18,

    height:58,

    fontSize:16,

    borderWidth:1,

    borderColor:"#E5E7EB"

  },

  button:{

    height:58,

    backgroundColor:"#2563EB",

    borderRadius:14,

    justifyContent:"center",

    alignItems:"center",

    marginTop:15

  },

  buttonText:{

    color:"#FFF",

    fontSize:18,

    fontWeight:"600"

  }

});