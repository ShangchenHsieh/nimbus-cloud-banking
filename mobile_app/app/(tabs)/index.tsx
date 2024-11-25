import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LandingPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Navbar placeholder */}
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>Nimbus</Text>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text style={styles.heading}>Next-gen banking solutions</Text>
          <Text style={styles.subHeading}>
            Welcome to Nimbus Online Banking Services
          </Text>
        </View>

        {/* Banner Section */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Free</Text>
          <Text style={styles.bannerBigText}>$100</Text>
          <Text style={styles.bannerSmallText}>
            When you create a new checking account with us. For new customers
            only.
          </Text>
          <Text style={styles.terms}>Terms and conditions apply</Text>
        </View>

        {/* Why Nimbus Section */}
        <View style={styles.why}>
          <View style={styles.whyLeft}>
            <Text style={styles.whyTitle}>Why Nimbus?</Text>
          </View>
          <View style={styles.whyRight}>
            {[
              'No fees to start any account',
              'Top-notch security',
              '24/7 simple access to our services for your convenience',
              'Create an account in under 15 minutes',
              'Start with any amount - even a dollar',
              'Mobile app to keep in touch better',
              'Access to over 15,000 ATMs without any fees',
              'Track and budget your money with behavior insights',
            ].map((item, index) => (
              <Text key={index} style={styles.whyItem}>
                - {item}
              </Text>
            ))}
          </View>
        </View>

        {/* Checking Account Banner */}
        <View style={styles.checkingBanner}>
          <Image
            source={{ uri: 'https://i.imgur.com/8Z11JsI.png' }}
            style={styles.checkingImage}
          />
          <Text style={styles.checkingTitle}>Our Checking Account</Text>
          {/* Features Section */}
          <View style={styles.features}>
            {[
              {
                uri: 'https://i.imgur.com/sgSxqso.png',
                text: 'Send and receive money instantly',
              },
              {
                uri: 'https://i.imgur.com/i5DCwBU.png',
                text: 'No chase fees at ATMs',
              },
              {
                uri: 'https://i.imgur.com/A0Zd9kn.png',
                text: 'No minimum deposit',
              },
              {
                uri: 'https://i.imgur.com/ABpLB7X.png',
                text: 'Autopay for recurring purchases',
              },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Image source={{ uri: feature.uri }} style={styles.featureImage} />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  navbar: {
    padding: 16,
    backgroundColor: '#0099cc',
  },
  navbarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subHeading: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  banner: {
    backgroundColor: '#7bc5db',
    padding: 20,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerBigText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  bannerSmallText: {
    fontSize: 16,
    textAlign: 'center',
  },
  terms: {
    fontSize: 12,
    marginTop: 5,
  },
  why: {
    flexDirection: 'row',
    backgroundColor: '#4063d9',
    padding: 20,
  },
  whyLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  whyRight: {
    flex: 2,
    paddingLeft: 20,
  },
  whyItem: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  checkingBanner: {
    backgroundColor: '#7bc5db',
    padding: 20,
    alignItems: 'center',
  },
  checkingImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  checkingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  featureItem: {
    alignItems: 'center',
    margin: 10,
  },
  featureImage: {
    width: 80,
    height: 80,
  },
  featureText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LandingPage;
