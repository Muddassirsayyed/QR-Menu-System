// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FOOD_IMAGE_MAP: Record<string, string> = {
  // Starters
  "Paneer Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
  "Veg Spring Rolls": "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80",
  "Chicken 65": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80",
  "Dahi Puri": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "Mutton Seekh Kebab": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80",
  "Aloo Tikki Chaat": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "Fish Amritsari": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80",
  "Hara Bhara Kebab": "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80",
  "Prawn Koliwada": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Samosa (2 pcs)": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "Chicken Wings": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80",
  "Pav Bhaji": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "Soya Chaap Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
  "Lamb Chops": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&q=80",
  "Masala Papad": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",

  // Mains
  "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "Palak Paneer": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "Dal Makhani": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",
  "Rogan Josh": "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80",
  "Kadai Vegetables": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",
  "Chicken Korma": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Shahi Paneer": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80",
  "Mutton Keema Masala": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80",
  "Chole Bhature": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  "Fish Curry": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Rajma Chawal": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",
  "Chicken Vindaloo": "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80",
  "Mix Veg Kofte": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",
  "Prawn Masala": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Baingan Bharta": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80",

  // Biryani
  "Hyderabadi Chicken Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "Mutton Biryani": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "Veg Dum Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "Prawn Biryani": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "Egg Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "Paneer Biryani": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "Chicken Tikka Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "Lucknowi Dum Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "Jackfruit Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "Mushroom Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",

  // Chinese
  "Veg Hakka Noodles": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
  "Chicken Fried Rice": "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80",
  "Paneer Chilli (Dry)": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
  "Chicken Manchurian": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80",
  "Veg Dim Sum (6 pcs)": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
  "Hot & Sour Soup": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
  "Chicken Chow Mein": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80",
  "Prawn Fried Rice": "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80",
  "Baby Corn Mushroom": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
  "Chicken Lollipop (6 pcs)": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80",

  // Desserts
  "Gulab Jamun": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
  "Kulfi Falooda": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "Chocolate Brownie": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
  "Rasmalai": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
  "Phirni": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
  "Gajar Ka Halwa": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
  "Cheesecake Slice": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "Jalebi & Rabdi": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
  "Mango Panna Cotta": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",

  // Beverages
  "Mango Lassi": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Masala Chai": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
  "Cold Coffee": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80",
  "Fresh Lime Soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "Watermelon Juice": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
  "Chocolate Milkshake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Virgin Mojito": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "Rose Sharbat": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Green Apple Smoothie": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Filter Coffee": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80"
};

function getImageUrl(name: string, fallbackSlug: string): string {
  const lowerName = name.toLowerCase();
  
  if (FOOD_IMAGE_MAP[name]) {
    return FOOD_IMAGE_MAP[name];
  }
  
  if (lowerName.includes("paneer tikka") || lowerName.includes("soya chaap")) {
    return "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80";
  }
  if (lowerName.includes("spring roll")) {
    return "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&q=80";
  }
  if (lowerName.includes("65") || lowerName.includes("lollipop") || lowerName.includes("wings")) {
    return "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80";
  }
  if (lowerName.includes("puri") || lowerName.includes("chaat") || lowerName.includes("samosa") || lowerName.includes("papad")) {
    return "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80";
  }
  if (lowerName.includes("kebab") || lowerName.includes("chop")) {
    return "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80";
  }
  if (lowerName.includes("fish") || lowerName.includes("prawn") || lowerName.includes("shrimp") || lowerName.includes("seafood")) {
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80";
  }
  if (lowerName.includes("pav bhaji") || lowerName.includes("vada pav") || lowerName.includes("dosa")) {
    return "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80";
  }
  if (lowerName.includes("butter chicken") || lowerName.includes("korma") || lowerName.includes("curry") || lowerName.includes("gravy") || lowerName.includes("masala") || lowerName.includes("handi") || lowerName.includes("kadai") || lowerName.includes("keema") || lowerName.includes("chole") || lowerName.includes("rajma") || lowerName.includes("bharta") || lowerName.includes("kofte")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80";
  }
  if (lowerName.includes("biryani") || lowerName.includes("pulao") || lowerName.includes("rice")) {
    if (lowerName.includes("fried rice") || lowerName.includes("pot rice")) {
      return "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80";
    }
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80";
  }
  if (lowerName.includes("noodle") || lowerName.includes("chow mein") || lowerName.includes("chopsuey")) {
    return "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80";
  }
  if (lowerName.includes("dim sum") || lowerName.includes("dumpling") || lowerName.includes("momo")) {
    return "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80";
  }
  if (lowerName.includes("soup")) {
    return "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80";
  }
  if (lowerName.includes("jamun") || lowerName.includes("rasmalai") || lowerName.includes("phirni") || lowerName.includes("halwa") || lowerName.includes("jalebi") || lowerName.includes("kulfi")) {
    return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80";
  }
  if (lowerName.includes("brownie") || lowerName.includes("cake") || lowerName.includes("tiramisu") || lowerName.includes("waffle") || lowerName.includes("panna cotta") || lowerName.includes("pudding")) {
    return "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80";
  }
  if (lowerName.includes("lassi") || lowerName.includes("shake") || lowerName.includes("smoothie") || lowerName.includes("milkshake")) {
    return "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80";
  }
  if (lowerName.includes("soda") || lowerName.includes("juice") || lowerName.includes("mojito") || lowerName.includes("sharbat")) {
    return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80";
  }
  if (lowerName.includes("chai") || lowerName.includes("tea") || lowerName.includes("coffee")) {
    return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80";
  }
  
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";
}

const menuData = {
  starters: [
    { name: "Paneer Tikka", desc: "Soft cottage cheese marinated in spiced yogurt, grilled in tandoor", price: 280, isVeg: true },
    { name: "Veg Spring Rolls", desc: "Crispy rolls stuffed with seasonal vegetables and noodles", price: 180, isVeg: true },
    { name: "Chicken 65", desc: "Deep fried chicken in a fiery red sauce with curry leaves", price: 320, isVeg: false },
    { name: "Dahi Puri", desc: "Crispy puris filled with potatoes, chutneys and cool yogurt", price: 150, isVeg: true },
    { name: "Mutton Seekh Kebab", desc: "Minced mutton with spices grilled on skewers", price: 380, isVeg: false },
    { name: "Aloo Tikki Chaat", desc: "Crispy potato patties with chutneys, yogurt and pomegranate", price: 160, isVeg: true },
    { name: "Fish Amritsari", desc: "Batter-fried fish with carom seeds and chaat masala", price: 350, isVeg: false },
    { name: "Hara Bhara Kebab", desc: "Spinach, peas and potato patties with mint chutney", price: 200, isVeg: true },
    { name: "Prawn Koliwada", desc: "Marinated prawns fried in spiced gram flour batter", price: 420, isVeg: false },
    { name: "Samosa (2 pcs)", desc: "Golden fried pastry filled with spiced potatoes and peas", price: 120, isVeg: true },
    { name: "Chicken Wings", desc: "Spicy glazed chicken wings with blue cheese dip", price: 340, isVeg: false },
    { name: "Pav Bhaji", desc: "Spiced mashed vegetables with butter-toasted pav buns", price: 190, isVeg: true },
    { name: "Soya Chaap Tikka", desc: "Soya chaap marinated in yogurt and spices, tandoor-grilled", price: 240, isVeg: true },
    { name: "Lamb Chops", desc: "Tender lamb chops marinated with aromatic spices and herbs", price: 580, isVeg: false },
    { name: "Masala Papad", desc: "Crispy papad topped with onions, tomatoes and green chutney", price: 80, isVeg: true },
  ],
  mains: [
    { name: "Butter Chicken", desc: "Tender chicken in rich, creamy tomato-based sauce", price: 380, isVeg: false },
    { name: "Palak Paneer", desc: "Fresh cottage cheese in smooth spinach gravy", price: 300, isVeg: true },
    { name: "Dal Makhani", desc: "Black lentils slow-cooked overnight with butter and cream", price: 280, isVeg: true },
    { name: "Rogan Josh", desc: "Slow-cooked Kashmiri lamb with whole spices and saffron", price: 480, isVeg: false },
    { name: "Kadai Vegetables", desc: "Mixed vegetables cooked in kadai masala with capsicum", price: 260, isVeg: true },
    { name: "Chicken Korma", desc: "Chicken in rich cashew and cream sauce with aromatic spices", price: 360, isVeg: false },
    { name: "Shahi Paneer", desc: "Paneer cubes in rich tomato and cashew-based cream gravy", price: 320, isVeg: true },
    { name: "Mutton Keema Masala", desc: "Minced mutton cooked with onions, tomatoes and spices", price: 420, isVeg: false },
    { name: "Chole Bhature", desc: "Spiced chickpeas with deep-fried puffy bhature", price: 200, isVeg: true },
    { name: "Fish Curry", desc: "Fresh fish cooked in coastal style coconut and tamarind gravy", price: 400, isVeg: false },
    { name: "Rajma Chawal", desc: "Red kidney beans curry served with steamed basmati rice", price: 220, isVeg: true },
    { name: "Chicken Vindaloo", desc: "Fiery Goan-style chicken curry with vinegar and chillies", price: 380, isVeg: false },
    { name: "Mix Veg Kofte", desc: "Vegetable dumplings in onion-tomato-cashew gravy", price: 290, isVeg: true },
    { name: "Prawn Masala", desc: "Juicy prawns in thick onion and tomato masala", price: 480, isVeg: false },
    { name: "Baingan Bharta", desc: "Roasted eggplant mashed with spices, onion and tomatoes", price: 240, isVeg: true },
  ],
  biryani: [
    { name: "Hyderabadi Chicken Biryani", desc: "Aromatic basmati rice layered with spiced chicken, slow-cooked dum-style", price: 380, isVeg: false },
    { name: "Mutton Biryani", desc: "Tender mutton pieces with fragrant basmati and whole spices", price: 450, isVeg: false },
    { name: "Veg Dum Biryani", desc: "Mixed vegetables and paneer layered with saffron-infused rice", price: 280, isVeg: true },
    { name: "Prawn Biryani", desc: "Succulent prawns cooked with coconut milk and basmati rice", price: 480, isVeg: false },
    { name: "Egg Biryani", desc: "Spiced biryani with masala-coated boiled eggs", price: 300, isVeg: false },
    { name: "Paneer Biryani", desc: "Marinated paneer cubes layered with jeera rice and saffron", price: 320, isVeg: true },
    { name: "Chicken Tikka Biryani", desc: "Tandoor-grilled chicken tikka pieces with aromatic dum biryani", price: 420, isVeg: false },
    { name: "Lucknowi Dum Biryani", desc: "Delicate Awadhi-style chicken biryani with light spices", price: 400, isVeg: false },
    { name: "Jackfruit Biryani", desc: "Tender young jackfruit cooked in biryani spices, vegan-friendly", price: 290, isVeg: true },
    { name: "Mushroom Biryani", desc: "Button mushrooms sautéed with spices layered with basmati rice", price: 270, isVeg: true },
  ],
  chinese: [
    { name: "Veg Hakka Noodles", desc: "Stir-fried noodles with vegetables in Indo-Chinese sauces", price: 220, isVeg: true },
    { name: "Chicken Fried Rice", desc: "Wok-tossed rice with chicken, eggs and vegetables", price: 260, isVeg: false },
    { name: "Paneer Chilli (Dry)", desc: "Crispy paneer tossed in spicy sauce with bell peppers", price: 280, isVeg: true },
    { name: "Chicken Manchurian", desc: "Crispy chicken balls in tangy manchurian gravy", price: 300, isVeg: false },
    { name: "Veg Dim Sum (6 pcs)", desc: "Steamed dumplings filled with vegetables and tofu", price: 240, isVeg: true },
    { name: "Hot & Sour Soup", desc: "Tangy and spicy clear soup with vegetables and vinegar", price: 160, isVeg: true },
    { name: "Chicken Chow Mein", desc: "Crispy pan-fried noodles with chicken and vegetables", price: 280, isVeg: false },
    { name: "Prawn Fried Rice", desc: "Wok-fried basmati with juicy prawns and spring onions", price: 340, isVeg: false },
    { name: "Baby Corn Mushroom", desc: "Baby corn and mushrooms in spicy black bean sauce", price: 250, isVeg: true },
    { name: "Chicken Lollipop (6 pcs)", desc: "Crispy drumettes in fiery red chilli sauce", price: 320, isVeg: false },
  ],
  desserts: [
    { name: "Gulab Jamun", desc: "Soft milk-solid dumplings soaked in rose-cardamom syrup", price: 120, isVeg: true },
    { name: "Kulfi Falooda", desc: "Traditional pistachio kulfi with rose falooda and basil seeds", price: 180, isVeg: true },
    { name: "Chocolate Brownie", desc: "Warm fudgy brownie with vanilla ice cream and hot fudge", price: 220, isVeg: true },
    { name: "Rasmalai", desc: "Soft paneer patties in chilled thickened milk with cardamom", price: 150, isVeg: true },
    { name: "Phirni", desc: "Creamy rice pudding with saffron and nuts, served chilled", price: 140, isVeg: true },
    { name: "Tiramisu", desc: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone", price: 280, isVeg: true },
    { name: "Gajar Ka Halwa", desc: "Slow-cooked carrot pudding with ghee, milk and dry fruits", price: 160, isVeg: true },
    { name: "Cheesecake Slice", desc: "New York-style baked cheesecake with berry compote", price: 260, isVeg: true },
    { name: "Jalebi & Rabdi", desc: "Crispy spirals soaked in syrup with thickened saffron milk", price: 140, isVeg: true },
    { name: "Mango Panna Cotta", desc: "Set cream dessert with fresh Alphonso mango puree", price: 240, isVeg: true },
  ],
  beverages: [
    { name: "Mango Lassi", desc: "Thick yogurt drink blended with Alphonso mango pulp", price: 120, isVeg: true },
    { name: "Masala Chai", desc: "Spiced Indian tea with ginger, cardamom and lemongrass", price: 60, isVeg: true },
    { name: "Cold Coffee", desc: "Chilled coffee blended with ice cream and topped with cream", price: 160, isVeg: true },
    { name: "Fresh Lime Soda", desc: "Chilled lime juice with soda, choice of sweet or salty", price: 80, isVeg: true },
    { name: "Watermelon Juice", desc: "Fresh seasonal watermelon juice with mint and black salt", price: 100, isVeg: true },
    { name: "Chocolate Milkshake", desc: "Rich dark chocolate blended with chilled milk and ice cream", price: 180, isVeg: true },
    { name: "Virgin Mojito", desc: "Refreshing mint, lime and soda with a hint of sugar", price: 140, isVeg: true },
    { name: "Rose Sharbat", desc: "Chilled rose syrup with chilled milk, basil seeds and ice", price: 120, isVeg: true },
    { name: "Green Apple Smoothie", desc: "Fresh green apple blended with yogurt, honey and ginger", price: 160, isVeg: true },
    { name: "Filter Coffee", desc: "South Indian decoction coffee with frothy hot milk", price: 80, isVeg: true },
  ],
};

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@menuqr.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@menuqr.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "spice-garden" },
    update: {},
    create: {
      name: "Spice Garden Restaurant",
      slug: "spice-garden",
      description: "Authentic Indian & Asian cuisine with a modern twist. Fresh ingredients, bold flavors.",
      address: "12, MG Road, Bandra West, Mumbai 400050",
      phone: "+91 98765 43210",
      email: "hello@spicegarden.com",
      logoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80",
      coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
      isActive: true,
    },
  });
  console.log("✅ Restaurant created:", restaurant.name);

  // Category config
  const categoryConfig = [
    { name: "Starters", slug: "starters", icon: "🥗", sortOrder: 1 },
    { name: "Main Course", slug: "mains", icon: "🍛", sortOrder: 2 },
    { name: "Biryani", slug: "biryani", icon: "🍚", sortOrder: 3 },
    { name: "Chinese", slug: "chinese", icon: "🥢", sortOrder: 4 },
    { name: "Desserts", slug: "desserts", icon: "🍮", sortOrder: 5 },
    { name: "Beverages", slug: "beverages", icon: "🥤", sortOrder: 6 },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoryConfig) {
    const category = await prisma.category.upsert({
      where: {
        restaurantId_slug: {
          restaurantId: restaurant.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        restaurantId: restaurant.id,
      },
    });
    categoryMap[cat.slug] = category.id;
  }
  console.log("✅ Categories created");

  // Seed all menu items
  let totalItems = 0;
  const entries = Object.entries(menuData) as [keyof typeof menuData, typeof menuData.starters][];

  for (const [slug, items] of entries) {
    const catId = categoryMap[slug];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.desc,
          price: item.price,
          imageUrl: getImageUrl(item.name, slug),
          isVeg: item.isVeg,
          isAvailable: true,
          isFeatured: i < 3,
          categoryId: catId,
        },
      });
      totalItems++;
    }
  }
  console.log(`✅ ${totalItems} menu items created`);

  // Create QR code placeholder
  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/menu/${restaurant.slug}`;
  await prisma.qRCode.create({
    data: {
      restaurantId: restaurant.id,
      qrDataUrl: "",
      menuUrl,
      totalScans: 0,
    },
  });
  console.log("✅ QR code entry created");

  // Seed sample scan logs for analytics
  const devices = ["mobile", "desktop", "tablet"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const oses = ["Android", "iOS", "Windows", "macOS"];
  const countries = ["India", "United States", "United Kingdom", "Singapore", "UAE"];
  const cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai"];

  const now = new Date();
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const scanDate = new Date(now.getTime() - daysAgo * 86400000);
    await prisma.scanLog.create({
      data: {
        restaurantId: restaurant.id,
        visitorId: `visitor-${Math.random().toString(36).substr(2, 9)}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        deviceType: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: oses[Math.floor(Math.random() * oses.length)],
        referrer: Math.random() > 0.5 ? "qr-scan" : null,
        scannedAt: scanDate,
      },
    });
  }
  console.log("✅ 150 sample scan logs created");

  // Update QR total scans
  await prisma.qRCode.updateMany({
    where: { restaurantId: restaurant.id },
    data: { totalScans: 150 },
  });

  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Admin login: admin@menuqr.com");
  console.log("🔑 Password:    admin123");
  console.log(`🍽️  Menu URL:    /menu/spice-garden`);
  console.log("📊 Dashboard:   /dashboard");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
