// prisma/seed-all.ts
// Run: npx tsx prisma/seed-all.ts

import { PrismaClient } from "@prisma/client";
import { generateQRCode } from "../lib/qrcode";

const prisma = new PrismaClient();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── RAW DATA ────────────────────────────────────────────────────────────────

const ALL_ITEMS = [
  { id:1,  name:"Classic Cheese Burger",           category:"Cheese",    price:179, description:"Juicy beef patty topped with melted cheddar, lettuce, tomato and special sauce in a toasted bun", isVeg:false, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id:2,  name:"Double Cheese Burger",             category:"Cheese",    price:229, description:"Double beef patty loaded with two slices of cheddar cheese, pickles, mustard and ketchup", isVeg:false, image:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
  { id:3,  name:"Veg Cheese Burger",                category:"Cheese",    price:149, description:"Crispy veg patty with processed cheese slice, fresh lettuce and tangy mayo sauce", isVeg:true,  image:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
  { id:4,  name:"Cheese Grilled Sandwich",          category:"Cheese",    price:129, description:"Golden grilled sandwich loaded with cheese, vegetables and green chutney on multigrain bread", isVeg:true,  image:"https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80" },
  { id:5,  name:"Cheese Club Sandwich",             category:"Cheese",    price:159, description:"Triple-decker club sandwich with cheese, chicken tikka, tomato and crispy lettuce", isVeg:false, image:"https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=400&q=80" },
  { id:6,  name:"Cheese Margherita Pizza",          category:"Cheese",    price:249, description:"Classic Italian pizza with rich tomato base, generous mozzarella and fresh basil on thin crust", isVeg:true,  image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
  { id:7,  name:"Four Cheese Pizza",                category:"Cheese",    price:349, description:"Indulgent pizza topped with mozzarella, cheddar, parmesan and gouda cheese blend", isVeg:true,  image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
  { id:8,  name:"Cheese Garlic Bread",              category:"Cheese",    price:99,  description:"Crispy toasted baguette slices smothered with garlic butter and melted mozzarella cheese", isVeg:true,  image:"https://images.unsplash.com/photo-1619531040576-f9416740661c?w=400&q=80" },
  { id:9,  name:"Cheese Stuffed Garlic Bread",      category:"Cheese",    price:139, description:"Fluffy garlic bread stuffed generously with gooey mozzarella and herbs, baked to perfection", isVeg:true,  image:"https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80" },
  { id:10, name:"Paneer Cheese Tikka Roll",         category:"Cheese",    price:169, description:"Tandoor-grilled paneer and cheese wrapped in flaky paratha with mint chutney and onions", isVeg:true,  image:"https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
  { id:11, name:"Cheese Corn Toast",                category:"Cheese",    price:119, description:"Thick toast topped with creamy cheese sauce, sweet corn and herbs, grilled until bubbly", isVeg:true,  image:"https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80" },
  { id:12, name:"Chicken Cheese Quesadilla",        category:"Cheese",    price:199, description:"Crispy flour tortilla filled with spiced chicken, melted cheddar, jalapeños and sour cream", isVeg:false, image:"https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&q=80" },
  { id:13, name:"Mac and Cheese",                   category:"Cheese",    price:189, description:"Classic creamy macaroni tossed in velvety four-cheese sauce with a golden breadcrumb topping", isVeg:true,  image:"https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=400&q=80" },
  { id:14, name:"Cheese Loaded Fries",              category:"Cheese",    price:149, description:"Crispy golden fries drenched in warm nacho cheese sauce topped with jalapeños and spring onions", isVeg:true,  image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
  { id:15, name:"Paneer Cheese Pizza",              category:"Cheese",    price:299, description:"Tandoori paneer on a cheesy pizza base with bell peppers, onions and extra mozzarella", isVeg:true,  image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id:16, name:"Classic Chicken Shawarma",         category:"Shawarma",  price:149, description:"Tender marinated chicken strips with garlic sauce, pickled veggies rolled in fresh Arabic bread", isVeg:false, image:"https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
  { id:17, name:"Special Shawarma",                 category:"Shawarma",  price:179, description:"Chef's special shawarma loaded with chicken, extra garlic sauce, cheese and crispy fries inside", isVeg:false, image:"https://images.unsplash.com/photo-1590816465124-8c99c9c41462?w=400&q=80" },
  { id:18, name:"Mexican Shawarma",                 category:"Shawarma",  price:189, description:"Spicy Mexican-style shawarma with chicken, jalapeños, salsa, sour cream and cheddar cheese", isVeg:false, image:"https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80" },
  { id:19, name:"Jumbo Shawarma",                   category:"Shawarma",  price:219, description:"Extra-large shawarma packed with double chicken, fries, garlic sauce and fresh vegetables", isVeg:false, image:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
  { id:20, name:"Paneer Shawarma",                  category:"Shawarma",  price:159, description:"Smoky grilled paneer with tahini, pickles, garlic sauce and crisp veggies in soft pita bread", isVeg:true,  image:"https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80" },
  { id:21, name:"Turkish Shawarma",                 category:"Shawarma",  price:199, description:"Authentic Turkish-style doner with chicken, yogurt sauce, sumac onions and fresh herbs", isVeg:false, image:"https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
  { id:22, name:"Mutton Shawarma",                  category:"Shawarma",  price:229, description:"Slow-roasted tender mutton slices with tahini, hummus, tomatoes in fresh Arabic pita bread", isVeg:false, image:"https://images.unsplash.com/photo-1530469525856-cf37954301f7?w=400&q=80" },
  { id:23, name:"Cheese Shawarma",                  category:"Shawarma",  price:189, description:"Classic chicken shawarma with extra melted cheese, garlic mayo and crispy pickled cucumbers", isVeg:false, image:"https://images.unsplash.com/photo-1590816465124-8c99c9c41462?w=400&q=80" },
  { id:24, name:"Spicy Chicken Shawarma",           category:"Shawarma",  price:169, description:"Fire-spiced chicken with hot sauce, pickled chillies, onions and garlic spread in pita bread", isVeg:false, image:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
  { id:25, name:"Falafel Shawarma",                 category:"Shawarma",  price:149, description:"Crispy fried falafel with hummus, tahini, fresh salad and pickles in warm pita bread", isVeg:true,  image:"https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80" },
  { id:26, name:"Tikka Shawarma",                   category:"Shawarma",  price:179, description:"Indian-style tikka-marinated chicken in a shawarma roll with mint chutney and sliced onions", isVeg:false, image:"https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80" },
  { id:27, name:"Shawarma Plate",                   category:"Shawarma",  price:259, description:"Generous plate with chicken shawarma, hummus, tabbouleh, pita bread and garlic dipping sauce", isVeg:false, image:"https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
  { id:28, name:"Lebanese Shawarma",                category:"Shawarma",  price:199, description:"Authentic Lebanese wrap with grilled chicken, toum garlic sauce, pickled turnip and parsley", isVeg:false, image:"https://images.unsplash.com/photo-1530469525856-cf37954301f7?w=400&q=80" },
  { id:29, name:"BBQ Shawarma",                     category:"Shawarma",  price:209, description:"BBQ-glazed chicken shawarma with coleslaw, smoky sauce and crispy fried onions in pita", isVeg:false, image:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
  { id:30, name:"Veg Arabic Shawarma",              category:"Shawarma",  price:139, description:"Grilled mixed vegetables with hummus, tahini and fresh herbs wrapped in soft Arabic bread", isVeg:true,  image:"https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&q=80" },
  { id:31, name:"Butter Chicken",                   category:"Gravy",     price:299, description:"Tender chicken in a rich, velvety tomato-butter sauce with aromatic spices and fresh cream", isVeg:false, image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
  { id:32, name:"Chicken Handi",                    category:"Gravy",     price:319, description:"Slow-cooked chicken in a traditional clay pot with onion-tomato masala and whole spices", isVeg:false, image:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
  { id:33, name:"Chicken Kadai",                    category:"Gravy",     price:309, description:"Stir-fried chicken with freshly ground kadai masala, tomatoes and crunchy bell peppers", isVeg:false, image:"https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
  { id:34, name:"Paneer Butter Masala",             category:"Gravy",     price:279, description:"Soft paneer cubes in a luxurious tomato-cashew-butter sauce with cardamom and cream", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:35, name:"Paneer Kadai",                     category:"Gravy",     price:269, description:"Fresh paneer and capsicum cooked in a spiced kadai masala with onions and whole coriander", isVeg:true,  image:"https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80" },
  { id:36, name:"Dal Makhani",                      category:"Gravy",     price:229, description:"Black lentils slow-cooked overnight with butter, cream, tomatoes and a blend of aromatic spices", isVeg:true,  image:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80" },
  { id:37, name:"Chicken Korma",                    category:"Gravy",     price:329, description:"Mild Mughlai-style chicken in a rich cashew-almond-yogurt gravy with rose water and saffron", isVeg:false, image:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { id:38, name:"Shahi Paneer",                     category:"Gravy",     price:289, description:"Royal paneer dish in a silky cashew-cream-tomato gravy with saffron and whole spices", isVeg:true,  image:"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80" },
  { id:39, name:"Chicken Rogan Josh",               category:"Gravy",     price:339, description:"Kashmiri-style chicken with bold whole spices, dried red chillies and a deep red gravy", isVeg:false, image:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80" },
  { id:40, name:"Matar Paneer",                     category:"Gravy",     price:249, description:"Green peas and paneer in a hearty spiced tomato-onion gravy finished with kasuri methi", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:41, name:"Chicken Tikka Masala",             category:"Gravy",     price:319, description:"Tandoor-grilled chicken tikka simmered in creamy tomato-onion masala with fenugreek leaves", isVeg:false, image:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
  { id:42, name:"Palak Paneer",                     category:"Gravy",     price:259, description:"Velvety pureed spinach gravy with fresh paneer cubes, garlic, ginger and mild spices", isVeg:true,  image:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80" },
  { id:43, name:"Chicken Vindaloo",                 category:"Gravy",     price:329, description:"Fiery Goan-style chicken curry with vinegar, mustard seeds, dried chillies and aromatic spices", isVeg:false, image:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80" },
  { id:44, name:"Chole Masala",                     category:"Gravy",     price:219, description:"Punjabi-style spiced chickpeas cooked with onion-tomato masala, tea and whole spices", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:45, name:"Mutton Keema",                     category:"Gravy",     price:349, description:"Minced mutton cooked with green peas, onions, tomatoes and freshly ground garam masala", isVeg:false, image:"https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
  { id:46, name:"Chicken Saag",                     category:"Gravy",     price:309, description:"Tender chicken pieces cooked in mustard greens and spinach gravy with ginger and garlic", isVeg:false, image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80" },
  { id:47, name:"Paneer Lababdar",                  category:"Gravy",     price:279, description:"Paneer in a rich, tangy tomato gravy with whole red chillies, kasuri methi and fresh cream", isVeg:true,  image:"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80" },
  { id:48, name:"Chicken Do Pyaza",                 category:"Gravy",     price:299, description:"Chicken cooked with double onions — half cooked in the gravy and half added crispy on top", isVeg:false, image:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { id:49, name:"Mix Veg Curry",                    category:"Gravy",     price:229, description:"Seasonal vegetables cooked in a mildly spiced onion-tomato gravy with whole spices", isVeg:true,  image:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80" },
  { id:50, name:"Mutton Rogan Josh",                category:"Gravy",     price:389, description:"Slow-braised Kashmiri mutton in an intense saffron-spiced red gravy with dried ginger", isVeg:false, image:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80" },
  { id:51, name:"Chicken Dum Biryani",              category:"Biryani",   price:299, description:"Fragrant basmati rice layered with spiced chicken, caramelized onions and saffron, slow-cooked dum-style", isVeg:false, image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { id:52, name:"Mutton Biryani",                   category:"Biryani",   price:369, description:"Tender mutton pieces and aged basmati rice cooked together with whole spices and rose water", isVeg:false, image:"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
  { id:53, name:"Veg Dum Biryani",                  category:"Biryani",   price:249, description:"Mixed seasonal vegetables with saffron-infused basmati rice sealed and cooked on slow flame", isVeg:true,  image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
  { id:54, name:"Hyderabadi Chicken Biryani",       category:"Biryani",   price:329, description:"Authentic Hyderabadi biryani with kacchi marinated chicken, fried onions and mint leaves", isVeg:false, image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { id:55, name:"Paneer Biryani",                   category:"Biryani",   price:279, description:"Marinated paneer cubes with fragrant rice, whole spices, fried onions and fresh coriander", isVeg:true,  image:"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
  { id:56, name:"Egg Biryani",                      category:"Biryani",   price:249, description:"Spiced basmati biryani with masala-coated boiled eggs, caramelized onions and fresh mint", isVeg:false, image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
  { id:57, name:"Chicken Tikka Biryani",            category:"Biryani",   price:349, description:"Tandoor-smoked chicken tikka layered in aromatic basmati with saffron milk and golden onions", isVeg:false, image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { id:58, name:"Prawn Biryani",                    category:"Biryani",   price:399, description:"Juicy marinated prawns cooked with coastal spices and basmati rice, served with raita", isVeg:false, image:"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80" },
  { id:59, name:"Mushroom Biryani",                 category:"Biryani",   price:259, description:"Button mushrooms and aromatic basmati with biryani spices, mint, coriander and fried onions", isVeg:true,  image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
  { id:60, name:"Lucknowi Biryani",                 category:"Biryani",   price:339, description:"Delicate Awadhi-style chicken biryani with subtle spices, kevra water and long-grain basmati", isVeg:false, image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { id:61, name:"Veg Hakka Noodles",                category:"Chinese",   price:189, description:"Wok-tossed noodles with crunchy seasonal vegetables in Indo-Chinese soy and chilli sauces", isVeg:true,  image:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
  { id:62, name:"Chicken Fried Rice",               category:"Chinese",   price:219, description:"Smoky wok-tossed rice with tender chicken, eggs, spring onions and soy sauce", isVeg:false, image:"https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
  { id:63, name:"Paneer Chilli Dry",                category:"Chinese",   price:229, description:"Crispy paneer cubes tossed in a spicy tangy sauce with bell peppers and spring onions", isVeg:true,  image:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
  { id:64, name:"Chicken Manchurian",               category:"Chinese",   price:249, description:"Deep-fried chicken balls tossed in a glossy, tangy manchurian sauce with garlic and ginger", isVeg:false, image:"https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
  { id:65, name:"Veg Spring Rolls",                 category:"Chinese",   price:159, description:"Crispy golden rolls stuffed with stir-fried vegetables and glass noodles, served with dipping sauce", isVeg:true,  image:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
  { id:66, name:"Hot and Sour Soup",                category:"Chinese",   price:149, description:"Tangy, spicy broth with mushrooms, tofu, corn and silky egg ribbons in a thickened stock", isVeg:true,  image:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
  { id:67, name:"Chicken Chow Mein",                category:"Chinese",   price:239, description:"Pan-fried crispy noodles tossed with chicken, vegetables and a savory umami sauce", isVeg:false, image:"https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80" },
  { id:68, name:"Veg Fried Rice",                   category:"Chinese",   price:179, description:"Light fluffy rice stir-fried with fresh vegetables, egg and seasoned with soy and sesame oil", isVeg:true,  image:"https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=400&q=80" },
  { id:69, name:"Chicken Lollipop",                 category:"Chinese",   price:279, description:"Juicy chicken drumettes in a fiery red chilli sauce, deep fried and garnished with spring onions", isVeg:false, image:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
  { id:70, name:"American Chopsuey",                category:"Chinese",   price:229, description:"Crispy noodle nest topped with sweet and sour vegetable sauce, egg and crunchy fried onions", isVeg:true,  image:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
  { id:71, name:"Veg Pav Bhaji",                    category:"Fast Food", price:119, description:"Mumbai's iconic spiced vegetable mash served with buttery toasted pav buns and fresh onions", isVeg:true,  image:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
  { id:72, name:"Masala Dosa",                      category:"Fast Food", price:129, description:"Crispy golden dosa filled with spiced potato masala, served with sambar and coconut chutney", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:73, name:"Chicken Tikka Roll",               category:"Fast Food", price:169, description:"Tandoor-grilled chicken tikka wrapped in a flaky rumali roti with onions and mint chutney", isVeg:false, image:"https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
  { id:74, name:"Vada Pav",                         category:"Fast Food", price:59,  description:"Mumbai street food staple — spiced potato vada in a soft pav with dry garlic and green chutney", isVeg:true,  image:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
  { id:75, name:"Chole Bhature",                    category:"Fast Food", price:159, description:"Fluffy deep-fried bhature with spiced Punjabi chole, pickle and sliced onions on the side", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:76, name:"Egg Frankie",                      category:"Fast Food", price:99,  description:"Spiced egg bhurji wrapped in a layered paratha roll with onions, chutney and masala", isVeg:false, image:"https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
  { id:77, name:"Aloo Tikki Chaat",                 category:"Fast Food", price:99,  description:"Crispy potato patties topped with chutneys, yogurt, pomegranate seeds and sev", isVeg:true,  image:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
  { id:78, name:"Chicken Burger",                   category:"Fast Food", price:149, description:"Crispy fried chicken patty with mayo, shredded lettuce and pickles in a toasted sesame bun", isVeg:false, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id:79, name:"Samosa Chaat",                     category:"Fast Food", price:89,  description:"Crushed crispy samosas with chickpeas, yogurt, tamarind chutney and fresh coriander", isVeg:true,  image:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
  { id:80, name:"Paneer Tikka Roll",                category:"Fast Food", price:159, description:"Smoky paneer tikka pieces wrapped in soft paratha with pickled onions and green chutney", isVeg:true,  image:"https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80" },
  { id:81, name:"Fresh Mango Juice",                category:"Juices",    price:99,  description:"Chilled freshly extracted Alphonso mango juice with a hint of black salt and cardamom", isVeg:true,  image:"https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
  { id:82, name:"Watermelon Juice",                 category:"Juices",    price:79,  description:"Refreshing cold-pressed watermelon juice with mint leaves and a squeeze of lime", isVeg:true,  image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id:83, name:"Fresh Orange Juice",               category:"Juices",    price:89,  description:"Freshly squeezed seasonal oranges, no added sugar, served chilled with mint", isVeg:true,  image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
  { id:84, name:"Mixed Fruit Juice",                category:"Juices",    price:109, description:"Seasonal blend of orange, pineapple, apple and watermelon, freshly juiced and chilled", isVeg:true,  image:"https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
  { id:85, name:"Fresh Lime Soda",                  category:"Juices",    price:69,  description:"Zesty fresh lime with chilled soda water, served sweet, salty or masala as preferred", isVeg:true,  image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id:86, name:"Sugarcane Juice",                  category:"Juices",    price:59,  description:"Freshly pressed sugarcane juice with ginger, lemon and black salt, served ice cold", isVeg:true,  image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
  { id:87, name:"Green Apple Juice",                category:"Juices",    price:109, description:"Tart fresh green apple juice blended with mint, ginger and a pinch of himalayan salt", isVeg:true,  image:"https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
  { id:88, name:"Pomegranate Juice",                category:"Juices",    price:129, description:"Pure freshly squeezed pomegranate juice, packed with antioxidants and served chilled", isVeg:true,  image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id:89, name:"Pineapple Juice",                  category:"Juices",    price:89,  description:"Sweet chilled pineapple juice with a hint of black pepper and fresh mint leaves", isVeg:true,  image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
  { id:90, name:"Beetroot Carrot Juice",            category:"Juices",    price:119, description:"Energizing blend of fresh beetroot, carrot and ginger, rich in vitamins and served cold", isVeg:true,  image:"https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80" },
  { id:91, name:"Mango Shake",                      category:"Shakes",    price:149, description:"Thick creamy milkshake blended with real Alphonso mango pulp, chilled milk and ice cream", isVeg:true,  image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id:92, name:"Chocolate Shake",                  category:"Shakes",    price:159, description:"Rich dark chocolate blended with whole milk and vanilla ice cream, topped with whipped cream", isVeg:true,  image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id:93, name:"Strawberry Shake",                 category:"Shakes",    price:149, description:"Fresh strawberries blended with creamy milk and ice cream, topped with berry sauce", isVeg:true,  image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id:94, name:"Oreo Shake",                       category:"Shakes",    price:169, description:"Crushed Oreo cookies blended with vanilla ice cream and cold milk, topped with cookie crumble", isVeg:true,  image:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id:95, name:"Dry Fruit Shake",                  category:"Shakes",    price:189, description:"Premium milkshake loaded with almonds, cashews, pistachios, dates and saffron-infused milk", isVeg:true,  image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id:96, name:"Gulab Jamun",                      category:"Desserts",  price:99,  description:"Soft khoya milk-solid dumplings soaked in rose-cardamom sugar syrup, served warm with rabdi", isVeg:true,  image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
  { id:97, name:"Chocolate Brownie with Ice Cream", category:"Desserts",  price:169, description:"Warm gooey dark chocolate brownie with a scoop of vanilla ice cream and hot fudge sauce", isVeg:true,  image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
  { id:98, name:"Mango Kulfi",                      category:"Desserts",  price:119, description:"Traditional creamy Indian ice cream with fresh Alphonso mango, pistachio and cardamom", isVeg:true,  image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
  { id:99, name:"Rasmalai",                         category:"Desserts",  price:129, description:"Soft spongy paneer patties soaked in chilled saffron-infused thickened milk with pistachios", isVeg:true,  image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
  { id:100,name:"Phirni",                           category:"Desserts",  price:109, description:"Creamy ground rice pudding with saffron, cardamom and rose water, chilled and set in clay pots", isVeg:true,  image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
];

// ─── 3 RESTAURANTS CONFIG ────────────────────────────────────────────────────

const RESTAURANTS = [
  {
    name: "Spice Villa Restaurant",
    slug: "spice-villa",
    description: "Authentic Indian flavours — rich gravies, biryanis & tandoor specials.",
    address: "12, MG Road, Bandra West, Mumbai",
    phone: "+91 98765 11111",
    logoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80",
    categories: [
      { name: "Starters",    slug: "starters",    icon: "🥗", sortOrder: 1, filter: (c: string) => c === "Shawarma" },
      { name: "Gravy",       slug: "gravy",        icon: "🍛", sortOrder: 2, filter: (c: string) => c === "Gravy" },
      { name: "Biryani",     slug: "biryani",      icon: "🍚", sortOrder: 3, filter: (c: string) => c === "Biryani" },
      { name: "Desserts",    slug: "desserts",     icon: "🍮", sortOrder: 4, filter: (c: string) => c === "Desserts" },
    ],
  },
  {
    name: "Wok & Roll Chinese",
    slug: "wok-and-roll",
    description: "Indo-Chinese specialties — noodles, fried rice, starters & gravies.",
    address: "Shop 3, Near Bus Stand, Andheri, Mumbai",
    phone: "+91 98765 22222",
    logoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&q=80",
    categories: [
      { name: "Chinese",      slug: "chinese",      icon: "🥢", sortOrder: 1, filter: (c: string) => c === "Chinese" },
      { name: "Fast Food",    slug: "fast-food",    icon: "🍔", sortOrder: 2, filter: (c: string) => c === "Fast Food" || c === "Cheese" },
      { name: "Juices",       slug: "juices",       icon: "🥤", sortOrder: 3, filter: (c: string) => c === "Juices" },
      { name: "Shakes",       slug: "shakes",       icon: "🥛", sortOrder: 4, filter: (c: string) => c === "Shakes" },
    ],
  },
  {
    name: "The Daily Cafe",
    slug: "the-daily-cafe",
    description: "Your cozy neighbourhood cafe — sandwiches, snacks, shakes & juices.",
    address: "15, FC Road, Pune",
    phone: "+91 98765 33333",
    logoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80",
    categories: [
      { name: "Sandwiches & Snacks", slug: "snacks",   icon: "🥪", sortOrder: 1, filter: (c: string) => c === "Cheese" || c === "Fast Food" },
      { name: "Juices",              slug: "juices",   icon: "🍹", sortOrder: 2, filter: (c: string) => c === "Juices" },
      { name: "Shakes",              slug: "shakes",   icon: "🧋", sortOrder: 3, filter: (c: string) => c === "Shakes" },
      { name: "Desserts",            slug: "desserts", icon: "🍨", sortOrder: 4, filter: (c: string) => c === "Desserts" },
    ],
  },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding 3 restaurants...\n");

  for (const r of RESTAURANTS) {
    const menuUrl = `${APP_URL}/menu/${r.slug}`;
    const qrDataUrl = await generateQRCode(menuUrl);

    const restaurant = await prisma.restaurant.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        address: r.address,
        phone: r.phone,
        logoUrl: r.logoUrl,
        isActive: true,
        qrCodes: { create: { qrDataUrl, menuUrl, totalScans: 0 } },
      },
    });

    console.log(`✅ ${r.name}`);

    let total = 0;
    for (const catConfig of r.categories) {
      const category = await prisma.category.upsert({
        where: { restaurantId_slug: { restaurantId: restaurant.id, slug: catConfig.slug } },
        update: {},
        create: {
          name: catConfig.name,
          slug: catConfig.slug,
          icon: catConfig.icon,
          sortOrder: catConfig.sortOrder,
          restaurantId: restaurant.id,
        },
      });

      const items = ALL_ITEMS.filter((i) => catConfig.filter(i.category));
      for (const item of items) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.image,
            isVeg: item.isVeg,
            isAvailable: true,
            isFeatured: false,
            categoryId: category.id,
          },
        });
        total++;
      }
      console.log(`   ${catConfig.icon} ${catConfig.name}: ${items.length} items`);
    }
    console.log(`   📦 Total: ${total} items | 🔗 /menu/${r.slug}\n`);
  }

  console.log("🎉 All done!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🍛 Restaurant  → /menu/spice-villa");
  console.log("🥢 Chinese     → /menu/wok-and-roll");
  console.log("☕ Cafe        → /menu/the-daily-cafe");
  console.log("📊 Dashboard   → /dashboard");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch(console.error).finally(() => prisma.$disconnect());
