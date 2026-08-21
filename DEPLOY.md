# Mettre le site en ligne — Shaaré Tsion

Deux manières de publier le site. La **méthode B** est recommandée si vous
voulez que quelqu'un gère les **Actualités** depuis un navigateur (panneau
d'administration), sans toucher au code.

---

## Méthode A — Rapide (glisser-déposer, ~1 minute)

Idéale pour mettre le site en ligne tout de suite.

1. Allez sur **https://app.netlify.com/drop**
2. Glissez-déposez le dossier **`SHUL_Website`** entier sur la page.
3. C'est en ligne ! Netlify vous donne une adresse du type
   `https://nom-aleatoire.netlify.app`.

> Pour mettre à jour le site ensuite, il faut re-glisser le dossier.
> ⚠️ Avec cette méthode, le **panneau d'administration des actualités ne
> fonctionne pas** (il lui faut la méthode B).

---

## Méthode B — Recommandée (GitHub + Netlify, mises à jour automatiques)

Le site se met à jour tout seul à chaque modification, et le **panneau
d'admin** des actualités devient utilisable.

### 1. Mettre le code sur GitHub
1. Créez un compte gratuit sur **https://github.com**.
2. Créez un nouveau dépôt (**New repository**), par ex. `shaare-tsion`.
3. Téléversez-y le contenu du dossier `SHUL_Website`
   (bouton **Add file → Upload files**, glissez tous les fichiers).

### 2. Connecter Netlify
1. Créez un compte gratuit sur **https://www.netlify.com** (« Sign up with
   GitHub »).
2. **Add new site → Import an existing project → GitHub**, choisissez le
   dépôt `shaare-tsion`.
3. Laissez les réglages par défaut (pas de « build command », dossier de
   publication = la racine). Cliquez **Deploy**.

Le site est en ligne, et **chaque modification sur GitHub le met à jour
automatiquement**.

---

## Activer le panneau d'administration (Actualités)

Une fois le site sur Netlify (méthode B) :

1. Dans Netlify : **Site configuration → Identity → Enable Identity**.
2. Toujours dans **Identity → Registration**, mettez **Invite only**
   (seules les personnes invitées peuvent se connecter).
3. **Identity → Services → Git Gateway → Enable Git Gateway**.
4. **Identity → Invite users** : entrez votre e-mail (et ceux des autres
   administrateurs). Vous recevrez un e-mail d'invitation — cliquez le lien
   et choisissez un mot de passe.

C'est prêt. Le panneau est à l'adresse :

```
https://VOTRE-SITE.netlify.app/admin/
```

Connectez-vous, ouvrez **Actualités → Annonces**, et ajoutez / modifiez /
supprimez les annonces. En cliquant **Publish**, le site public se met à jour
en une minute environ.

> Les autres contenus (horaires des offices, e-mail, photos, dons…) se
> modifient dans `assets/js/config.js` — voir le `README.md`.

---

## Adresse personnalisée (optionnel)

Pour une adresse du type `shaaretsion.org` :
1. Achetez le nom de domaine (~10–15 $/an) chez un registrar (Gandi,
   Namecheap, Google Domains…).
2. Dans Netlify : **Domain management → Add a domain**, puis suivez les
   instructions DNS. Le certificat HTTPS est automatique et gratuit.

---

## Bon à savoir

- Le dossier **`design-source/`** ne sert qu'aux maquettes de design ; il
  peut être supprimé avant la mise en ligne (facultatif, sans effet sur le
  site).
- Les horaires du Chabbat et les zmanim se mettent à jour tout seuls (API
  Hebcal). Rien à faire.
