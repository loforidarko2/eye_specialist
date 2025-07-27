// screens/EducationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const allArticles = [
  {
    id: '1',
    title: 'Understanding Glaucoma',
    summary: 'Glaucoma can cause vision loss without symptoms. Learn how to spot it early.',
    category: 'diseases',
     content: `Glaucoma is a group of eye conditions that damage the optic nerve, essential for good vision. This damage is often caused by abnormally high pressure in the eye (intraocular pressure). It is one of the leading causes of blindness for people over the age of 60, but it can occur at any age.

Types of Glaucoma:
- Open-angle glaucoma: The most common type, progresses slowly without pain.
- Angle-closure glaucoma: A medical emergency with rapid onset and severe symptoms.
- Normal-tension glaucoma: Damage occurs even with normal eye pressure.

Symptoms:
Glaucoma often has no warning signs. Vision loss is so gradual that you may not notice until it’s at an advanced stage. Symptoms can include:
• Patchy blind spots
• Tunnel vision
• Eye pain and headaches (acute glaucoma)

Treatment:
There’s no cure, but treatment can slow or prevent vision loss:
• Prescription eye drops
• Oral medications
• Laser therapy or surgery

Prevention:
Regular eye exams are key to early detection and preserving vision.`
  },
  {
    id: '2',
    title: 'About Cataracts',
    summary: 'Cataracts make the lens cloudy. Symptoms include blurry vision and night blindness.',
    category: 'diseases',
     content: `Cataracts are the clouding of the eye's natural lens, leading to decreased vision. It develops slowly and affects people over 50, though it can occur at any age due to injury or medical conditions like diabetes.

Symptoms:
- Blurred, cloudy, or dim vision
- Sensitivity to light or glare
- Difficulty seeing at night
- Fading or yellowing of colors
- Double vision in one eye

Causes:
- Aging (most common)
- Injury to the eye
- Radiation exposure
- Genetics
- Certain medications

Treatment:
The only effective treatment is surgery, which replaces the cloudy lens with a clear artificial one. Cataract surgery is safe and widely performed with high success rates.`
  },
  {
    id: '3',
    title: 'Tips for Healthy Eyes',
    summary: 'Eat leafy greens, reduce screen time, wear sunglasses, and get regular exams.',
    category: 'prevention',
    content: `1. Eat Eye-Friendly Foods:
• Leafy Greens (e.g., spinach)
• Omega-3 rich fish (e.g., salmon)
• Citrus fruits and nuts

2. Protect Your Eyes:
• Wear UV-blocking sunglasses
• Use protective eyewear when needed

3. Reduce Screen Strain:
• Use the 20-20-20 rule: Every 20 mins, look 20 feet away for 20 secs

4. Stay Hydrated and Rested:
• Prevent dry eyes by drinking enough water and sleeping well

5. Get Regular Eye Exams:
• Detect issues like glaucoma early through routine checkups`
  },
  {
    id: '4',
    title: 'Nutrition for Eye Health',
    summary: 'Certain foods improve vision and prevent diseases. Learn what to include in your meals.',
    category: 'nutrition',
    content: `Key Nutrients:
- Lutein & Zeaxanthin: Found in leafy greens like kale and spinach
- Vitamin A: For night vision. Found in carrots and sweet potatoes
- Vitamin C & E: Antioxidants that protect eyes. Found in oranges and nuts
- Zinc: Supports retina. Found in legumes and meat
- Omega-3: Helps retina and prevents dry eyes. Found in fish

Hydration:
Drinking water helps maintain the moisture balance in your eyes.

Eating a balanced diet rich in these nutrients is essential for long-term eye health.`
  },
  {
    id: '5',
    title: 'Preventing Eye Diseases',
    summary: 'Regular checkups, healthy lifestyle, and protective measures can prevent many eye diseases.',
    category: 'prevention',
    content: `1. Regular Eye Exams:
Eye checkups every 1-2 years help detect silent conditions like glaucoma.

2. Manage Health Conditions:
Control diabetes and hypertension to avoid eye damage.

3. Wear Eye Protection:
Use goggles or glasses during sports or work to prevent injuries.

4. Avoid Smoking:
Smoking increases the risk of macular degeneration and cataracts.

5. Use Proper Lighting:
Avoid reading or working in dim light to prevent eye strain.

6. Practice Screen Safety:
Use blue-light filters, position screens properly, and blink often.

Taking small steps now can preserve your eyesight for years.`
  },
  {
    id: '6',
    title: 'Exercises for Healthy Eyes',
    summary: 'Simple eye exercises can reduce strain and improve focus. Try these at home.',
    category: 'exercises',
    content: `1. Eye Rolling:
Gently roll your eyes in circular motions. Do clockwise and then counter-clockwise.

2. Focus Shifting:
Hold a pen at arm's length and slowly bring it to your nose while focusing on it.

3. Palming:
Rub your hands to generate warmth and cover your closed eyes to relax.

4. Distance Gazing:
Look at distant objects every 20 minutes to relieve eye strain.

5. Blinking Exercise:
Blink rapidly for 10–15 seconds to moisten your eyes.

These exercises help reduce fatigue and keep your eye muscles active.`
  },
];

const categories = [
  { id: 'diseases', name: 'Diseases', icon: 'eye', color: '#FF6B6B' },
  { id: 'prevention', name: 'Prevention', icon: 'shield-alt', color: '#28C76F' },
  { id: 'nutrition', name: 'Nutrition', icon: 'apple-alt', color: '#007BFF' },
  { id: 'exercises', name: 'Exercises', icon: 'dumbbell', color: '#6F42C1' },
];

export default function EducationScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();

  const handleCategoryPress = (id) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
  };

  const filteredArticles = allArticles.filter((article) => {
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Eye Health Education</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search health topics..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionHeader}>Browse by Category</Text>
      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && { backgroundColor: category.color },
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <FontAwesome5
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? 'white' : category.color}
              style={{ marginBottom: 6 }}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && { color: 'white' },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Articles */}
      <Text style={styles.sectionHeader}>
        {selectedCategory ? `${selectedCategory[0].toUpperCase() + selectedCategory.slice(1)} Articles` : 'Recent Articles'}
      </Text>

      {filteredArticles.length === 0 ? (
        <Text style={{ padding: 10, color: '#666' }}>No articles found.</Text>
      ) : (
        filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => navigation.navigate('ArticleDetails', { article })}
          >
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleText}>{article.summary}</Text>
            <Text style={styles.readMore}>Read More</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.footer}>Eye Specialist v1.0.0</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a202c' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginVertical: 14, color: '#333' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#333' },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  articleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#1a1a1a' },
  articleText: { fontSize: 14, color: '#444', lineHeight: 20 },
  readMore: { marginTop: 8, color: '#007BFF', fontWeight: '600' },
  footer: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 12 },
});
