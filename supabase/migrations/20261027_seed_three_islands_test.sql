-- Seeds the "Three Islands of Life" reflection test (inspired by John C.
-- Maxwell's Intentional Living) as the first faith_tests row of type
-- 'reflection'. Ported from the standalone prototype at repo root
-- (index.html) so it's editable in /admin going forward instead of living
-- in a disconnected static file.

with new_test as (
  insert into public.faith_tests (
    name_en, name_fr, slug, test_type,
    description_en, description_fr,
    disclaimer_en, disclaimer_fr,
    published, sort_order
  ) values (
    'Three Islands of Life', 'Les trois îles de la vie', 'three-islands-of-life', 'reflection',
    'Answer 15 questions about your everyday choices to see which island best describes your last 90 days: Good Intentions, Intentional Living, or Significance.',
    'Répondez à 15 questions sur vos choix quotidiens pour découvrir quelle île décrit le mieux vos 90 derniers jours : Bonnes intentions, Vie intentionnelle ou Vie porteuse de sens.',
    'This is a self-reflection exercise, not a scientifically validated psychological assessment. Your island is a snapshot of your reported habits, not a permanent identity.',
    'Cet exercice favorise la réflexion personnelle ; ce n''est pas un test psychologique scientifiquement validé. Votre île représente vos habitudes déclarées à ce moment, et non une identité permanente.',
    true, 0
  )
  returning id
),
profiles as (
  insert into public.faith_test_profiles (test_id, name_en, name_fr, interpretation_en, interpretation_fr, advice_en, advice_fr, sort_order)
  select id, v.name_en, v.name_fr, v.interp_en, v.interp_fr, v.advice_en, v.advice_fr, v.sort_order
  from new_test, (values
    (0, 'Good Intentions', 'Bonnes intentions',
     'You have aspirations, but your next step is to translate them into concrete action.',
     'Vous avez des aspirations, mais votre prochaine étape consiste à les transformer en actions concrètes.',
     'Choose one important goal and complete one small action toward it every day for 30 days.',
     'Choisissez un objectif important et accomplissez une petite action chaque jour pendant 30 jours.'),
    (1, 'Intentional Living', 'Vie intentionnelle',
     'You are moving from intentions into action. Build repeatable habits and measure outcomes.',
     'Vous passez des intentions à l''action. Développez des habitudes durables et mesurez vos résultats.',
     'Turn one useful action into a reliable daily habit and track the outcome.',
     'Transformez une action utile en habitude quotidienne et suivez ses résultats.'),
    (2, 'Significance', 'Vie porteuse de sens',
     'Your responses reflect consistent action and meaningful results. Sustain your habits and deepen your contribution.',
     'Vos réponses reflètent des actions régulières et des résultats significatifs. Préservez vos habitudes et approfondissez votre contribution.',
     'Choose one person or community to benefit from your strengths and build a sustainable way to contribute.',
     'Choisissez une personne ou une communauté à laquelle vous pouvez apporter votre contribution de manière durable.')
  ) as v(sort_order, name_en, name_fr, interp_en, interp_fr, advice_en, advice_fr)
  returning id, test_id, sort_order
),
q as (
  select
    new_test.id as test_id,
    (select id from profiles where sort_order = 0) as p1,
    (select id from profiles where sort_order = 1) as p2,
    (select id from profiles where sort_order = 2) as p3
  from new_test
)
insert into public.faith_test_questions (
  test_id, question_en, question_fr,
  option_a_en, option_a_fr, option_a_profile_id,
  option_b_en, option_b_fr, option_b_profile_id,
  option_c_en, option_c_fr, option_c_profile_id,
  sort_order
)
select q.test_id, v.question_en, v.question_fr,
  v.a_en, v.a_fr, q.p1,
  v.b_en, v.b_fr, q.p2,
  v.c_en, v.c_fr, q.p3,
  v.sort_order
from q, (values
  (0, 'When you have an important goal, what do you usually do?', 'Lorsque vous avez un objectif important, que faites-vous généralement ?',
   'I think about it but rarely start.', 'J''y pense, mais je commence rarement.',
   'I create a plan and take action.', 'J''élabore un plan et je passe à l''action.',
   'I consistently achieve results and sustain them.', 'J''obtiens régulièrement des résultats et je les maintiens.'),
  (1, 'How do you approach your dreams?', 'Comment abordez-vous vos rêves ?',
   'I wish they would come true.', 'J''espère qu''ils se réaliseront.',
   'I turn them into goals.', 'Je les transforme en objectifs.',
   'I turn them into meaningful achievements.', 'Je les transforme en réalisations qui ont du sens.'),
  (2, 'When do you take action?', 'Quand passez-vous à l''action ?',
   'Someday, when conditions improve.', 'Un jour, quand les conditions seront meilleures.',
   'Today, even if I start small.', 'Aujourd''hui, même en commençant modestement.',
   'Every day, through established routines.', 'Chaque jour, grâce à des routines établies.'),
  (3, 'How do you handle big ambitions?', 'Comment gérez-vous vos grandes ambitions ?',
   'I imagine what could happen.', 'J''imagine ce qui pourrait arriver.',
   'I develop a strategy.', 'J''élabore une stratégie.',
   'I execute, evaluate and follow through.', 'J''exécute, j''évalue et je vais jusqu''au bout.'),
  (4, 'What describes your commitments?', 'Comment décririez-vous vos engagements ?',
   'I hope things work out.', 'J''espère que tout ira bien.',
   'I make definite decisions.', 'Je prends des décisions fermes.',
   'I consistently honor my decisions.', 'Je respecte constamment mes décisions.'),
  (5, 'How do you respond to problems?', 'Comment réagissez-vous face aux problèmes ?',
   'I wait for things to change.', 'J''attends que les choses changent.',
   'I actively seek solutions.', 'Je cherche activement des solutions.',
   'I anticipate and prevent problems.', 'J''anticipe et je préviens les problèmes.'),
  (6, 'How often do you work on self-improvement?', 'À quelle fréquence travaillez-vous sur votre développement personnel ?',
   'Occasionally, when motivated.', 'De temps en temps, quand je suis motivé(e).',
   'Regularly, with intentional effort.', 'Régulièrement, avec intention.',
   'Habitually, as part of my lifestyle.', 'Habituellement, cela fait partie de mon mode de vie.'),
  (7, 'What usually drives your behavior?', 'Qu''est-ce qui guide le plus souvent votre comportement ?',
   'My emotions and mood.', 'Mes émotions et mon humeur.',
   'My discipline and decisions.', 'Ma discipline et mes décisions.',
   'My established habits and values.', 'Mes habitudes et mes valeurs.'),
  (8, 'When you see something that needs to change, what do you do?', 'Lorsque vous voyez quelque chose à changer, que faites-vous ?',
   'I think somebody should do something.', 'Je pense que quelqu''un devrait agir.',
   'I decide that I will do something.', 'Je décide que je vais agir.',
   'I take responsibility and actually do it.', 'Je prends mes responsabilités et j''agis réellement.'),
  (9, 'What best describes your life direction?', 'Quelle phrase décrit le mieux votre orientation actuelle ?',
   'I am mostly trying to survive.', 'J''essaie surtout de survivre au quotidien.',
   'I am working toward success.', 'Je travaille à ma réussite.',
   'I am creating meaning and positive impact.', 'Je cherche à donner du sens à ma vie et à avoir un impact positif.'),
  (10, 'What happens after a setback?', 'Que se passe-t-il après un échec ?',
   'I often stop and lose momentum.', 'Je m''arrête souvent et je perds mon élan.',
   'I adjust my plan and try again.', 'J''adapte mon plan et je réessaie.',
   'I use established systems to recover and progress.', 'Je m''appuie sur des méthodes établies pour rebondir et progresser.'),
  (11, 'How do you measure progress?', 'Comment mesurez-vous vos progrès ?',
   'By what I want to achieve.', 'Par ce que je souhaite accomplir.',
   'By actions and milestones completed.', 'Par les actions et les étapes réalisées.',
   'By sustained results and positive impact.', 'Par les résultats durables et l''impact positif.'),
  (12, 'How do you manage your time?', 'Comment gérez-vous votre temps ?',
   'I respond to whatever feels urgent.', 'Je réagis surtout aux urgences.',
   'I schedule time for my priorities.', 'Je réserve du temps à mes priorités.',
   'My daily routines protect what matters most.', 'Mes routines quotidiennes protègent ce qui compte le plus.'),
  (13, 'What happens when you achieve a goal?', 'Que se passe-t-il lorsque vous atteignez un objectif ?',
   'I often lose direction afterward.', 'Je perds souvent ma direction ensuite.',
   'I set another goal and take action.', 'Je fixe un nouvel objectif et j''agis.',
   'I maintain my results and create further value.', 'Je maintiens mes acquis et crée davantage de valeur.'),
  (14, 'Which statement best describes your current reality?', 'Quelle phrase décrit le mieux votre réalité actuelle ?',
   'I have more intentions than actions.', 'J''ai plus d''intentions que d''actions.',
   'I am actively building the life I want.', 'Je construis activement la vie que je souhaite.',
   'My habits consistently produce meaningful results.', 'Mes habitudes produisent régulièrement des résultats significatifs.')
) as v(sort_order, question_en, question_fr, a_en, a_fr, b_en, b_fr, c_en, c_fr);
