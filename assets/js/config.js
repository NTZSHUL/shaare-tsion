/* =====================================================================
   CONFIGURATION — Shaaré Tsion, Neve Tzedek (Tel Aviv)
   ---------------------------------------------------------------------
   C'EST LE SEUL FICHIER À MODIFIER POUR L'ENTRETIEN COURANT.
   (This is the only file you need to edit for day-to-day upkeep.)
   Modifiez les horaires des offices, l'adresse e-mail de contact,
   les coordonnées et les événements ci-dessous, puis enregistrez.
   ===================================================================== */

window.SHUL_CONFIG = {

  /* --- Identité de la communauté ------------------------------------ */
  name: "Shaaré Tsion",
  nameHebrew: "שערי ציון",
  neighborhood: "Neve Tzedek, Tel Aviv",
  tagline: "Une communauté chaleureuse au cœur du quartier historique de Neve Tzedek.",

  /* --- Le Rav de la communauté --------------------------------------- */
  rav: {
    nom: "Rav Yonathan Seror",
    titre: "Rabbin de la communauté Shaaré Tsion-Etz Haïm",
    fonction: "Dayan au Beth-Din Chaaré Halakha Oumichpat",
    mot: "",   // (optionnel) un mot d'accueil du Rav — laisser "" pour masquer
    // Photo : déposez le fichier dans assets/images/ et indiquez son chemin.
    photo: "assets/images/rav-seror.jpg",
  },

  /* --- Faire un don --------------------------------------------------
     Lien du formulaire de dons (HelloAsso). Laisser "" pour masquer.   */
  donationUrl: "https://www.helloasso.com/associations/netsah/formulaires/63",
  // Paiement via l'application israélienne BIT : numéro destinataire
  // (celui du Rav). Laisser "" pour masquer l'option BIT.
  bitPhone: "054-542-3851",

  /* --- Photos mises en avant (synagogue & jardin) --------------------
     Déposez les fichiers dans assets/images/ puis indiquez le chemin.
     Laissez src: "" pour masquer une photo.                            */
  photos: {
    shul:   { src: "assets/images/synagogue.jpg", caption: "Notre synagogue" },
    garden: { src: "assets/images/jardin.jpg",    caption: "Le jardin — nos réceptions et événements" },
  },

  /* --- Galerie photos ------------------------------------------------
     Ajoutez autant d'images que souhaité. Déposez chaque fichier dans
     assets/images/ et ajoutez une ligne ci-dessous. Tableau vide [] =
     section « Galerie » masquée.                                       */
  gallery: [
    // { src: "assets/images/photo-1.jpg", caption: "Kiddouch communautaire" },
    // { src: "assets/images/photo-2.jpg", caption: "Soirée d'étude" },
    // { src: "assets/images/photo-3.jpg", caption: "Le jardin en fête" },
  ],

  /* --- Contact -------------------------------------------------------
     Adresse e-mail qui recevra les demandes du formulaire d'événements.
     Le formulaire ouvre l'application e-mail du visiteur, pré-remplie. */
  contactEmail: "ntzshul@gmail.com",
  phone: "",                       // ex: "+972 3 000 0000" (laisser vide pour masquer)
  // Compte Instagram : pseudo (ex: "shaare.tsion") OU lien complet.
  // Laisser "" pour masquer l'icône.
  instagram: "https://www.instagram.com/syna_nevetsedek",
  // Lien d'invitation au groupe WhatsApp (laisser "" pour masquer).
  whatsapp: "https://chat.whatsapp.com/CVucrZS33eIDJOdjkKP1dH?s=cl&p=a&ilr=0",

  /* --- Adresse / localisation ---------------------------------------- */
  address: "4 Yehieli, Tel Aviv",
  // Adresse complète affichée dans le pied de page :
  addressFull: "Synagogue Shaaré Tsion · Place Suzanne Dalal · 4 rue Yehieli, Tel Aviv",
  // Requête utilisée pour les liens Google Maps et Waze (itinéraire) :
  mapQuery: "Suzanne Dellal Center, 4 Yehieli, Tel Aviv",

  /* --- Hebcal : paramètres de calcul --------------------------------
     geonameId 293397 = Tel Aviv. candleMinutes = minutes avant le
     coucher du soleil pour l'allumage des bougies (usage à Tel Aviv). */
  hebcal: {
    geonameId: 293397,
    candleMinutes: 18,
  },

  /* --- Horaires des offices (Minyanim) -------------------------------
     Horaires FIXES fixés par la synagogue. Modifiez librement.
     Laissez une valeur vide "" pour ne pas afficher cette ligne.       */
  minyanim: {
    semaine: {                     // Dimanche → Vendredi (jours de semaine)
      label: "En semaine",
      offices: [
        { nom: "Sha'harit (matin)",  heure: "08:15" },
      ],
    },
    chabbat: {
      label: "Chabbat",
      offices: [
        { nom: "Kabbalat Chabbat",           heure: "Voir allumage des bougies" },
        { nom: "Sha'harit (matin)",          heure: "09:00" },
        { nom: "Min'ha (après-midi)",        heure: "1h30 avant la fin de Chabbat" },
        { nom: "Arvit & Havdala",            heure: "Voir sortie de Chabbat" },
      ],
    },
  },

  /* --- Actualités (page d'accueil) -----------------------------------
     Annonces gérées par l'administrateur : ajoutez / modifiez / retirez
     les blocs ci-dessous. Le plus récent en premier. Tableau vide [] =
     section « Actualités » masquée. « lien » est optionnel (""=aucun).  */
  news: [
    {
      date: "Août 2026",
      titre: "Reprise des cours du soir",
      texte: "Les cours de Guemara reprennent chaque mardi à 20h00, ouverts à tous, suivis d'un rafraîchissement.",
      lien: "",
    },
    {
      date: "Août 2026",
      titre: "Séouda chalichit communautaire",
      texte: "Rejoignez-nous pour la troisième séouda de Chabbat, offerte par la communauté à la synagogue.",
      lien: "",
    },
  ],

  /* --- Événements à venir --------------------------------------------
     Ajoutez / supprimez des blocs. Laissez le tableau vide [] pour
     masquer complètement la section « Événements ».                    */
  evenements: [
    // {
    //   titre: "Cours de Torah hebdomadaire",
    //   date: "Chaque mardi",
    //   heure: "20:00",
    //   description: "Étude ouverte à tous, suivie d'un rafraîchissement.",
    // },
  ],
};
