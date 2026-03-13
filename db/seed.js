import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Pokemon from "../models/pokemon.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecté à MongoDB !");

    const filePath = path.resolve("./data/pokemons.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Pokemon.deleteMany({});
    console.log("Collection vidée");

    const inserted = await Pokemon.insertMany(data);
    console.log(`${inserted.length} Pokémon insérés avec succès !`);

    await mongoose.connection.close();
    console.log("Connexion fermée");
  } catch (error) {
    console.error("Erreur lors du seed :", error.message);
    process.exit(1);
  }
};

seed();