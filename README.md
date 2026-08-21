# Shaaré Tsion — Site web

Site de la communauté **Shaaré Tsion**, Neve Tzedek (Tel Aviv).
Français, horaires du Chabbat et temps de prière (zmanim) via l'API **Hebcal**,
et formulaire de contact pour les événements.

Site **statique** : aucun serveur, aucune base de données, aucun frais d'hébergement.

---

## 📁 Structure

```
SHUL_Website/
├── index.html              La page (structure)
├── assets/
│   ├── css/style.css       L'apparence (couleurs, mise en page)
│   └── js/
│       ├── config.js       ← LE SEUL FICHIER À MODIFIER couramment
│       └── app.js          La logique (Hebcal, formulaire) — ne pas toucher
└── README.md               Ce document
```

---

## ✏️ Modifier le contenu (sans savoir coder)

Ouvrez **`assets/js/config.js`** dans un éditeur de texte. Tout est en français et commenté :

| Pour changer…                    | Modifiez…                          |
|----------------------------------|------------------------------------|
| Adresse e-mail du contact        | `contactEmail`                     |
| Téléphone affiché                | `phone` (laisser `""` pour masquer)|
| Adresse / lien Google Maps       | `address`, `mapQuery`              |
| Minutes d'allumage des bougies   | `hebcal.candleMinutes`             |
| Horaires des offices (minyanim)  | `minyanim`                         |
| Événements à venir               | `evenements`                       |
| Photo du Rav                     | `rav.photo`                        |
| Photos synagogue / jardin        | `photos.shul`, `photos.garden`     |
| Galerie photos                   | `gallery`                          |
| Lien de dons (HelloAsso)         | `donationUrl`                      |

Enregistrez le fichier, puis rechargez la page. C'est tout.

> Les horaires du **Chabbat** et les **zmanim** se mettent à jour **automatiquement**
> chaque jour depuis Hebcal — rien à faire.

### Ajouter un événement
Dans `evenements`, ajoutez un bloc (retirez les `//` pour l'activer) :

```js
evenements: [
  {
    titre: "Cours de Torah",
    date: "Chaque mardi",
    heure: "20:00",
    description: "Étude ouverte à tous.",
  },
],
```

---

## 🖼️ Ajouter des photos

Toutes les images vivent dans **`assets/images/`** (voir `assets/images/LISEZ-MOI.txt`).
Déposez-y vos fichiers, c'est tout :

- **`rav-seror.jpg`** — photo du Rav (sinon l'emblème ✡ s'affiche)
- **`synagogue.jpg`** — photo de la synagogue
- **`jardin.jpg`** — photo du jardin des événements
- **Galerie** — déposez autant de photos que voulu, puis listez-les dans
  `gallery` (config.js). La section « Galerie » apparaît automatiquement ;
  un clic ouvre chaque photo en grand.

> **Où héberger plusieurs photos ?** Directement dans `assets/images/`. Une fois
> le site en ligne, ces fichiers sont servis gratuitement avec le reste du site —
> aucun service externe nécessaire.

## 💝 Dons

La section « Faire un don » et son bouton pointent vers le formulaire **HelloAsso**
défini dans `donationUrl` (config.js). Laissez `""` pour masquer toute la section.

---

## 👀 Prévisualiser en local

Dans un terminal, depuis le dossier du site :

```bash
python3 -m http.server 8765
```

Puis ouvrez **http://localhost:8765** dans votre navigateur.

> Ouvrir `index.html` directement (double-clic) peut empêcher le chargement des
> horaires (restrictions du navigateur). Utilisez la commande ci-dessus, ou mettez
> le site en ligne (voir ci-dessous).

---

## 🚀 Mettre en ligne (gratuit)

Guide complet pas à pas : voir **`DEPLOY.md`**.

- **Rapide** : glissez-déposez le dossier sur https://app.netlify.com/drop
- **Recommandé** (mises à jour auto + panneau d'admin) : GitHub + Netlify.

## 🗞️ Panneau d'administration des actualités

Une fois le site déployé via GitHub + Netlify (voir `DEPLOY.md`), les
**Actualités** de la page d'accueil se gèrent depuis un navigateur, sans
code, à l'adresse `VOTRE-SITE/admin/` (connexion par e-mail). Les annonces
sont enregistrées dans `assets/data/news.json`.

---

## 📧 Le formulaire d'événements

Le formulaire ouvre l'application e-mail du visiteur avec un message pré-rempli,
adressé à `contactEmail` (défini dans `config.js`). Aucun serveur requis.

> Si vous préférez recevoir les demandes sans que le visiteur ait besoin d'une
> application e-mail, on peut brancher un service gratuit (Formspree, Netlify Forms).
> Voir avec votre développeur.

---

## ℹ️ Sources des horaires

- **Hebcal** — https://www.hebcal.com — localisation : Tel Aviv (`geonameid` 293397).
- Les zmanim sont **indicatifs** ; confirmez toujours avec le Rav de la communauté.
