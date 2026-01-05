const images = {
    // Restaurants
    'Pasta Palace': require('../../assets/PastaPalace.png'),
    'Sushi Central': require('../../assets/Sushi.png'),
    'Burger Barn': require('../../assets/BurgerBarn.png'),
    'Curry Corner': require('../../assets/CurryCorner.png'),
    'Taco Town': require('../../assets/TacoTown.png'),

    // Menu Items - Pasta Palace
    'Spaghetti Bolognese': require('../../assets/spaghetti.png'),
    'Fettuccine Alfredo': require('../../assets/fettuccine.png'),
    'Margherita Pizza': require('../../assets/margherita.png'),

    // Menu Items - Sushi Central
    'California Roll': require('../../assets/california.png'),
    'Salmon Nigiri': require('../../assets/Salmon.png'),
    'Tuna Sashimi': require('../../assets/Tuna.png'),

    // Menu Items - Burger Barn
    'Classic Cheeseburger': require('../../assets/CheeseBurger.png'),
    'BBQ Bacon Burger': require('../../assets/BbqBacon.png'), // Using specific asset instead of restaurant logo
    'Loaded Fries': require('../../assets/LoadedFries.png'),

    // Menu Items - Curry Corner
    'Butter Chicken': require('../../assets/ButterChicken.png'),
    'Chana Masala': require('../../assets/CurryCorner.png'), // Fallback as chana.png is missing
    'Garlic Naan': require('../../assets/GarlicNaan.png'),

    // Menu Items - Taco Town
    'Carne Asada Tacos': require('../../assets/carneAsada.png'),
    'Chicken Quesadilla': require('../../assets/chickenQues.png'),
    'Churros': require('../../assets/churros.png'),

    // Defaults
    logo: require('../../assets/icon.png'),
};

export default images;
