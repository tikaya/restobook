-- ============================================================
-- RESTOBOOK — Jeu de données de test (avec hashes bcrypt)
-- ============================================================
-- 🔑 MOTS DE PASSE EN CLAIR :
--    sophie@restobook.fr  → admin123    (GÉRANT / admin)
--    marc@restobook.fr    → cuisine123
--    julie@restobook.fr   → serveur123
--    ali@mail.com         → client123
--    sara@mail.com        → client123
--    karim@mail.com       → client123
-- ============================================================

-- 1. CATEGORIES
INSERT INTO categorie (nom_categorie, ordre_affichage_categorie) VALUES
('Entrées', 1),
('Plats', 2),
('Desserts', 3),
('Boissons', 4);

-- 2. TABLES DU RESTAURANT
INSERT INTO table_resto (numero_table, capacite_table, emplacement_table) VALUES
(1, 2, 'terrasse'),
(2, 4, 'interieur'),
(3, 4, 'interieur'),
(4, 6, 'interieur'),
(5, 8, 'salon_prive'),
(6, 2, 'terrasse');

-- 3. EMPLOYES (mots de passe hashés bcrypt cost 10)
INSERT INTO employe (email_employe, mdp_employe, nom_employe, prenom_employe, role_employe) VALUES
('sophie@restobook.fr', '$2b$10$OvcsbXcQpQ3cm7KpVONKGeRNXI9UEFxzMUFEgyVcKQ/qLianLKA9.', 'Martin', 'Sophie', 'gerant'),
('marc@restobook.fr',   '$2b$10$f4cXKLOfr/No.o9DPXvOG.CTDPOnHoF05AASi2Ma02GPDohCM6XP2', 'Dupont', 'Marc', 'cuisine'),
('julie@restobook.fr',  '$2b$10$KUCMkqixYvkjN3/yU0aytOA3wl7BTZ.p.IeJotJBp4KJ5SjSJ.bXe', 'Bernard', 'Julie', 'serveur');

-- 4. HORAIRES
INSERT INTO horaire (jour_semaine, heure_ouverture, heure_fermeture, est_ferme) VALUES
('lundi', NULL, NULL, TRUE),
('mardi', '12:00', '14:30', FALSE),
('mercredi', '12:00', '14:30', FALSE),
('jeudi', '12:00', '14:30', FALSE),
('vendredi', '12:00', '14:30', FALSE),
('samedi', '12:00', '15:00', FALSE),
('dimanche', '12:00', '15:00', FALSE);

-- 5. CLIENTS (mots de passe hashés bcrypt cost 10)
INSERT INTO client (email_client, mdp_client, nom_client, prenom_client, telephone_client) VALUES
('ali@mail.com',   '$2b$10$.7/rGNSeGACZ2dK75vE9n.wyB6iUNZzb5kXaQM2xZhxmHB.Tu9t0q', 'Benali', 'Ali', '0612345678'),
('sara@mail.com',  '$2b$10$.7/rGNSeGACZ2dK75vE9n.wyB6iUNZzb5kXaQM2xZhxmHB.Tu9t0q', 'Dubois', 'Sara', '0698765432'),
('karim@mail.com', '$2b$10$.7/rGNSeGACZ2dK75vE9n.wyB6iUNZzb5kXaQM2xZhxmHB.Tu9t0q', 'Hadid', 'Karim', '0611223344');

-- 6. PLATS
INSERT INTO item_menu (nom_item_menu, description_item_menu, prix_item_menu, allergenes_item_menu, disponible_item_menu, id_categorie) VALUES
('Tartare de saumon', 'Saumon frais, avocat, agrumes', 14.50, 'poisson', TRUE, 1),
('Soupe à l''oignon', 'Gratinée au fromage', 9.00, 'gluten, lait', TRUE, 1),
('Filet de boeuf', 'Sauce au poivre, légumes de saison', 28.00, NULL, TRUE, 2),
('Risotto aux champignons', 'Champignons sauvages, parmesan', 22.00, 'lait', TRUE, 2),
('Pavé de thon', 'Sésame, wok de légumes', 24.00, 'poisson, sésame', TRUE, 2),
('Crème brûlée', 'Vanille de Madagascar', 10.00, 'lait, oeuf', TRUE, 3),
('Fondant au chocolat', 'Chocolat noir 70%, coeur coulant', 12.00, 'gluten, lait, oeuf', TRUE, 3),
('Eau minérale', 'Evian 75cl', 5.00, NULL, TRUE, 4),
('Vin rouge maison', 'Côtes du Rhône, 75cl', 18.00, 'sulfites', TRUE, 4);

-- 7. RESERVATIONS
INSERT INTO reservation (date_reservation, heure_reservation, nb_personnes, demandes_speciales, statut_reservation, id_client, id_table, id_employe) VALUES
('2026-03-28', '20:00', 4, 'Anniversaire — bougie sur le dessert', 'confirmee', 1, 2, 3),
('2026-03-28', '19:30', 2, NULL, 'confirmee', 2, 1, 3),
('2026-03-29', '12:30', 6, 'Allergie aux noix', 'confirmee', 3, 4, NULL),
('2026-03-25', '20:00', 2, NULL, 'honoree', 1, 6, 3),
('2026-03-20', '19:00', 4, 'Terrasse si possible', 'no_show', 2, 2, 3);

-- 8. AVIS
INSERT INTO avis (note_avis, commentaire_avis, statut_avis, id_client, id_reservation) VALUES
(5, 'Excellent repas ! Le filet de boeuf était parfait.', 'approuve', 1, 4),
(4, 'Très bon, service un peu lent mais cuisine au top.', 'approuve', 2, 5),
(3, 'Correct mais un peu bruyant en salle.', 'en_attente', 3, NULL);

-- 9. COMMANDES
INSERT INTO commander (id_reservation, id_item_menu, quantite_commander) VALUES
(1, 1, 2),
(1, 3, 1),
(1, 4, 1),
(1, 7, 2),
(2, 2, 1),
(2, 5, 1),
(2, 6, 1),
(4, 3, 2),
(4, 9, 1);

-- 10. MESSAGES CONTACT
INSERT INTO message_contact (nom_expediteur, email_expediteur, sujet_message, contenu_message) VALUES
('Pierre Moreau', 'pierre@mail.com', 'Privatisation', 'Bonjour, serait-il possible de privatiser le salon pour un événement le 15 avril ?'),
('Anne Claire', 'anne@mail.com', 'Allergie', 'Ma fille est allergique aux arachides. Pouvez-vous adapter le menu ?');