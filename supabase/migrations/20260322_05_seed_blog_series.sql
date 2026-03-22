-- Seed: Blog Series with Example Posts
-- Date: 2026-03-22
-- Description: Seeds blog_series table with 3 series and 3 example posts for each

-- =============================================
-- 1. Seed blog_series table
-- =============================================
INSERT INTO blog_series (id, name_en, name_fr, slug, description_en, description_fr, image_url, show_dates, published, sort_order)
VALUES 
  -- Excellence Series
  (
    gen_random_uuid(),
    'Excellence',
    'Excellence',
    'excellence',
    'A series exploring the pursuit of excellence in faith and life, examining biblical principles for living with purpose and integrity.',
    'Une série explorant la poursuite de l''excellence dans la foi et la vie, examinant les principes bibliques pour vivre avec but et intégrité.',
    NULL,
    true,
    true,
    1
  ),
  
  -- Meditation Series
  (
    gen_random_uuid(),
    'Meditation',
    'Méditation',
    'meditation',
    'Deep dives into biblical meditation and contemplative practices that draw us closer to God through His Word.',
    'Plongées profondes dans la méditation biblique et les pratiques contemplatives qui nous rapprochent de Dieu par Sa Parole.',
    NULL,
    true,
    true,
    2
  ),
  
  -- Holiness Series
  (
    gen_random_uuid(),
    'Holiness',
    'Sainteté',
    'holiness',
    'Understanding God''s call to holiness and how to pursue sanctification in our daily walk with Christ.',
    'Comprendre l''appel de Dieu à la sainteté et comment poursuivre la sanctification dans notre marche quotidienne avec Christ.',
    NULL,
    true,
    true,
    3
  );

-- =============================================
-- 2. Seed blog_posts with examples for each series
-- =============================================

-- Get series IDs for reference (we'll use these in the blog_posts inserts)
DO $$
DECLARE
  excellence_id UUID;
  meditation_id UUID;
  holiness_id UUID;
BEGIN
  -- Get series IDs
  SELECT id INTO excellence_id FROM blog_series WHERE slug = 'excellence';
  SELECT id INTO meditation_id FROM blog_series WHERE slug = 'meditation';
  SELECT id INTO holiness_id FROM blog_series WHERE slug = 'holiness';
  
  -- Excellence Series Posts
  INSERT INTO blog_posts (
    title, title_fr, slug, category, published, excerpt, excerpt_fr,
    content, content_fr, read_time_minutes, featured_image_url,
    series_id, series_order
  ) VALUES
  (
    'The Foundation of Excellence: God''s Standard',
    'Le Fondement de l''Excellence : La Norme de Dieu',
    'foundation-of-excellence-gods-standard',
    'faith',
    true,
    'Discover how God''s standard of excellence transcends human achievement and transforms our pursuit of greatness.',
    'Découvrez comment la norme d''excellence de Dieu transcende les réalisations humaines et transforme notre poursuite de la grandeur.',
    'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters. (Colossians 3:23)',
    'Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes. (Colossiens 3:23)',
    5,
    NULL,
    excellence_id,
    1
  ),
  (
    'Excellence in Character: The Heart of the Matter',
    'L''Excellence du Caractère : Le Cœur du Sujet',
    'excellence-in-character-heart-of-the-matter',
    'faith',
    true,
    'True excellence begins with character transformation. Learn how God shapes our character to reflect His glory.',
    'La véritable excellence commence par la transformation du caractère. Apprenez comment Dieu façonne notre caractère pour refléter Sa gloire.',
    'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. (Galatians 5:22-23)',
    'Mais le fruit de l''Esprit, c''est l''amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance. (Galates 5:22-23)',
    6,
    NULL,
    excellence_id,
    2
  ),
  (
    'Sustaining Excellence: The Power of Consistency',
    'Maintenir l''Excellence : La Puissance de la Cohérence',
    'sustaining-excellence-power-of-consistency',
    'wisdom',
    true,
    'Excellence is not a one-time achievement but a daily commitment. Explore biblical principles for consistent godly living.',
    'L''excellence n''est pas une réalisation unique mais un engagement quotidien. Explorez les principes bibliques pour une vie pieuse cohérente.',
    'Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord. (1 Corinthians 15:58)',
    'Ainsi, mes frères bien-aimés, soyez fermes, inébranlables, travaillant de mieux en mieux à l''œuvre du Seigneur. (1 Corinthiens 15:58)',
    7,
    NULL,
    excellence_id,
    3
  ),
  
  -- Meditation Series Posts
  (
    'Biblical Meditation: More Than Mindfulness',
    'La Méditation Biblique : Plus Que la Pleine Conscience',
    'biblical-meditation-more-than-mindfulness',
    'faith',
    true,
    'Discover the ancient practice of biblical meditation and how it differs from modern mindfulness techniques.',
    'Découvrez l''ancienne pratique de la méditation biblique et comment elle diffère des techniques modernes de pleine conscience.',
    'Keep this Book of the Law always on your lips; meditate on it day and night. (Joshua 1:8)',
    'Que ce livre de la loi ne s''éloigne point de ta bouche; médite-le jour et nuit. (Josué 1:8)',
    8,
    NULL,
    meditation_id,
    1
  ),
  (
    'The Art of Dwelling: Meditating on God''s Word',
    'L''Art de Demeurer : Méditer sur la Parole de Dieu',
    'art-of-dwelling-meditating-on-gods-word',
    'faith',
    true,
    'Learn practical steps to meditate deeply on Scripture and allow God''s Word to transform your mind.',
    'Apprenez des étapes pratiques pour méditer profondément sur l''Écriture et permettre à la Parole de Dieu de transformer votre esprit.',
    'Blessed is the one who does not walk in step with the wicked... but whose delight is in the law of the Lord, and who meditates on his law day and night. (Psalm 1:1-2)',
    'Heureux l''homme qui ne marche pas selon le conseil des méchants... Mais qui trouve son plaisir dans la loi de l''Éternel, et qui la médite jour et nuit. (Psaume 1:1-2)',
    9,
    NULL,
    meditation_id,
    2
  ),
  (
    'From Meditation to Transformation',
    'De la Méditation à la Transformation',
    'from-meditation-to-transformation',
    'wisdom',
    true,
    'See how consistent meditation on God''s Word leads to lasting spiritual transformation and renewal.',
    'Voyez comment la méditation constante sur la Parole de Dieu conduit à une transformation spirituelle durable et au renouvellement.',
    'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. (Romans 12:2)',
    'Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l''intelligence. (Romains 12:2)',
    7,
    NULL,
    meditation_id,
    3
  ),
  
  -- Holiness Series Posts
  (
    'Called to Be Holy: Understanding God''s Call',
    'Appelés à Être Saints : Comprendre l''Appel de Dieu',
    'called-to-be-holy-understanding-gods-call',
    'faith',
    true,
    'Explore what it means to be called to holiness and why God desires His children to be set apart.',
    'Explorez ce que signifie être appelé à la sainteté et pourquoi Dieu désire que Ses enfants soient mis à part.',
    'But just as he who called you is holy, so be holy in all you do; for it is written: "Be holy, because I am holy." (1 Peter 1:15-16)',
    'Mais, puisque celui qui vous a appelés est saint, vous aussi soyez saints dans toute votre conduite, selon qu''il est écrit: Vous serez saints, car je suis saint. (1 Pierre 1:15-16)',
    6,
    NULL,
    holiness_id,
    1
  ),
  (
    'Practical Holiness: Living Set Apart Daily',
    'Sainteté Pratique : Vivre à Part Chaque Jour',
    'practical-holiness-living-set-apart-daily',
    'wisdom',
    true,
    'Holiness is not abstract theology—it''s practical daily living. Learn how to walk in holiness in everyday situations.',
    'La sainteté n''est pas une théologie abstraite—c''est une vie quotidienne pratique. Apprenez à marcher dans la sainteté dans les situations quotidiennes.',
    'Make every effort to live in peace with everyone and to be holy; without holiness no one will see the Lord. (Hebrews 12:14)',
    'Recherchez la paix avec tous, et la sanctification, sans laquelle personne ne verra le Seigneur. (Hébreux 12:14)',
    8,
    NULL,
    holiness_id,
    2
  ),
  (
    'The Journey of Sanctification: Growing in Holiness',
    'Le Voyage de la Sanctification : Grandir en Sainteté',
    'journey-of-sanctification-growing-in-holiness',
    'faith',
    true,
    'Holiness is a journey, not a destination. Understand the process of sanctification and how God works in us.',
    'La sainteté est un voyage, pas une destination. Comprenez le processus de sanctification et comment Dieu travaille en nous.',
    'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here! (2 Corinthians 5:17)',
    'Si quelqu''un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles. (2 Corinthiens 5:17)',
    7,
    NULL,
    holiness_id,
    3
  );
  
END $$;

-- =============================================
-- 3. Verification
-- =============================================
-- Check that series were created
SELECT slug, name_en, name_fr, published FROM blog_series ORDER BY sort_order;

-- Check that posts were created and linked to series
SELECT 
  bp.title,
  bs.name_en as series_name,
  bp.series_order
FROM blog_posts bp
JOIN blog_series bs ON bp.series_id = bs.id
ORDER BY bs.slug, bp.series_order;
