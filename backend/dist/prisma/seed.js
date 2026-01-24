"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@foryou.com' },
        update: {},
        create: {
            email: 'admin@foryou.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: client_1.UserRole.ADMIN,
        },
    });
    console.log('✅ Created admin user:', admin.email);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await prisma.user.upsert({
        where: { email: 'manager@foryou.com' },
        update: {},
        create: {
            email: 'manager@foryou.com',
            password: managerPassword,
            firstName: 'Manager',
            lastName: 'User',
            role: client_1.UserRole.MANAGER,
        },
    });
    console.log('✅ Created manager user:', manager.email);
    const loadedFries = await prisma.category.upsert({
        where: { id: 'cat-loaded-fries' },
        update: {},
        create: {
            id: 'cat-loaded-fries',
            name: 'Loaded Fries',
            description: 'Crispy fries loaded with delicious toppings',
            displayOrder: 1,
        },
    });
    const premiumSandwiches = await prisma.category.upsert({
        where: { id: 'cat-premium-sandwiches' },
        update: {},
        create: {
            id: 'cat-premium-sandwiches',
            name: 'Premium Sandwiches',
            description: 'Gourmet burgers and sandwiches',
            displayOrder: 2,
        },
    });
    const sandwiches = await prisma.category.upsert({
        where: { id: 'cat-sandwiches' },
        update: {},
        create: {
            id: 'cat-sandwiches',
            name: 'Sandwiches',
            description: 'Classic sandwiches and wraps',
            displayOrder: 3,
        },
    });
    const loadedMac = await prisma.category.upsert({
        where: { id: 'cat-loaded-mac' },
        update: {},
        create: {
            id: 'cat-loaded-mac',
            name: 'Loaded Mac',
            description: 'Mac N Cheese with premium toppings',
            displayOrder: 4,
        },
    });
    const combos = await prisma.category.upsert({
        where: { id: 'cat-combos' },
        update: {},
        create: {
            id: 'cat-combos',
            name: 'Combos',
            description: 'Complete meal combos',
            displayOrder: 5,
        },
    });
    const sides = await prisma.category.upsert({
        where: { id: 'cat-sides' },
        update: {},
        create: {
            id: 'cat-sides',
            name: 'Sides',
            description: 'Perfect sides to complement your meal',
            displayOrder: 6,
        },
    });
    const forYouRolls = await prisma.category.upsert({
        where: { id: 'cat-for-you-rolls' },
        update: {},
        create: {
            id: 'cat-for-you-rolls',
            name: 'For You Rolls (3PCS)',
            description: 'Signature sushi rolls',
            displayOrder: 7,
        },
    });
    const springRolls = await prisma.category.upsert({
        where: { id: 'cat-spring-rolls' },
        update: {},
        create: {
            id: 'cat-spring-rolls',
            name: 'Spring Rolls (6PCS)',
            description: 'Fresh spring rolls',
            displayOrder: 8,
        },
    });
    const makis = await prisma.category.upsert({
        where: { id: 'cat-makis' },
        update: {},
        create: {
            id: 'cat-makis',
            name: 'Makis (6PCS)',
            description: 'Classic maki rolls',
            displayOrder: 9,
        },
    });
    const futomakis = await prisma.category.upsert({
        where: { id: 'cat-futomakis' },
        update: {},
        create: {
            id: 'cat-futomakis',
            name: 'Futomakis (6PCS)',
            description: 'Large maki rolls',
            displayOrder: 10,
        },
    });
    const boxes = await prisma.category.upsert({
        where: { id: 'cat-boxes' },
        update: {},
        create: {
            id: 'cat-boxes',
            name: 'Boxes',
            description: 'Sushi boxes and platters',
            displayOrder: 11,
        },
    });
    const californias = await prisma.category.upsert({
        where: { id: 'cat-californias' },
        update: {},
        create: {
            id: 'cat-californias',
            name: 'Californias (4PCS)',
            description: 'California rolls',
            displayOrder: 12,
        },
    });
    const sushiBurrito = await prisma.category.upsert({
        where: { id: 'cat-sushi-burrito' },
        update: {},
        create: {
            id: 'cat-sushi-burrito',
            name: 'Sushi Burrito',
            description: 'Large sushi burritos',
            displayOrder: 13,
        },
    });
    const bowls = await prisma.category.upsert({
        where: { id: 'cat-bowls' },
        update: {},
        create: {
            id: 'cat-bowls',
            name: 'Bowls',
            description: 'Rice bowls and poke bowls',
            displayOrder: 14,
        },
    });
    const desserts = await prisma.category.upsert({
        where: { id: 'cat-desserts' },
        update: {},
        create: {
            id: 'cat-desserts',
            name: 'Desserts',
            description: 'Sweet treats',
            displayOrder: 15,
        },
    });
    const sundae = await prisma.category.upsert({
        where: { id: 'cat-sundae' },
        update: {},
        create: {
            id: 'cat-sundae',
            name: 'Sundae',
            description: 'Ice cream sundaes',
            displayOrder: 16,
        },
    });
    const drinks = await prisma.category.upsert({
        where: { id: 'cat-drinks' },
        update: {},
        create: {
            id: 'cat-drinks',
            name: 'Drinks & Coffee',
            description: 'Beverages and coffee',
            displayOrder: 17,
        },
    });
    console.log('✅ Created categories');
    const loadedFriesItems = [
        { id: 'fries-frosty', name: 'Frosty Fries', description: 'Fried chicken, fries, garlic aioli, cheese sauce, BBQ, herbs', price: 35, order: 1 },
        { id: 'fries-shawarma', name: 'Shawarma Fries', description: 'Shawarma, fries, white sauce, cheese sauce, herbs, paprika', price: 45, order: 2 },
        { id: 'fries-korean', name: 'Korean Fries', description: 'Korean chicken, fries, cheese sauce, sesame', price: 45, order: 3 },
        { id: 'fries-volcano', name: 'Spicy Volcano Fries', description: 'Fried chicken, shawarma, smoked turkey, cheese sauce, fries, Algerian, BBQ, herbs', price: 65, order: 4 },
        { id: 'fries-tasty', name: 'Tasty Fries', description: 'Fried chicken, shawarma, Mac N Cheese, fries, tasty sauce, herbs, pickles', price: 70, order: 5 },
        { id: 'fries-crunch', name: 'Crunch Fries', description: 'Fried chicken, potato wedges, cheese sauce, for you sauce, herbs', price: 60, order: 6 },
        { id: 'fries-poutine', name: 'Poutine Fried Chicken', description: 'Fried chicken, smoked turkey, fries, cheese sauce, mozzarella', price: 45, order: 7 },
    ];
    for (const item of loadedFriesItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: loadedFries.id,
                displayOrder: item.order,
            },
        });
    }
    const premiumSandwichesItems = [
        { id: 'prem-korean-burger', name: 'Korean Burger', description: 'Korean fried chicken, jalapenos, lettuce, garlic aioli, chilli cheese', price: 45, order: 1 },
        { id: 'prem-tasty-triple', name: 'Tasty Triple', description: 'Triple beef, triple cheese, tasty sauce, caramelized onions, lettuce', price: 90, order: 2 },
        { id: 'prem-mushroom-swiss', name: 'Mushroom Swiss Burger', description: 'Beef, mushrooms, Emmental, caramelized onions, burger sauce, lettuce', price: 50, order: 3 },
        { id: 'prem-rodeo', name: 'Rodeo Burger', description: '2x beef, onion rings, chilli cheese, caramelized onions, 2x cheddar, BBQ', price: 75, order: 4 },
        { id: 'prem-chicago', name: 'Chicago Burger', description: 'Fried chicken, mozzarella, smoked turkey, mushrooms, caramelized onions, BBQ, garlic aioli, lettuce', price: 55, order: 5 },
    ];
    for (const item of premiumSandwichesItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: premiumSandwiches.id,
                displayOrder: item.order,
            },
        });
    }
    const sandwichesItems = [
        { id: 'sand-shawarma', name: 'Shawarma', description: 'Classic shawarma wrap', price: 35, order: 1 },
        { id: 'sand-fried-chicken-wrap', name: 'Fried Chicken Wrap', description: 'Crispy fried chicken in a wrap', price: 55, order: 2 },
        { id: 'sand-fried-chicken', name: 'Fried Chicken Sandwich', description: 'Crispy fried chicken sandwich', price: 45, order: 3 },
        { id: 'sand-burrito', name: 'Burrito Mexicano', description: 'Mexican style burrito', price: 60, order: 4 },
        { id: 'sand-chicken-burger', name: 'Chicken Burger', description: 'Classic chicken burger', price: 35, order: 5 },
        { id: 'sand-cheese-burger', name: 'Cheese Burger', description: 'Classic cheeseburger', price: 45, order: 6 },
        { id: 'sand-tacos', name: 'Tacos Fried Chicken', description: 'Fried chicken tacos', price: 45, order: 7 },
        { id: 'sand-arabian', name: 'Arabian Bites', description: 'Arabian style bites', price: 60, order: 8 },
    ];
    for (const item of sandwichesItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: sandwiches.id,
                displayOrder: item.order,
            },
        });
    }
    const loadedMacItems = [
        { id: 'mac-smokey', name: 'Mac N Smokey', description: 'Oven baked Mac N Cheese, smoked turkey, cheese', price: 35, order: 1 },
        { id: 'mac-chicken', name: 'Mac N Chicken', description: 'Mac N Cheese, fried chicken, chives, crispy onions, Emmental', price: 40, order: 2 },
        { id: 'mac-korean', name: 'Korean Mac', description: 'Mac N Cheese, Korean chicken, garlic aioli, sesame, chives', price: 45, order: 3 },
    ];
    for (const item of loadedMacItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: loadedMac.id,
                displayOrder: item.order,
            },
        });
    }
    const combosItems = [
        { id: 'combo-for-you', name: 'For You Combo', description: 'Fried chicken tenders, onion rings, chilli cheese, cheese fingers, burger bun, fries, Mac N Cheese, soda, sundae', price: 100, order: 1 },
        { id: 'combo-la', name: 'Los Angeles (L.A) Combo', description: 'Slider cheese burger, slider chicken burger, fries, Mac N Cheese, soda, sundae', price: 85, order: 2 },
        { id: 'combo-nashville', name: 'Nashville Chicken Combo', description: 'Spicy chicken, Mac N Cheese, burger bun', price: 60, order: 3 },
    ];
    for (const item of combosItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: combos.id,
                displayOrder: item.order,
            },
        });
    }
    const sidesItems = [
        { id: 'side-onion-rings', name: 'Onion Rings', description: 'Crispy onion rings', price: 35, order: 1 },
        { id: 'side-chilli-cheese', name: 'Chilli Cheese', description: 'Spicy chilli cheese', price: 35, order: 2 },
        { id: 'side-cheese-fingers', name: 'Cheese Fingers', description: 'Crispy cheese fingers', price: 35, order: 3 },
        { id: 'side-fries', name: 'Fries', description: 'Classic french fries', price: 15, order: 4 },
        { id: 'side-mac-cheese', name: 'Mac N Cheese', description: 'Creamy mac and cheese', price: 25, order: 5 },
        { id: 'side-mac-salad', name: 'Mac Salad', description: 'Macaroni salad', price: 25, order: 6 },
    ];
    for (const item of sidesItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: sides.id,
                displayOrder: item.order,
            },
        });
    }
    const forYouRollsItems = [
        { id: 'roll-fried-sushi-crunchy', name: 'Fried Sushi Crunchy', description: 'Crispy fried sushi roll', price: 35, order: 1 },
        { id: 'roll-sushi-pizza', name: 'Sushi Pizza', description: 'Sushi style pizza', price: 40, order: 2 },
        { id: 'roll-maki-fry', name: 'Maki Fry', description: 'Fried maki roll', price: 45, order: 3 },
        { id: 'roll-for-you-fry', name: 'For You Fry', description: 'Signature fried roll', price: 50, order: 4 },
        { id: 'roll-dragon-eye', name: 'Dragon Eye', description: 'Dragon eye roll', price: 45, order: 5 },
        { id: 'roll-alaska', name: 'Alaska Roll', description: 'Saumon, concombre, cheese', price: 80, order: 6 },
        { id: 'roll-malibu', name: 'Malibu Roll', description: 'Ebi tempura, surimi, cheese', price: 45, order: 7 },
        { id: 'roll-philly', name: 'Philly Roll', description: 'Saumon, ciboulette, ananas, avocat, cheese', price: 75, order: 8 },
        { id: 'roll-tokyo', name: 'Tokyo Style Sushi Pizza', description: 'Saumon, avocat, surimi, wakame, sesame, kamikaze, teryaki, cheese', price: 55, order: 9 },
    ];
    for (const item of forYouRollsItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: forYouRolls.id,
                displayOrder: item.order,
            },
        });
    }
    const springRollsItems = [
        { id: 'spring-saumon', name: 'Saumon', description: 'Saumon, avocat, surimi, cheese', price: 45, order: 1 },
        { id: 'spring-crevette', name: 'Crevette', description: 'Crevettes, avocat, surimi, cheese', price: 40, order: 2 },
        { id: 'spring-mangue-ebi', name: 'Mangue Ebi', description: 'Crevette, surimi, mangue, cheese, tobiko', price: 45, order: 3 },
        { id: 'spring-hawaii', name: 'Hawaii', description: 'Saumon, mangue, surimi, cheese, tobiko', price: 55, order: 4 },
        { id: 'spring-marbella', name: 'Marbella', description: 'Saumon, crevettes, surimi, avocat, cheese, tobiko', price: 55, order: 5 },
    ];
    for (const item of springRollsItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: springRolls.id,
                displayOrder: item.order,
            },
        });
    }
    const makisItems = [
        { id: 'maki-saumon-cheese', name: 'Saumon + Cheese', description: 'Saumon and cheese maki', price: 25, order: 1 },
        { id: 'maki-crevette-cheese', name: 'Crevette + Cheese', description: 'Crevette and cheese maki', price: 25, order: 2 },
        { id: 'maki-surimi-cheese', name: 'Surimi + Cheese', description: 'Surimi and cheese maki', price: 25, order: 3 },
        { id: 'maki-avocat-cheese', name: 'Avocat + Cheese', description: 'Avocat and cheese maki', price: 20, order: 4 },
        { id: 'maki-concombre-cheese', name: 'Concombre + Cheese', description: 'Concombre and cheese maki', price: 20, order: 5 },
        { id: 'maki-saumon-avocat', name: 'Saumon Avocat Cheese', description: 'Saumon, avocat, and cheese', price: 35, order: 6 },
    ];
    for (const item of makisItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: makis.id,
                displayOrder: item.order,
            },
        });
    }
    const futomakisItems = [
        { id: 'futo-saumon', name: 'Saumon', description: 'Saumon futomaki', price: 45, order: 1 },
        { id: 'futo-crevette', name: 'Crevette', description: 'Crevette futomaki', price: 40, order: 2 },
        { id: 'futo-surimi', name: 'Surimi', description: 'Surimi futomaki', price: 40, order: 3 },
    ];
    for (const item of futomakisItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: futomakis.id,
                displayOrder: item.order,
            },
        });
    }
    const boxesItems = [
        { id: 'box-makinsanity', name: 'Makinsanity 16PCS', description: '16 piece maki box', price: 45, order: 1 },
        { id: 'box-summer', name: 'Summer Box 20PCS', description: 'Spring Hawaii & Maki Fry 3, Alaska Roll 4', price: 110, order: 2 },
        { id: 'box-for-you', name: 'For You Box 14PCS', description: '14 piece signature box', price: 75, order: 3 },
        { id: 'box-rainbow', name: 'Rainbow Box 16PCS', description: '16 piece rainbow box', price: 100, order: 4 },
        { id: 'box-24', name: '24 Pieces Box', description: '24 piece box', price: 130, order: 5 },
        { id: 'box-fried-32', name: 'Fried Sushi Box 32PCS', description: '32 piece fried sushi box', price: 145, order: 6 },
    ];
    for (const item of boxesItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: boxes.id,
                displayOrder: item.order,
            },
        });
    }
    const californiasItems = [
        { id: 'cal-creme-cheese', name: 'Creme Cheese', description: 'Saumon, avocat, surimi, cheese, tobiko', price: 35, order: 1 },
        { id: 'cal-classique', name: 'Classique', description: 'Surimi, cheese, avocat, tobiko', price: 30, order: 2 },
        { id: 'cal-ebi-fry', name: 'Ebi Fry', description: 'Crevettes, surimi, avocat, cheese, ciboulette', price: 35, order: 3 },
        { id: 'cal-sesame', name: 'Sésame', description: 'Saumon, cheese, avocat, sésames', price: 35, order: 4 },
        { id: 'cal-ebi-tobiko', name: 'Ebi Tobiko', description: 'Crevettes, cheese, avocat, tobiko', price: 40, order: 5 },
    ];
    for (const item of californiasItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: californias.id,
                displayOrder: item.order,
            },
        });
    }
    const sushiBurritoItems = [
        { id: 'burrito-classic', name: 'Classic', description: 'Riz, saumon, goma wakame, avocat, surimi, ananas/mangue, creme cheese', price: 55, order: 1 },
        { id: 'burrito-gambas', name: 'Gambas', description: 'Riz, crevettes panées, avocat, surimi, tobiko, creme cheese', price: 50, order: 2 },
        { id: 'burrito-cesar', name: 'César', description: 'Riz, crevettes panées, fried chicken, ananas/mangue, goma wakame, cheese', price: 55, order: 3 },
    ];
    for (const item of sushiBurritoItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: sushiBurrito.id,
                displayOrder: item.order,
            },
        });
    }
    const bowlsItems = [
        { id: 'bowl-chirashi-classic', name: 'Chirashi Classic', description: 'Saumon, surimi, avocat, riz', price: 55, order: 1 },
        { id: 'bowl-chirashi-mixed', name: 'Chirashi Mixed', description: 'Saumon, crevettes, surimi, avocat, riz', price: 60, order: 2 },
        { id: 'bowl-poke', name: 'Poke Bowl', description: 'Saumon, avocat, riz, ananas, crevettes, fried chicken, sesame, wakame, concombre', price: 80, order: 3 },
    ];
    for (const item of bowlsItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: bowls.id,
                displayOrder: item.order,
            },
        });
    }
    const dessertsItems = [
        { id: 'dessert-banoffee', name: 'Banoffee Pie', description: 'Banana and toffee pie', price: 20, order: 1 },
        { id: 'dessert-cheesecup', name: 'Cheesecup', description: 'Creamy cheesecake in a cup', price: 25, order: 2 },
        { id: 'dessert-oreo', name: 'Oreo Parfait', description: 'Oreo parfait dessert', price: 30, order: 3 },
        { id: 'dessert-waffle', name: 'Waffle', description: 'Classic waffle', price: 35, order: 4 },
    ];
    for (const item of dessertsItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: desserts.id,
                displayOrder: item.order,
            },
        });
    }
    const sundaeItems = [
        { id: 'sundae-classic', name: 'Sundae Classic', description: 'Chocolate, caramel, Oreo, Kinder, KitKat, strawberry', price: 35, order: 1 },
        { id: 'sundae-deluxe', name: 'Sundae Deluxe', description: 'Pistachio, special', price: 40, order: 2 },
    ];
    for (const item of sundaeItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: sundae.id,
                displayOrder: item.order,
            },
        });
    }
    const drinksItems = [
        { id: 'drink-milkshake', name: 'Milkshake', description: 'Creamy milkshake', price: 35, order: 1 },
        { id: 'drink-pina-colada', name: 'Pina Colada Shake', description: 'Tropical pina colada shake', price: 40, order: 2 },
        { id: 'drink-mojito', name: 'Mojito', description: 'Refreshing mojito', price: 40, order: 3 },
        { id: 'drink-tropical-fizz', name: 'Tropical Fizz', description: 'Tropical fizzy drink', price: 35, order: 4 },
        { id: 'drink-pineapple-fizz', name: 'Pineapple Fizz', description: 'Pineapple fizzy drink', price: 35, order: 5 },
        { id: 'drink-sweet-fusion', name: 'Sweet Fusion Smoothie', description: 'Sweet fusion smoothie', price: 40, order: 6 },
        { id: 'drink-espresso', name: 'Espresso', description: 'Strong espresso coffee', price: 20, order: 7 },
        { id: 'drink-latte', name: 'Latte', description: 'Creamy latte coffee', price: 25, order: 8 },
        { id: 'drink-americano', name: 'Americano', description: 'Classic americano coffee', price: 20, order: 9 },
        { id: 'drink-mint-tea', name: 'Mint Tea', description: 'Refreshing mint tea', price: 20, order: 10 },
        { id: 'drink-iced-latte', name: 'Iced Latte', description: 'Cold iced latte', price: 25, order: 11 },
        { id: 'drink-iced-macchiato', name: 'Iced Macchiato', description: 'Cold iced macchiato', price: 25, order: 12 },
        { id: 'drink-soda', name: 'Soda', description: 'Soft drink', price: 20, order: 13 },
        { id: 'drink-special-soda', name: 'Special Soda', description: 'Special soft drink', price: 25, order: 14 },
        { id: 'drink-glass-soda', name: 'Glass Soda', description: 'Glass of soda', price: 20, order: 15 },
        { id: 'drink-juice', name: 'Juice', description: 'Fresh juice', price: 20, order: 16 },
        { id: 'drink-panache', name: 'Panache', description: 'Mixed drink', price: 20, order: 17 },
        { id: 'drink-water', name: 'Water', description: 'Bottled water', price: 15, order: 18 },
    ];
    for (const item of drinksItems) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: {},
            create: {
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: drinks.id,
                displayOrder: item.order,
            },
        });
    }
    console.log('✅ Created all menu items');
    for (let i = 1; i <= 10; i++) {
        await prisma.table.upsert({
            where: { number: i },
            update: {},
            create: {
                number: i,
                capacity: 4,
                qrCode: `FY-TABLE-${i}-${Date.now()}`,
            },
        });
    }
    console.log('✅ Created 10 tables');
    const promoCode = await prisma.promoCode.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            description: '10% off your first order',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            maxUses: 1000,
            createdById: admin.id,
        },
    });
    console.log('✅ Created promo code:', promoCode.code);
    console.log('🎉 Seeding completed!');
    console.log('\n📝 Default credentials:');
    console.log('Admin: admin@foryou.com / admin123');
    console.log('Manager: manager@foryou.com / manager123');
    console.log('\n📊 Menu Summary:');
    console.log(`- ${loadedFriesItems.length} Loaded Fries items`);
    console.log(`- ${premiumSandwichesItems.length} Premium Sandwiches`);
    console.log(`- ${sandwichesItems.length} Sandwiches`);
    console.log(`- ${loadedMacItems.length} Loaded Mac items`);
    console.log(`- ${combosItems.length} Combos`);
    console.log(`- ${sidesItems.length} Sides`);
    console.log(`- ${forYouRollsItems.length} For You Rolls`);
    console.log(`- ${springRollsItems.length} Spring Rolls`);
    console.log(`- ${makisItems.length} Makis`);
    console.log(`- ${futomakisItems.length} Futomakis`);
    console.log(`- ${boxesItems.length} Boxes`);
    console.log(`- ${californiasItems.length} Californias`);
    console.log(`- ${sushiBurritoItems.length} Sushi Burritos`);
    console.log(`- ${bowlsItems.length} Bowls`);
    console.log(`- ${dessertsItems.length} Desserts`);
    console.log(`- ${sundaeItems.length} Sundaes`);
    console.log(`- ${drinksItems.length} Drinks & Coffee`);
    console.log(`\n✨ Total: ${loadedFriesItems.length + premiumSandwichesItems.length + sandwichesItems.length + loadedMacItems.length + combosItems.length + sidesItems.length + forYouRollsItems.length + springRollsItems.length + makisItems.length + futomakisItems.length + boxesItems.length + californiasItems.length + sushiBurritoItems.length + bowlsItems.length + dessertsItems.length + sundaeItems.length + drinksItems.length} menu items!`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map