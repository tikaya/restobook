-- ============================================================
-- RESTOBOOK - Modèle Physique de Données (MPD)
-- SGBD : PostgreSQL
-- Généré depuis le MLD (Modèle Logique de Données)
-- Actions référentielles : Date (1981), VLDB Cannes
-- ============================================================

-- Suppression des tables si elles existent (ordre inverse)
DROP TABLE IF EXISTS commander      CASCADE;
DROP TABLE IF EXISTS avis            CASCADE;
DROP TABLE IF EXISTS reservation     CASCADE;
DROP TABLE IF EXISTS item_menu       CASCADE;
DROP TABLE IF EXISTS client          CASCADE;
DROP TABLE IF EXISTS message_contact CASCADE;
DROP TABLE IF EXISTS horaire         CASCADE;
DROP TABLE IF EXISTS employe         CASCADE;
DROP TABLE IF EXISTS table_resto     CASCADE;
DROP TABLE IF EXISTS categorie       CASCADE;

-- ============================================
-- 1. CATEGORIE (table parente)
-- ============================================
CREATE TABLE categorie (
    id_categorie             SERIAL PRIMARY KEY,
    nom_categorie            VARCHAR(50) NOT NULL UNIQUE,
    ordre_affichage_categorie INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- 2. TABLE_RESTO (table parente)
-- ============================================
CREATE TABLE table_resto (
    id_table            SERIAL PRIMARY KEY,
    numero_table        INTEGER NOT NULL UNIQUE,
    capacite_table      INTEGER NOT NULL
        CHECK (capacite_table > 0),
    emplacement_table   VARCHAR(50) NOT NULL
        CHECK (emplacement_table IN
            ('interieur','terrasse','salon_prive')),
    disponible_table BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 3. EMPLOYE (table parente).
-- ============================================
CREATE TABLE employe (
    id_employe      SERIAL PRIMARY KEY,
    email_employe   VARCHAR(150) NOT NULL UNIQUE,
    mdp_employe     VARCHAR(255) NOT NULL,
    nom_employe     VARCHAR(50) NOT NULL,
    prenom_employe  VARCHAR(50) NOT NULL,
    role_employe    VARCHAR(20) NOT NULL DEFAULT 'serveur'
    
        CHECK (role_employe IN
            ('gerant','serveur','cuisine'))
);

-- ============================================
-- 4. HORAIRE (table indépendante)
-- ============================================
CREATE TABLE horaire (
    id_horaire       SERIAL PRIMARY KEY,
    jour_semaine     VARCHAR(10) NOT NULL UNIQUE
        CHECK (jour_semaine IN
            ('lundi','mardi','mercredi','jeudi',
             'vendredi','samedi','dimanche')),
    heure_ouverture  TIME,
    heure_fermeture  TIME,
    est_ferme        BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================
-- 5. MESSAGE_CONTACT (table indépendante)
-- ============================================
CREATE TABLE message_contact (
    id_message           SERIAL PRIMARY KEY,
    nom_expediteur       VARCHAR(100) NOT NULL,
    email_expediteur     VARCHAR(150) NOT NULL,
    sujet_message        VARCHAR(200) NOT NULL,
    contenu_message      TEXT NOT NULL,
    date_heure_reception TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. CLIENT (table parente)
-- ============================================
CREATE TABLE client (
    id_client                SERIAL PRIMARY KEY,
    email_client             VARCHAR(150) NOT NULL UNIQUE,
    mdp_client               VARCHAR(255) NOT NULL,
    nom_client               VARCHAR(50) NOT NULL,
    prenom_client            VARCHAR(50) NOT NULL,
    telephone_client         VARCHAR(20),
    date_inscription_client  TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,
    doit_changer_mdp_client  BOOLEAN DEFAULT FALSE,
    compte_supprime          BOOLEAN DEFAULT FALSE,
    date_suppression_compte  TIMESTAMP
);

-- ============================================
-- 7. ITEM_MENU (FK → CATEGORIE : RESTRICT)
-- ============================================
CREATE TABLE item_menu (
    id_item_menu          SERIAL PRIMARY KEY,
    nom_item_menu         VARCHAR(100) NOT NULL,
    description_item_menu TEXT,
    prix_item_menu        NUMERIC(10,2) NOT NULL
        CHECK (prix_item_menu > 0),
    image_item_menu       VARCHAR(255),
    allergenes_item_menu  TEXT,
    disponible_item_menu  BOOLEAN DEFAULT TRUE,

    -- RESTRICT : on ne supprime pas une catégorie avec des plats
    id_categorie INTEGER NOT NULL,
    CONSTRAINT fk_item_categorie
        FOREIGN KEY (id_categorie)
        REFERENCES categorie(id_categorie)
        ON DELETE RESTRICT
);

-- ============================================
-- 8. RESERVATION (3 FK : CASCADE, RESTRICT, SET NULL)
-- ============================================
CREATE TABLE reservation (
    id_reservation             SERIAL PRIMARY KEY,
    date_reservation            DATE NOT NULL,
    heure_reservation           TIME NOT NULL,
    nb_personnes               INTEGER NOT NULL
        CHECK (nb_personnes > 0),
    demandes_speciales         VARCHAR(255),
    statut_reservation         VARCHAR(20) NOT NULL
        DEFAULT 'confirmee'
        CHECK (statut_reservation IN
            ('confirmee','annulee','honoree','no_show')),
    date_heure_creation_reservation TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    -- CASCADE : client part → ses réservations disparaissent
    id_client INTEGER NOT NULL,
    CONSTRAINT fk_reservation_client
        FOREIGN KEY (id_client)
        REFERENCES client(id_client)
        ON DELETE CASCADE,

    -- RESTRICT : on ne supprime pas une table avec réservations
    id_table INTEGER NOT NULL,
    CONSTRAINT fk_reservation_table
        FOREIGN KEY (id_table)
        REFERENCES table_resto(id_table)
        ON DELETE RESTRICT,

    -- SET NULL : employé part → réservation reste, lien coupé
    id_employe INTEGER,              -- NULLABLE !
    CONSTRAINT fk_reservation_employe
        FOREIGN KEY (id_employe)
        REFERENCES employe(id_employe)
        ON DELETE SET NULL
);

-- ============================================
-- 9. AVIS (2 FK : CASCADE, SET NULL)
-- ============================================
CREATE TABLE avis (
    id_avis            SERIAL PRIMARY KEY,
    note_avis          SMALLINT NOT NULL
        CHECK (note_avis >= 1 AND note_avis <= 5),
    commentaire_avis   TEXT,
    date_avis          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut_avis        VARCHAR(20) NOT NULL
        DEFAULT 'en_attente'
        CHECK (statut_avis IN
            ('en_attente','approuve','rejete')),

    -- CASCADE : client part → ses avis disparaissent
    id_client INTEGER NOT NULL,
    CONSTRAINT fk_avis_client
        FOREIGN KEY (id_client)
        REFERENCES client(id_client)
        ON DELETE CASCADE,

    -- SET NULL : réservation supprimée → avis reste, lien coupé
    id_reservation INTEGER,           -- NULLABLE !
    CONSTRAINT fk_avis_reservation
        FOREIGN KEY (id_reservation)
        REFERENCES reservation(id_reservation)
        ON DELETE SET NULL
);

-- ============================================
-- 10. COMMANDER (PK composite + 2 FK : CASCADE, RESTRICT)
--     Table d'association N:N
--     PK composite = double nature PK + FK (axiomes 1 + 2 de Codd)
-- ============================================
CREATE TABLE commander (
    -- Clé primaire composite (les deux FK ensemble)
    id_reservation INTEGER NOT NULL,
    id_item_menu   INTEGER NOT NULL,

    -- Propriété de l'association
    quantite_commander INTEGER NOT NULL
        CHECK (quantite_commander > 0),

    -- PK composite (axiome 1 : intégrité d'entité)
    PRIMARY KEY (id_reservation, id_item_menu),

    -- CASCADE : réservation supprimée → commandes aussi
    CONSTRAINT fk_commander_reservation
        FOREIGN KEY (id_reservation)
        REFERENCES reservation(id_reservation)
        ON DELETE CASCADE,

    -- RESTRICT : on ne supprime pas un plat commandé
    CONSTRAINT fk_commander_item
        FOREIGN KEY (id_item_menu)
        REFERENCES item_menu(id_item_menu)
        ON DELETE RESTRICT
);