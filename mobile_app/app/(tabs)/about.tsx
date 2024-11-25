import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
//import Navbar from './Navbar'; // Assuming Navbar is converted to React Native

const developers = [
  {
    name: "Alejandro Pacheco",
    role: "Full Stack Developer",
    bio: "Some things about developer 1",
    img: require('../../assets/images/developer.png'),
    link: "https://www.linkedin.com/in/alex-pacheco-33299928a/",
  },
  {
    name: "Lee Rogers",
    role: "Full Stack Developer",
    bio: "Something about developer 2",
    img: require('../../assets/images/developer.png'),
    link: "https://www.linkedin.com/in/lee-rogers-computer-scientist/",
  },
  {
    name: "Madison Kolley",
    role: "Full Stack Developer",
    bio: "Something about developer 3",
    img: require('../../assets/images/madison.jpeg'),
    link: "https://www.linkedin.com/in/madison-kolley",
  },
  {
    name: "Shangchen Hsieh",
    role: "Full Stack Developer",
    bio: "This is our full-stack developer Sean! He is operated by coffee and tea. If you ever have a chance to meet him in person, buy him a coffee!",
    img: require('../../assets/images/sean_edited.jpg'),
    link: "https://sean-portfolio-git-main-shangchenhsiehs-projects.vercel.app/",
  },
  {
    name: "Tanisha Damle",
    role: "Full Stack Developer",
    bio: "Something about developer 5",
    img: require('../../assets/images/tanisha.jpg'),
    link: "https://www.linkedin.com/in/tanisha-damle",
  },
  {
    name: "Yossef Eini",
    role: "Full Stack Developer",
    bio: "Something about developer 6",
    img: require('../../assets/images/developer.png'),
    link: "https://www.linkedin.com/in/yossefeini/",
  },
];

const AboutUs = () => {
  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Why Choose Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Nimbus Cloud Banking?</Text>
          <Text style={styles.sectionDescription}>
            Nimbus Cloud Banking offers a seamless, secure, and modern approach to banking. With 24/7 accessibility,
            top-notch security features, and an intuitive user experience, we empower customers to take control of
            their financial future with ease.
          </Text>
        </View>

        {/* Meet the Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Our Developer</Text>
          <View style={styles.teamContainer}>
            {developers.map((developer, index) => (
              <TouchableOpacity
                key={index}
                style={styles.teamMember}
                onPress={() => Linking.openURL(developer.link)}
              >
                <Image source={developer.img} style={styles.teamImg} />
                <Text style={styles.teamName}>{developer.name}</Text>
                <Text style={styles.teamRole}>{developer.role}</Text>
                <Text style={styles.teamBio}>{developer.bio}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollView: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e508d',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  teamMember: {
    backgroundColor: '#1e508d',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '45%',
    alignItems: 'center',
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  teamImg: {
    width: 100,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  teamRole: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  teamBio: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AboutUs;
