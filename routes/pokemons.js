import { Router } from "express";
import Pokemon from "../models/pokemon.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, name, page = 1, limit = 50, sort } = req.query;

    const filter = {};

    if (type) filter.type = { $in: [type] };
    if (name) filter["name.english"] = { $regex: name, $options: "i" };

    const total = await Pokemon.countDocuments(filter);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = Pokemon.find(filter).skip(skip).limit(parseInt(limit));

    if (sort) {
      let sortObj = {};
      if (sort.startsWith("-")) {
        sortObj[sort.substring(1)] = -1;
      } else {
        sortObj[sort] = 1;
      }
      query = query.sort(sortObj);
    }

    const data = await query;

    res.status(200).json({
      data,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pokemon = await Pokemon.findOne({ id });

    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ message: "Pokémon non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });  }
});

router.post("/", async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur lors de l'ajout du Pokémon", error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedPokemon = await Pokemon.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });

    if (updatedPokemon) {
      res.status(200).json(updatedPokemon);
    } else {
      res.status(404).json({ message: "Pokémon non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur lors de la mise à jour du Pokémon", error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await Pokemon.findOneAndDelete({ id });

    if (deleted) {
      res.status(200).json({ message: "Pokémon supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Pokémon non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });  }
});

router.post("/", async (req, res) => {
  try {
    const pokemonData = req.body;
    const newPokemon = await Pokemon.create(pokemonData);

    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du Pokémon", error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du Pokémon", error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deletedPokemon = await Pokemon.findOneAndDelete({ id });

    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.status(204).send();
  } catch (error) {
      res.status(500).json({ error: error.message });  }
});

export default router;