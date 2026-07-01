# Spec — Recherche, filtrage et tri intelligents

**Projet :** restaurant-demo-new
**Écrans concernés :** Liste des restaurants / Menu d'un restaurant
**Statut :** Draft v1 — prêt pour revue

---

## Contexte

Aujourd'hui, l'utilisateur ne peut pas affiner ce qu'il voit dans l'app : ni la liste des restaurants, ni le menu d'un restaurant donné. Il doit parcourir manuellement tous les éléments pour trouver ce qui correspond à son envie ou à ses contraintes alimentaires. Cette feature ajoute une recherche texte libre, des filtres combinables (catégories, tags diététiques, fourchette de prix) et un tri, sur les deux écrans, avec un état dédié quand la combinaison de critères ne retourne rien.

**KPI principal :** taux de clic sur un résultat après une recherche/filtre (search-to-click rate)
**KPI secondaires :** taux d'usage des filtres (% de sessions avec au moins un filtre actif), temps médian entre l'arrivée sur l'écran et le premier clic sur un résultat
**Guardrail :** taux de sessions terminant sur un état "aucun résultat" sans relance (abandon sec)

---

## User Stories

### US1 — Recherche/filtrage/tri sur la liste des restaurants

> En tant qu'**utilisateur parcourant la liste des restaurants**, quand je cherche une option qui correspond à mon envie du moment, je veux **rechercher par nom/description, filtrer par catégorie et tags diététiques, borner par fourchette de prix, et trier les résultats**, afin de **trouver plus rapidement un restaurant qui me convient**.

### US2 — Recherche/filtrage/tri sur le menu d'un restaurant

> En tant qu'**utilisateur consultant le menu d'un restaurant**, quand je cherche un plat précis ou que j'ai des contraintes alimentaires, je veux **rechercher par nom/description de plat, filtrer par catégorie et tags diététiques, borner par fourchette de prix, et trier les résultats**, afin de **trouver plus rapidement un plat qui me convient**.

Les deux écrans partagent la même mécanique de recherche/filtrage/tri (voir Management Rules). Seul l'objet recherché change : restaurant (US1) vs plat (US2).

---

## Acceptance Criteria

### Happy path

**AC1 — Recherche texte libre**
```
GIVEN je suis sur l'écran liste des restaurants (ou menu d'un restaurant)
WHEN je saisis un terme dans le champ de recherche
THEN la liste se met à jour pour n'afficher que les éléments dont le nom OU la description contient le terme saisi (insensible à la casse et aux accents)
AND la mise à jour se fait sans rechargement de page, avec un délai de debounce de 300ms après la dernière frappe
```

**AC2 — Filtrage par catégories (sélection multiple)**
```
GIVEN je suis sur l'écran liste des restaurants (ou menu d'un restaurant)
WHEN je sélectionne plusieurs catégories dans le filtre catégories (ex : "Italien" + "Japonais")
THEN la liste affiche les éléments appartenant à AU MOINS UNE des catégories sélectionnées (logique OR à l'intérieur du filtre)
AND le nombre de résultats affichés est mis à jour en temps réel à côté du filtre
```

**AC3 — Filtrage par tags diététiques (sélection multiple)**
```
GIVEN je suis sur l'écran liste des restaurants (ou menu d'un restaurant)
WHEN je sélectionne plusieurs tags diététiques (végétarien, vegan, sans gluten)
THEN la liste n'affiche que les éléments qui possèdent TOUS les tags sélectionnés (logique AND, car ce sont des contraintes alimentaires cumulatives)
```

**AC4 — Fourchette de prix**
```
GIVEN je suis sur l'écran liste des restaurants (ou menu d'un restaurant)
WHEN je déplace le curseur min et/ou max de la fourchette de prix
THEN la liste n'affiche que les éléments dont le prix est compris entre les deux bornes sélectionnées (bornes incluses)
AND les valeurs min/max du curseur reflètent le prix le plus bas et le plus haut réellement présents dans le catalogue affiché
```

**AC5 — Combinaison des filtres**
```
GIVEN j'ai activé une recherche texte ET/OU une ou plusieurs catégories ET/OU un ou plusieurs tags diététiques ET/OU une fourchette de prix
WHEN les filtres sont actifs simultanément
THEN seuls les éléments qui satisfont TOUS les critères actifs (recherche texte AND catégories AND tags diététiques AND fourchette de prix) sont affichés
```

**AC6 — Tri par prix**
```
GIVEN je suis sur une liste de résultats (filtrée ou non)
WHEN je sélectionne le tri "Prix croissant" ou "Prix décroissant"
THEN les résultats affichés sont réordonnés selon le prix, dans l'ordre choisi, sans perdre les filtres actifs
```

**AC7 — Tri par popularité**
```
GIVEN je suis sur une liste de résultats (filtrée ou non)
WHEN je sélectionne le tri "Popularité"
THEN les résultats sont réordonnés par note moyenne décroissante (des avis les mieux notés aux moins bien notés)
AND en cas d'égalité de note, les éléments sont départagés par nombre d'avis décroissant
```

### Scénarios d'erreur / aucun résultat

**AC8 — Aucun résultat avec suggestion**
```
GIVEN j'ai une combinaison de recherche/filtres active
WHEN cette combinaison ne retourne aucun élément
THEN je vois un état "Aucun résultat" avec le message : "Aucun résultat ne correspond à votre recherche."
AND un bouton "Réinitialiser les filtres" est affiché et me ramène à la liste complète (sans recherche ni filtre) au clic
AND si retirer UN SEUL des critères actifs suffirait à obtenir au moins un résultat, une suggestion est proposée sous la forme "Essayer sans [nom du filtre]" (limité aux 2 suggestions les plus pertinentes, cf. Management Rules)
```

**AC9 — Recherche texte sans correspondance mais filtres larges**
```
GIVEN j'ai saisi un terme de recherche qui ne correspond à aucun élément, sans autre filtre actif
WHEN le résultat est vide
THEN je vois l'état "Aucun résultat" du AC8
AND aucune suggestion de type "Essayer sans [filtre]" n'est affichée puisque aucun filtre catégorie/tag/prix n'est actif (seule l'option reset recherche est proposée)
```

---

## Management Rules

- Aucun filtre n'est actif **par défaut** à l'arrivée sur l'écran ; la fourchette de prix par défaut couvre l'intégralité de la plage min-max du catalogue affiché.
- Le tri par défaut est **"Pertinence"** (ordre catalogue standard) tant qu'aucun tri n'est choisi explicitement par l'utilisateur.
- Logique de combinaison : **OR à l'intérieur d'un même filtre** (catégories entre elles), **AND entre familles de filtres différentes** (recherche texte AND catégories AND tags diététiques AND prix). Exception : les **tags diététiques utilisent AND entre eux**, car ce sont des contraintes cumulatives (un plat "vegan ET sans gluten" doit remplir les deux, pas l'un ou l'autre).
- Les critères actifs (recherche, filtres, tri) sont conservés tant que l'utilisateur reste sur l'écran, y compris lors du scroll ou du chargement de résultats supplémentaires. Ils sont **réinitialisés à la navigation vers un autre écran** (pas de persistance cross-session pour la V1).
- Le calcul des suggestions de l'AC8 se fait en testant le retrait de chaque famille de filtre active une par une (recherche texte exclue du test, car retirer la recherche revient à tout afficher) ; seules les familles dont le retrait **seul** produit au moins un résultat sont proposées, classées par ordre de sélectivité (le filtre le plus restrictif — celui qui, seul, exclut le plus d'éléments — est suggéré en premier).
- Le matching texte est **insensible à la casse et aux accents**, et cherche une sous-chaîne (pas de recherche floue/fuzzy en V1).
- Les listes de catégories et de tags diététiques disponibles dans les filtres reflètent uniquement les valeurs **effectivement présentes** dans le catalogue affiché (pas de catégorie vide proposée).
- Le compteur de résultats et la liste se mettent à jour de façon synchrone à chaque changement de filtre, recherche ou tri.

---

## Edge Cases

- Si l'utilisateur efface le champ de recherche, les autres filtres actifs restent appliqués et la liste se recalcule immédiatement (retrait du seul critère texte).
- Si l'utilisateur sélectionne puis désélectionne toutes les catégories, le filtre catégorie redevient inactif (équivalent à "toutes les catégories").
- Si le catalogue affiché ne contient qu'un seul prix (min = max), le curseur de fourchette de prix est affiché désactivé ou masqué (rien à filtrer).
- Si aucune donnée de note (popularité) n'existe pour un élément, celui-ci est classé après tous les éléments notés lors d'un tri par popularité (traité comme note la plus basse, pas d'erreur).
- Si le catalogue est mis à jour (ajout/suppression d'un élément) pendant que l'utilisateur a une recherche/des filtres actifs, les critères actifs sont réappliqués automatiquement au nouveau jeu de données au prochain rafraîchissement, sans réinitialiser les filtres de l'utilisateur.
- Si la saisie dans le champ de recherche contient des caractères spéciaux ou est très longue, elle est traitée comme une chaîne littérale sans erreur bloquante (pas de crash, résultat potentiellement vide).

---

## Dépendances / questions ouvertes

- **Disponibilité de la donnée "note moyenne"** : le tri par popularité (AC7) suppose qu'un système de notation/avis existe déjà ou sera livré en amont de cette feature. À confirmer avec l'équipe technique avant le développement — si la donnée n'existe pas encore, le tri par popularité passe en V2 et le MVP se limite au tri par prix.
- **Granularité des tags diététiques** : à confirmer si un même item peut cumuler plusieurs tags (ex: vegan ET sans gluten) dans le modèle de données actuel — l'AC3 suppose que oui.

---

## Tracking

| Event | Déclencheur | Propriétés clés | Métrique servie |
|---|---|---|---|
| `search_filter_applied` | À chaque changement effectif de recherche, filtre catégorie, filtre tag diététique ou fourchette de prix (post-debounce) | `screen` (restaurants/menu), `search_term_present` (bool), `categories`, `dietary_tags`, `price_min`, `price_max`, `result_count` | Usage des filtres (KPI secondaire) |
| `sort_applied` | Sélection d'un mode de tri | `screen`, `sort_type` (prix_asc/prix_desc/popularite), `result_count` | Usage du tri |
| `search_no_results` | Affichage de l'état "Aucun résultat" | `screen`, `active_filters`, `suggestion_shown` (bool) | Guardrail — abandon sec |
| `search_result_selected` | Clic sur un élément de la liste de résultats | `screen`, `item_id`, `active_filters_present` (bool), `position_in_list` | KPI principal — search-to-click rate |

**Non tracké volontairement :** ouverture/fermeture des panneaux de filtre (micro-interaction décorative), drag intermédiaire du curseur de prix (seule la valeur finale relâchée compte via `search_filter_applied`).

---

## Releases

### MVP
- Recherche texte libre (AC1)
- Filtres catégories multi-sélection (AC2)
- Filtres tags diététiques multi-sélection (AC3)
- Fourchette de prix (AC4)
- Combinaison de tous les filtres (AC5)
- Tri par prix croissant/décroissant (AC6)
- État "Aucun résultat" avec reset (AC8, AC9)
- Sur les deux écrans : liste restaurants ET menu d'un restaurant

**Critère de "done" :** un utilisateur peut combiner recherche + catégories + tags diététiques + prix + tri par prix sur les deux écrans, et récupère un état exploitable (reset) quand la combinaison ne donne rien.

### V2
- Tri par popularité (AC7) — conditionné à la disponibilité de la donnée de notation (cf. Dépendances)
- Suggestions intelligentes de relâchement de filtre dans l'état "Aucun résultat" (partie suggestion de l'AC8) — si la complexité de calcul des suggestions s'avère trop élevée pour le MVP, ne livrer que le message + reset, et reporter les suggestions
