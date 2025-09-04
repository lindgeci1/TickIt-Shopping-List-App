import { Image, Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Logo from '../assets/Welcome_Screen.png';
import TickIcon from '../assets/tick_it.png'; // small icon next to title

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    Alert.alert("Welcome!", "You pressed Get Started!");
  };

  return (
    <View style={styles.container}>
      {/* Big Logo */}
      <Image 
        source={Logo} 
        style={styles.logo} 
        resizeMode="contain"
      />

      {/* Title with small tick icon */}
        <View style={styles.titleContainer}>
        <Text style={styles.title}>TickIt</Text>
        <Image source={TickIcon} style={styles.tickIcon} resizeMode="contain" />
        </View>

      {/* Subtitle */}
        <Text style={styles.subtitle}>
        Manage all your ticks in one place
        </Text>


      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // white background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 320,
    height: 320, // bigger logo
    marginBottom: 40, // space below logo
  },
  titleContainer: {
    flexDirection: 'row', // icon next to text
    alignItems: 'center',
    marginBottom: 15, // space below title
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000', // TickIt in black
  },
tickIcon: {
  width: 40,
  height: 40,
  marginLeft: 10,            // space between text and icon
  borderWidth: 2,            // border thickness
  borderColor: '#6c63ff',    // same as Get Started button
  borderRadius: 20,          // make it fully rounded
  padding: 5,                // optional: space inside border
},
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 90, // space before button
  },
  button: {
    backgroundColor: '#6c63ff', // theme color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
