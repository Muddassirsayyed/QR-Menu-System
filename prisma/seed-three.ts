// prisma/seed-three.ts
// Run: npx tsx prisma/seed-three.ts

import { PrismaClient } from "@prisma/client";
import { generateQRCode } from "../lib/qrcode";

const prisma = new PrismaClient();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── RESTAURANT 1: FAMILY ───────────────────────────────────────────────────
const FAMILY = {
  name: "Spice Villa Family Restaurant",
  slug: "spice-villa",
  description: "Authentic Indian flavors — Biryani, Gravies, Fast Food & more for the whole family.",
  address: "12, MG Road, Bandra West, Mumbai 400050",
  phone: "+91 98765 43210",
  email: "hello@spicevilla.com",
  logoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  categories: [
    {
      name: "Cheese Specials", slug: "cheese", icon: "🧀", sortOrder: 1,
      items: [
        { name: "Classic Cheese Burger", description: "Juicy beef patty topped with melted cheddar, lettuce, tomato and special sauce in a toasted bun", price: 179, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        { name: "Double Cheese Burger", description: "Double beef patty loaded with two slices of cheddar cheese, pickles, mustard and ketchup", price: 229, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
        { name: "Veg Cheese Burger", description: "Crispy veg patty with processed cheese slice, fresh lettuce and tangy mayo sauce", price: 149, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
        { name: "Cheese Grilled Sandwich", description: "Golden grilled sandwich loaded with cheese, vegetables and green chutney on multigrain bread", price: 129, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80" },
        { name: "Cheese Margherita Pizza", description: "Classic Italian pizza with rich tomato base, generous mozzarella and fresh basil on thin crust", price: 249, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
        { name: "Four Cheese Pizza", description: "Indulgent pizza topped with mozzarella, cheddar, parmesan and gouda cheese blend", price: 349, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
        { name: "Cheese Garlic Bread", description: "Crispy toasted baguette slices smothered with garlic butter and melted mozzarella cheese", price: 99, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1619531040576-f9416740661c?w=400&q=80" },
        { name: "Mac and Cheese", description: "Classic creamy macaroni tossed in velvety four-cheese sauce with a golden breadcrumb topping", price: 189, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=400&q=80" },
        { name: "Cheese Loaded Fries", description: "Crispy golden fries drenched in warm nacho cheese sauce topped with jalapeños and spring onions", price: 149, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
        { name: "Paneer Cheese Pizza", description: "Tandoori paneer on a cheesy pizza base with bell peppers, onions and extra mozzarella", price: 299, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
      ]
    },
    {
      name: "Main Course", slug: "gravy", icon: "🍛", sortOrder: 2,
      items: [
        { name: "Butter Chicken", description: "Tender chicken in a rich, velvety tomato-butter sauce with aromatic spices and fresh cream", price: 299, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
        { name: "Chicken Handi", description: "Slow-cooked chicken in a traditional clay pot with onion-tomato masala and whole spices", price: 319, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
        { name: "Chicken Kadai", description: "Stir-fried chicken with freshly ground kadai masala, tomatoes and crunchy bell peppers", price: 309, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
        { name: "Paneer Butter Masala", description: "Soft paneer cubes in a luxurious tomato-cashew-butter sauce with cardamom and cream", price: 279, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        { name: "Dal Makhani", description: "Black lentils slow-cooked overnight with butter, cream, tomatoes and a blend of aromatic spices", price: 229, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80" },
        { name: "Chicken Korma", description: "Mild Mughlai-style chicken in a rich cashew-almond-yogurt gravy with rose water and saffron", price: 329, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
        { name: "Shahi Paneer", description: "Royal paneer dish in a silky cashew-cream-tomato gravy with saffron and whole spices", price: 289, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80" },
        { name: "Palak Paneer", description: "Velvety pureed spinach gravy with fresh paneer cubes, garlic, ginger and mild spices", price: 259, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80" },
        { name: "Chole Masala", description: "Punjabi-style spiced chickpeas cooked with onion-tomato masala, tea and whole spices", price: 219, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        { name: "Mutton Keema", description: "Minced mutton cooked with green peas, onions, tomatoes and freshly ground garam masala", price: 349, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
      ]
    },
    {
      name: "Biryani", slug: "biryani", icon: "🍚", sortOrder: 3,
      items: [
        { name: "Chicken Dum Biryani", description: "Fragrant basmati rice layered with spiced chicken, caramelized onions and saffron, slow-cooked dum-style", price: 299, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
        { name: "Mutton Biryani", description: "Tender mutton pieces and aged basmati rice cooked together with whole spices and rose water", price: 369, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
        { name: "Veg Dum Biryani", description: "Mixed seasonal vegetables with saffron-infused basmati rice sealed and cooked on slow flame", price: 249, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
        { name: "Hyderabadi Chicken Biryani", description: "Authentic Hyderabadi biryani with kacchi marinated chicken, fried onions and mint leaves", price: 329, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
        { name: "Paneer Biryani", description: "Marinated paneer cubes with fragrant rice, whole spices, fried onions and fresh coriander", price: 279, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
        { name: "Egg Biryani", description: "Spiced basmati biryani with masala-coated boiled eggs, caramelized onions and fresh mint", price: 249, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
        { name: "Chicken Tikka Biryani", description: "Tandoor-smoked chicken tikka layered in aromatic basmati with saffron milk and golden onions", price: 349, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
        { name: "Prawn Biryani", description: "Juicy marinated prawns cooked with coastal spices and basmati rice, served with raita", price: 399, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
        { name: "Mushroom Biryani", description: "Button mushrooms and aromatic basmati with biryani spices, mint, coriander and fried onions", price: 259, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
        { name: "Lucknowi Biryani", description: "Delicate Awadhi-style chicken biryani with subtle spices, kevra water and long-grain basmati", price: 339, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
      ]
    },
    {
      name: "Fast Food", slug: "fast-food", icon: "🌮", sortOrder: 4,
      items: [
        { name: "Veg Pav Bhaji", description: "Mumbai's iconic spiced vegetable mash served with buttery toasted pav buns and fresh onions", price: 119, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
        { name: "Masala Dosa", description: "Crispy golden dosa filled with spiced potato masala, served with sambar and coconut chutney", price: 129, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        { name: "Chicken Tikka Roll", description: "Tandoor-grilled chicken tikka wrapped in a flaky rumali roti with onions and mint chutney", price: 169, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
        { name: "Vada Pav", description: "Mumbai street food staple — spiced potato vada in a soft pav with dry garlic and green chutney", price: 59, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
        { name: "Chole Bhature", description: "Fluffy deep-fried bhature with spiced Punjabi chole, pickle and sliced onions on the side", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        { name: "Egg Frankie", description: "Spiced egg bhurji wrapped in a layered paratha roll with onions, chutney and masala", price: 99, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
        { name: "Aloo Tikki Chaat", description: "Crispy potato patties topped with chutneys, yogurt, pomegranate seeds and sev", price: 99, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
        { name: "Chicken Burger", description: "Crispy fried chicken patty with mayo, shredded lettuce and pickles in a toasted sesame bun", price: 149, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        { name: "Samosa Chaat", description: "Crushed crispy samosas with chickpeas, yogurt, tamarind chutney and fresh coriander", price: 89, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        { name: "Paneer Tikka Roll", description: "Smoky paneer tikka pieces wrapped in soft paratha with pickled onions and green chutney", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
      ]
    },
  ]
};

// ─── RESTAURANT 2: CHINESE ───────────────────────────────────────────────────
const CHINESE = {
  name: "Dragon Wok Chinese Restaurant",
  slug: "dragon-wok",
  description: "Authentic Indo-Chinese cuisine — Noodles, Fried Rice, Starters & Gravies.",
  address: "Shop 5, Linking Road, Bandra, Mumbai 400050",
  phone: "+91 98765 00001",
  email: "hello@dragonwok.com",
  logoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&q=80",
  categories: [
    {
      name: "Noodles & Chowmein", slug: "noodles-chowmein", icon: "🍜", sortOrder: 1,
      items: [
        { name: "Veg Hakka Noodles", description: "Wok-tossed noodles with crunchy seasonal vegetables in Indo-Chinese soy and chilli sauces", price: 189, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Veg Schezwan Noodles", description: "Spicy Schezwan-tossed noodles with vegetables in fiery red chilli sauce", price: 199, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        { name: "Veg Garlic Noodles", description: "Noodles stir-fried with roasted garlic, spring onions and sesame in light soy sauce", price: 189, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Veg Chili Garlic Noodles", description: "Bold chili-garlic flavored noodles with crispy vegetables and a hint of vinegar", price: 199, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        { name: "Veg American Chopsuey", description: "Crispy fried noodle nest topped with sweet and sour vegetable sauce and egg", price: 229, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Egg Hakka Noodles", description: "Hakka noodles stir-fried with eggs, vegetables and seasoned with soy sauce", price: 209, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        { name: "Chicken Hakka Noodles", description: "Classic Hakka noodles with tender chicken strips, vegetables and soy-chilli sauce", price: 229, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Chicken Schezwan Noodles", description: "Fiery Schezwan noodles with juicy chicken, spring onions and roasted garlic", price: 239, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        { name: "Chicken Chili Garlic Noodles", description: "Loaded with chicken, chili and garlic in a spicy wok-tossed noodle base", price: 239, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Mix Hakka Noodles", description: "Best of both worlds — chicken and vegetables tossed in classic Hakka style", price: 249, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        { name: "Chicken American Chopsuey", description: "Crispy noodle nest with chicken in a tangy sweet-sour sauce, topped with fried egg", price: 259, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Veg Pan Fried Noodles", description: "Flat-pan fried noodles with crispy edges, tossed with vegetables in dark soy", price: 219, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
      ]
    },
    {
      name: "Fried Rice", slug: "fried-rice", icon: "🍚", sortOrder: 2,
      items: [
        { name: "Veg Fried Rice", description: "Light fluffy rice stir-fried with fresh vegetables and seasoned with soy and sesame oil", price: 179, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Veg Schezwan Fried Rice", description: "Spicy Schezwan fried rice loaded with vegetables in fiery red chilli sauce", price: 189, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Veg Burnt Garlic Fried Rice", description: "Aromatic fried rice with crispy burnt garlic, vegetables and light soy seasoning", price: 199, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Veg Mushroom Fried Rice", description: "Earthy button mushrooms stir-fried with rice, garlic and spring onions", price: 199, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Egg Fried Rice", description: "Fluffy wok-fried rice with scrambled eggs, spring onions and soy sauce", price: 199, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Chicken Fried Rice", description: "Smoky wok-tossed rice with tender chicken, eggs, spring onions and soy sauce", price: 219, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Chicken Schezwan Fried Rice", description: "Fiery Schezwan fried rice with chicken and roasted garlic in hot chilli sauce", price: 229, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Chicken Tikka Fried Rice", description: "Tandoor-smoked chicken tikka tossed with aromatic fried rice and spring onions", price: 249, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Mix Fried Rice", description: "Chicken and vegetables together in a perfectly seasoned wok-tossed fried rice", price: 239, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Veg Pot Rice", description: "Vegetables and rice cooked together in a clay pot with light Chinese seasoning", price: 229, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
      ]
    },
    {
      name: "Starters & Dry", slug: "starters-dry", icon: "🥡", sortOrder: 3,
      items: [
        { name: "Veg Manchurian Dry", description: "Crispy fried veggie balls tossed in a tangy manchurian sauce with spring onions", price: 189, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Paneer Chili Dry", description: "Crispy paneer cubes tossed in a spicy tangy sauce with bell peppers and spring onions", price: 229, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Honey Chili Potato", description: "Crispy potato strips tossed in sweet honey chili sauce with sesame seeds", price: 179, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
        { name: "Mushroom Chili Dry", description: "Sautéed mushrooms tossed in spicy chili-garlic sauce with capsicum", price: 199, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Veg Spring Roll", description: "Crispy golden rolls stuffed with stir-fried vegetables, served with dipping sauce", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
        { name: "Chicken Lollipop", description: "Juicy chicken drumettes in a fiery red chilli sauce, deep fried and garnished with spring onions", price: 279, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Chili Dry", description: "Crispy chicken tossed in a bold chili sauce with onions and capsicum", price: 249, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Manchurian Dry", description: "Deep-fried chicken balls tossed in a glossy manchurian sauce with garlic and ginger", price: 249, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken 65", description: "Deep fried chicken in a fiery red sauce with curry leaves and mustard seeds", price: 259, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Schezwan Lollipop", description: "Schezwan-glazed chicken lollipops with a spicy kick and crispy coating", price: 299, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Spring Roll", description: "Crispy rolls stuffed with spiced chicken and vegetables, served with sweet chilli sauce", price: 199, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
      ]
    },
    {
      name: "Gravy & Combos", slug: "gravy-combos", icon: "🥘", sortOrder: 4,
      items: [
        { name: "Veg Manchurian Gravy", description: "Crispy veg balls simmered in a thick, tangy indo-chinese gravy with garlic sauce", price: 209, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Paneer Chili Gravy", description: "Paneer in a rich, spicy chili-garlic gravy with bell peppers and onions", price: 249, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Veg Schezwan Gravy", description: "Mixed vegetables in a bold, spicy Schezwan sauce with garlic and dried chilies", price: 219, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Veg Triple Schezwan Rice", description: "Schezwan fried rice with Schezwan veg gravy and crispy veg starter — all in one", price: 299, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Chicken Chili Gravy", description: "Chicken in a hot and tangy chili-garlic gravy, perfect with fried rice", price: 269, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Manchurian Gravy", description: "Tender chicken balls in a classic glossy manchurian gravy with ginger and garlic", price: 269, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Hot Garlic Gravy", description: "Chicken in an intensely flavored hot garlic sauce — bold, spicy and addictive", price: 279, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
        { name: "Chicken Triple Schezwan Rice", description: "Schezwan fried rice with chicken Schezwan gravy and chicken starter — a full meal", price: 349, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Veg Sherpa Rice", description: "Steamed rice topped with mixed vegetable gravy in a light ginger-soy broth", price: 249, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
        { name: "Chicken Sherpa Rice", description: "Steamed rice topped with chicken in a light, aromatic Chinese-style gravy", price: 279, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
      ]
    },
  ]
};

// ─── RESTAURANT 3: CAFE ───────────────────────────────────────────────────────
const CAFE = {
  name: "Brew & Bites Cafe",
  slug: "brew-bites-cafe",
  description: "Your cozy neighborhood cafe — Shakes, Juices, Sandwiches, Coffee & Desserts.",
  address: "22, Hill Road, Bandra, Mumbai 400050",
  phone: "+91 98765 11111",
  email: "hello@brewbites.com",
  logoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80",
  coverUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
  categories: [
    {
      name: "Shawarma", slug: "shawarma", icon: "🌯", sortOrder: 1,
      items: [
        { name: "Classic Chicken Shawarma", description: "Tender marinated chicken strips with garlic sauce, pickled veggies rolled in fresh Arabic bread", price: 149, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
        { name: "Special Shawarma", description: "Chef's special shawarma loaded with chicken, extra garlic sauce, cheese and crispy fries inside", price: 179, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1590816465124-8c99c9c41462?w=400&q=80" },
        { name: "Mexican Shawarma", description: "Spicy Mexican-style shawarma with chicken, jalapeños, salsa, sour cream and cheddar cheese", price: 189, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80" },
        { name: "Paneer Shawarma", description: "Smoky grilled paneer with tahini, pickles, garlic sauce and crisp veggies in soft pita bread", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80" },
        { name: "Mutton Shawarma", description: "Slow-roasted tender mutton slices with tahini, hummus, tomatoes in fresh Arabic pita bread", price: 229, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1530469525856-cf37954301f7?w=400&q=80" },
        { name: "Cheese Shawarma", description: "Classic chicken shawarma with extra melted cheese, garlic mayo and crispy pickled cucumbers", price: 189, isVeg: false, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1590816465124-8c99c9c41462?w=400&q=80" },
        { name: "Falafel Shawarma", description: "Crispy fried falafel with hummus, tahini, fresh salad and pickles in warm pita bread", price: 149, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80" },
        { name: "BBQ Shawarma", description: "BBQ-glazed chicken shawarma with coleslaw, smoky sauce and crispy fried onions in pita", price: 209, isVeg: false, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
      ]
    },
    {
      name: "Fresh Juices", slug: "juices", icon: "🧃", sortOrder: 2,
      items: [
        { name: "Fresh Mango Juice", description: "Chilled freshly extracted Alphonso mango juice with a hint of black salt and cardamom", price: 99, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
        { name: "Watermelon Juice", description: "Refreshing cold-pressed watermelon juice with mint leaves and a squeeze of lime", price: 79, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Fresh Orange Juice", description: "Freshly squeezed seasonal oranges, no added sugar, served chilled with mint", price: 89, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
        { name: "Mixed Fruit Juice", description: "Seasonal blend of orange, pineapple, apple and watermelon, freshly juiced and chilled", price: 109, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
        { name: "Fresh Lime Soda", description: "Zesty fresh lime with chilled soda water, served sweet, salty or masala as preferred", price: 69, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Sugarcane Juice", description: "Freshly pressed sugarcane juice with ginger, lemon and black salt, served ice cold", price: 59, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
        { name: "Pomegranate Juice", description: "Pure freshly squeezed pomegranate juice, packed with antioxidants and served chilled", price: 129, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Beetroot Carrot Juice", description: "Energizing blend of fresh beetroot, carrot and ginger, rich in vitamins and served cold", price: 119, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
      ]
    },
    {
      name: "Milkshakes", slug: "shakes", icon: "🥤", sortOrder: 3,
      items: [
        { name: "Mango Shake", description: "Thick creamy milkshake blended with real Alphonso mango pulp, chilled milk and ice cream", price: 149, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
        { name: "Chocolate Shake", description: "Rich dark chocolate blended with whole milk and vanilla ice cream, topped with whipped cream", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Strawberry Shake", description: "Fresh strawberries blended with creamy milk and ice cream, topped with berry sauce", price: 149, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
        { name: "Oreo Shake", description: "Crushed Oreo cookies blended with vanilla ice cream and cold milk, topped with cookie crumble", price: 169, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Dry Fruit Shake", description: "Premium milkshake loaded with almonds, cashews, pistachios, dates and saffron-infused milk", price: 189, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
        { name: "Kitkat Shake", description: "Blended Kitkat chocolate with creamy milk and ice cream, topped with chocolate drizzle", price: 169, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
        { name: "Butterscotch Shake", description: "Creamy butterscotch milkshake with caramel sauce and crunchy praline topping", price: 159, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
      ]
    },
    {
      name: "Desserts", slug: "desserts", icon: "🍮", sortOrder: 4,
      items: [
        { name: "Gulab Jamun", description: "Soft khoya milk-solid dumplings soaked in rose-cardamom sugar syrup, served warm with rabdi", price: 99, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
        { name: "Chocolate Brownie with Ice Cream", description: "Warm gooey dark chocolate brownie with a scoop of vanilla ice cream and hot fudge sauce", price: 169, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
        { name: "Mango Kulfi", description: "Traditional creamy Indian ice cream with fresh Alphonso mango, pistachio and cardamom", price: 119, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
        { name: "Rasmalai", description: "Soft spongy paneer patties soaked in chilled saffron-infused thickened milk with pistachios", price: 129, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
        { name: "Phirni", description: "Creamy ground rice pudding with saffron, cardamom and rose water, chilled and set in clay pots", price: 109, isVeg: true, isFeatured: false, imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
        { name: "Waffle with Ice Cream", description: "Crispy golden waffle topped with two scoops of ice cream, chocolate sauce and fresh fruits", price: 199, isVeg: true, isFeatured: true, imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
      ]
    },
  ]
};

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────
async function seedRestaurant(data: typeof FAMILY | typeof CHINESE | typeof CAFE) {
  const menuUrl = `${APP_URL}/menu/${data.slug}`;
  const qrDataUrl = await generateQRCode(menuUrl);

  // Delete existing if present
  const existing = await prisma.restaurant.findUnique({ where: { slug: data.slug } });
  if (existing) {
    await prisma.restaurant.delete({ where: { slug: data.slug } });
    console.log(`🗑️  Deleted old: ${data.name}`);
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      logoUrl: data.logoUrl,
      coverUrl: data.coverUrl,
      isActive: true,
      qrCodes: { create: { qrDataUrl, menuUrl, totalScans: 0 } },
    },
  });

  let totalItems = 0;
  for (const cat of data.categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        restaurantId: restaurant.id,
      },
    });

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg,
          isFeatured: item.isFeatured,
          isAvailable: true,
          categoryId: category.id,
        },
      });
      totalItems++;
    }
    console.log(`   ✅ ${cat.icon} ${cat.name}: ${cat.items.length} items`);
  }

  console.log(`\n🎉 ${data.name} — ${totalItems} items seeded`);
  console.log(`   🔗 Menu: /menu/${data.slug}`);
  return restaurant;
}

async function main() {
  console.log("🌱 Seeding 3 restaurants...\n");

  console.log("1️⃣  Family Restaurant");
  await seedRestaurant(FAMILY);

  console.log("\n2️⃣  Chinese Restaurant");
  await seedRestaurant(CHINESE);

  console.log("\n3️⃣  Cafe");
  await seedRestaurant(CAFE);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🍛 Family:  /menu/spice-villa");
  console.log("🥡 Chinese: /menu/dragon-wok");
  console.log("☕ Cafe:    /menu/brew-bites-cafe");
  console.log("📊 Admin:   /dashboard");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch(console.error).finally(() => prisma.$disconnect());
