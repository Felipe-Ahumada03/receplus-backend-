const Preference = require('../models/Preference');

exports.savePreferences = async (req, res) => {
  const { userId, favorites, notPreferred, restrictions, allergies, otherFoods, otherRestrictions } = req.body;

  try {
    let prefs = await Preference.findOne({ userId });

    if (prefs) {
      // Actualizar si ya existen
      prefs.favorites = favorites;
      prefs.notPreferred = notPreferred;
      prefs.restrictions = restrictions;
      prefs.allergies = allergies;
      prefs.otherFoods = otherFoods;
      prefs.otherRestrictions = otherRestrictions;
    } else {
      // Crear si no existen
      prefs = new Preference({
        userId,
        favorites,
        notPreferred,
        restrictions,
        allergies,
        otherFoods,
        otherRestrictions
      });
    }

    await prefs.save();
    res.status(200).json({ message: 'Preferencias guardadas correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar preferencias' });
  }
};
