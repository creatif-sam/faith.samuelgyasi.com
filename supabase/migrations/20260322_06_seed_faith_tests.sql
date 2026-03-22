-- Seed: Faith Analyzer Tests
-- Date: 2026-03-22
-- Description: Seeds faith_tests table with 4 tests and sample questions

-- =============================================
-- 1. Seed faith_tests table
-- =============================================
INSERT INTO faith_tests (id, name_en, name_fr, slug, description_en, description_fr, disclaimer_en, disclaimer_fr, published, sort_order)
VALUES 
  -- Laziness Test
  (
    gen_random_uuid(),
    'Overcoming Laziness',
    'Vaincre la Paresse',
    'overcoming-laziness',
    'Are you struggling with laziness? This test helps you evaluate your diligence and work ethic from a biblical perspective.',
    'Avez-vous du mal avec la paresse? Ce test vous aide à évaluer votre diligence et votre éthique de travail d''un point de vue biblique.',
    'This assessment is designed for self-reflection and spiritual growth. Your responses are confidential and meant to help you grow in diligence.',
    'Cette évaluation est conçue pour l''auto-réflexion et la croissance spirituelle. Vos réponses sont confidentielles et destinées à vous aider à grandir en diligence.',
    true,
    1
  ),
  
  -- Excellence Test
  (
    gen_random_uuid(),
    'Pursuing Excellence',
    'Poursuivre l''Excellence',
    'pursuing-excellence',
    'How committed are you to excellence in your faith and work? Discover areas where you can grow in pursuing God''s standard of excellence.',
    'Quel est votre engagement envers l''excellence dans votre foi et votre travail? Découvrez les domaines où vous pouvez grandir dans la poursuite de la norme d''excellence de Dieu.',
    'This test will help you identify your strengths and areas for growth in pursuing excellence. Be honest with yourself for the most accurate results.',
    'Ce test vous aidera à identifier vos forces et vos domaines de croissance dans la poursuite de l''excellence. Soyez honnête avec vous-même pour obtenir les résultats les plus précis.',
    true,
    2
  ),
  
  -- Thinking Well Test
  (
    gen_random_uuid(),
    'Thinking Well',
    'Bien Penser',
    'thinking-well',
    'Your thought life matters. This test evaluates how you align your thinking with biblical principles and renew your mind.',
    'Votre vie de pensée compte. Ce test évalue comment vous alignez votre pensée avec les principes bibliques et renouvelez votre esprit.',
    'Answer honestly about your thought patterns. This assessment is confidential and designed to help you grow in renewing your mind.',
    'Répondez honnêtement sur vos schémas de pensée. Cette évaluation est confidentielle et conçue pour vous aider à grandir dans le renouvellement de votre esprit.',
    true,
    3
  ),
  
  -- Perseverance Test
  (
    gen_random_uuid(),
    'Perseverance in Faith',
    'Persévérance dans la Foi',
    'perseverance-in-faith',
    'How well do you persevere through trials? Assess your endurance and steadfastness in following Christ.',
    'Comment persévérez-vous à travers les épreuves? Évaluez votre endurance et votre constance à suivre Christ.',
    'This test explores your spiritual resilience and commitment. Your answers will help you understand your perseverance journey.',
    'Ce test explore votre résilience spirituelle et votre engagement. Vos réponses vous aideront à comprendre votre parcours de persévérance.',
    true,
    4
  );

-- =============================================
-- 2. Seed faith_test_questions
-- =============================================

DO $$
DECLARE
  laziness_test_id UUID;
  excellence_test_id UUID;
  thinking_test_id UUID;
  perseverance_test_id UUID;
BEGIN
  -- Get test IDs
  SELECT id INTO laziness_test_id FROM faith_tests WHERE slug = 'overcoming-laziness';
  SELECT id INTO excellence_test_id FROM faith_tests WHERE slug = 'pursuing-excellence';
  SELECT id INTO thinking_test_id FROM faith_tests WHERE slug = 'thinking-well';
  SELECT id INTO perseverance_test_id FROM faith_tests WHERE slug = 'perseverance-in-faith';
  
  -- =============================================
  -- LAZINESS TEST QUESTIONS
  -- =============================================
  INSERT INTO faith_test_questions (
    test_id, question_en, question_fr,
    option_a_en, option_a_fr,
    option_b_en, option_b_fr,
    option_c_en, option_c_fr,
    correct_option, explanation_en, explanation_fr, sort_order
  ) VALUES
  
  -- Question 1
  (
    laziness_test_id,
    'How often do you procrastinate on important tasks?',
    'À quelle fréquence procrastinez-vous sur des tâches importantes?',
    'Frequently - I often put things off',
    'Fréquemment - Je remets souvent les choses à plus tard',
    'Occasionally - Sometimes when tasks are difficult',
    'Occasionnellement - Parfois lorsque les tâches sont difficiles',
    'Rarely - I tackle tasks promptly',
    'Rarement - Je m''attaque rapidement aux tâches',
    'C',
    'Proverbs 6:6-11 warns against laziness. The diligent person tackles tasks promptly rather than putting them off.',
    'Proverbes 6:6-11 met en garde contre la paresse. La personne diligente s''attaque rapidement aux tâches plutôt que de les remettre à plus tard.',
    1
  ),
  
  -- Question 2
  (
    laziness_test_id,
    'When faced with a challenging task, what is your typical response?',
    'Face à une tâche difficile, quelle est votre réponse typique?',
    'Avoid it and hope someone else handles it',
    'L''éviter et espérer que quelqu''un d''autre s''en occupe',
    'Start it but give up when it gets hard',
    'La commencer mais abandonner quand ça devient difficile',
    'Persist until completion with God''s help',
    'Persister jusqu''à l''achèvement avec l''aide de Dieu',
    'C',
    'Colossians 3:23 teaches us to work with all our heart as working for the Lord, not giving up when things get difficult.',
    'Colossiens 3:23 nous enseigne à travailler de tout notre cœur comme travaillant pour le Seigneur, sans abandonner quand les choses deviennent difficiles.',
    2
  ),
  
  -- Question 3
  (
    laziness_test_id,
    'How do you spend your free time?',
    'Comment passez-vous votre temps libre?',
    'Mostly on entertainment and leisure',
    'Principalement sur le divertissement et les loisirs',
    'A mix of rest and productive activities',
    'Un mélange de repos et d''activités productives',
    'On meaningful pursuits and spiritual growth',
    'Sur des activités significatives et la croissance spirituelle',
    'C',
    'While rest is important, Ephesians 5:15-16 calls us to make the most of every opportunity, redeeming the time wisely.',
    'Bien que le repos soit important, Éphésiens 5:15-16 nous appelle à tirer le meilleur parti de chaque opportunité, rachetant le temps avec sagesse.',
    3
  ),
  
  -- =============================================
  -- EXCELLENCE TEST QUESTIONS
  -- =============================================
  
  -- Question 1
  (
    excellence_test_id,
    'When doing your work, what standard do you aim for?',
    'En faisant votre travail, quelle norme visez-vous?',
    'Just enough to get by',
    'Juste assez pour s''en sortir',
    'Meeting expectations adequately',
    'Répondre adéquatement aux attentes',
    'The highest quality as unto the Lord',
    'La plus haute qualité comme pour le Seigneur',
    'C',
    'Colossians 3:23 calls us to work with all our heart as working for the Lord, pursuing excellence in everything.',
    'Colossiens 3:23 nous appelle à travailler de tout notre cœur comme travaillant pour le Seigneur, poursuivant l''excellence en tout.',
    1
  ),
  
  -- Question 2
  (
    excellence_test_id,
    'How do you handle constructive criticism?',
    'Comment gérez-vous la critique constructive?',
    'Defensively - I don''t like being corrected',
    'Défensivement - Je n''aime pas être corrigé',
    'Reluctantly - I accept it but don''t enjoy it',
    'À contrecœur - Je l''accepte mais je n''aime pas ça',
    'Gratefully - I see it as opportunity to grow',
    'Avec gratitude - Je le vois comme une opportunité de grandir',
    'C',
    'Proverbs 12:1 says whoever loves discipline loves knowledge. Excellence requires openness to correction and growth.',
    'Proverbes 12:1 dit que celui qui aime la discipline aime la connaissance. L''excellence exige l''ouverture à la correction et à la croissance.',
    2
  ),
  
  -- Question 3
  (
    excellence_test_id,
    'When starting a new project, how much effort do you invest in planning?',
    'Lors du démarrage d''un nouveau projet, combien d''efforts investissez-vous dans la planification?',
    'Minimal - I prefer to figure it out as I go',
    'Minimal - Je préfère comprendre au fur et à mesure',
    'Some planning but mostly improvise',
    'Un peu de planification mais principalement de l''improvisation',
    'Thorough planning and preparation',
    'Planification et préparation approfondies',
    'C',
    'Proverbs 21:5 teaches that careful planning leads to profit, while haste leads to poverty. Excellence requires preparation.',
    'Proverbes 21:5 enseigne qu''une planification minutieuse mène au profit, tandis que la hâte mène à la pauvreté. L''excellence exige de la préparation.',
    3
  ),
  
  -- =============================================
  -- THINKING WELL TEST QUESTIONS
  -- =============================================
  
  -- Question 1
  (
    thinking_test_id,
    'What occupies your mind most often?',
    'Qu''occupe votre esprit le plus souvent?',
    'Worries, fears, and negative thoughts',
    'Inquiétudes, peurs et pensées négatives',
    'A mix of positive and negative thoughts',
    'Un mélange de pensées positives et négatives',
    'Truth, praise, and things worthy of meditation',
    'Vérité, louange et choses dignes de méditation',
    'C',
    'Philippians 4:8 instructs us to think about what is true, noble, right, pure, lovely, and admirable.',
    'Philippiens 4:8 nous instruit à penser à ce qui est vrai, noble, juste, pur, aimable et digne d''éloges.',
    1
  ),
  
  -- Question 2
  (
    thinking_test_id,
    'When facing a problem, how do you typically respond?',
    'Face à un problème, comment répondez-vous généralement?',
    'Immediately assume the worst outcome',
    'Supposer immédiatement le pire résultat',
    'Worry but try to think positively',
    'M''inquiéter mais essayer de penser positivement',
    'Pray and seek God''s wisdom and perspective',
    'Prier et chercher la sagesse et la perspective de Dieu',
    'C',
    'James 1:5 promises wisdom to those who ask. Biblical thinking involves bringing our thoughts to God in prayer.',
    'Jacques 1:5 promet la sagesse à ceux qui la demandent. La pensée biblique implique d''apporter nos pensées à Dieu dans la prière.',
    2
  ),
  
  -- Question 3
  (
    thinking_test_id,
    'How often do you meditate on Scripture?',
    'À quelle fréquence méditez-vous sur l''Écriture?',
    'Rarely or never',
    'Rarement ou jamais',
    'Occasionally when I remember',
    'Occasionnellement quand je m''en souviens',
    'Daily as a regular practice',
    'Quotidiennement comme pratique régulière',
    'C',
    'Joshua 1:8 and Psalm 1:2 emphasize the importance of meditating on God''s Word day and night for success and blessing.',
    'Josué 1:8 et Psaume 1:2 soulignent l''importance de méditer sur la Parole de Dieu jour et nuit pour le succès et la bénédiction.',
    3
  ),
  
  -- =============================================
  -- PERSEVERANCE TEST QUESTIONS
  -- =============================================
  
  -- Question 1
  (
    perseverance_test_id,
    'When you face trials or difficulties, how do you respond?',
    'Lorsque vous faites face à des épreuves ou des difficultés, comment répondez-vous?',
    'I give up quickly and look for an easier path',
    'J''abandonne rapidement et cherche un chemin plus facile',
    'I struggle but sometimes give in to discouragement',
    'Je lutte mais parfois je cède au découragement',
    'I persevere, knowing trials produce character',
    'Je persévère, sachant que les épreuves produisent le caractère',
    'C',
    'James 1:2-4 teaches us to consider it pure joy when we face trials, because testing produces perseverance and maturity.',
    'Jacques 1:2-4 nous enseigne à considérer comme une joie pure quand nous faisons face à des épreuves, car l''épreuve produit la persévérance et la maturité.',
    1
  ),
  
  -- Question 2
  (
    perseverance_test_id,
    'How committed are you to your spiritual disciplines?',
    'Quel est votre engagement envers vos disciplines spirituelles?',
    'I start strong but often quit',
    'Je commence fort mais j''abandonne souvent',
    'I''m inconsistent but keep trying',
    'Je suis inconstant mais je continue d''essayer',
    'I maintain consistent habits by God''s grace',
    'Je maintiens des habitudes cohérentes par la grâce de Dieu',
    'C',
    'Hebrews 10:36 reminds us that we need to persevere so that when we have done the will of God, we will receive what He has promised.',
    'Hébreux 10:36 nous rappelle que nous avons besoin de persévérance afin qu''après avoir accompli la volonté de Dieu, nous obtenions ce qui nous est promis.',
    2
  ),
  
  -- Question 3
  (
    perseverance_test_id,
    'When your faith is tested, what sustains you?',
    'Quand votre foi est mise à l''épreuve, qu''est-ce qui vous soutient?',
    'My own strength and willpower',
    'Ma propre force et ma volonté',
    'Encouragement from others mainly',
    'Principalement l''encouragement des autres',
    'God''s promises and His unchanging faithfulness',
    'Les promesses de Dieu et Sa fidélité immuable',
    'C',
    'Hebrews 12:1-2 calls us to fix our eyes on Jesus, the author and perfecter of our faith, who persevered through the cross.',
    'Hébreux 12:1-2 nous appelle à fixer les yeux sur Jésus, l''auteur et le consommateur de notre foi, qui a persévéré à travers la croix.',
    3
  );
  
END $$;

-- =============================================
-- 3. Verification
-- =============================================
-- Check that tests were created
SELECT slug, name_en, name_fr, published FROM faith_tests ORDER BY sort_order;

-- Check question counts per test
SELECT 
  ft.name_en,
  COUNT(ftq.id) as question_count
FROM faith_tests ft
LEFT JOIN faith_test_questions ftq ON ft.id = ftq.test_id
GROUP BY ft.id, ft.name_en
ORDER BY ft.sort_order;
