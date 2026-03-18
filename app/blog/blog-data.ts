// Bilingual blog post data for the Faith Journal
// Each post has English and French content.

export type Category = "theology" | "prayer" | "scripture" | "discipleship" | "testimony" | "reflection";

export interface BilingualPost {
  slug: string;
  category: Category;
  date: string;
  readTime: number;
  en: { title: string; excerpt: string; content: string };
  fr: { title: string; excerpt: string; content: string };
}

export const blogPosts: BilingualPost[] = [
  {
    slug: "purpose-meets-patience",
    category: "testimony",
    date: "2026-02-10",
    readTime: 7,
    en: {
      title: "When Purpose Meets Patience: Lessons from Four Fully-Funded Scholarships",
      excerpt: "Four scholarships were not coincidences. They were confirmations — evidence that diligence and surrender working together open doors no human hand alone could unlock.",
      content: `<p>There is a verse I have returned to more times than I can count: <em>"Commit to the Lord whatever you do, and he will establish your plans."</em> — Proverbs 16:3.</p>
<p>When I received my first fully-funded scholarship from the Government of Ghana, I was grateful but unsure. When the second arrived — from Golden Star Gold Mines — I started to see a pattern. By the time the third (IBN ROCHD) and fourth (the Excellence Award at UM6P) came, I understood something profound: provision is not accidental. Purpose has a way of announcing itself through open doors.</p>
<h2>The Waiting Room</h2>
<p>Between each scholarship, there was a waiting room — applications, rejections, uncertainty. But the pattern I noticed was this: the seasons of waiting were not wasted. They were preparation. Every challenge I faced in those seasons deepened something in me that the scholarship alone couldn't build: resilience, humility, and dependence on God rather than on my own intelligence.</p>
<h2>What Purpose and Patience Teach Together</h2>
<p>Purpose and patience are not opposites. They are partners. Purpose gives you direction; patience gives you character for the journey. The scholarship was not just financial provision — it was a testimony. And testimonies are meant to be shared.</p>
<blockquote><p>"For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11</p></blockquote>
<p>If you are in a waiting room right now, know this: the waiting is not wasted. God is not slow; He is precise. Trust the process. The scholarship of your life is coming — not necessarily in the form you expect, but in the form you need.</p>`,
    },
    fr: {
      title: "Quand le But Rencontre la Patience : Leçons de Quatre Bourses Intégralement Financées",
      excerpt: "Quatre bourses n'étaient pas des coïncidences. C'étaient des confirmations — la preuve que la diligence et l'abandon combinés ouvrent des portes qu'aucune main humaine seule ne pourrait déverrouiller.",
      content: `<p>Il y a un verset auquel je reviens plus de fois que je ne peux compter : <em>« Recommande à l'Éternel tes œuvres, et tes projets réussiront. »</em> — Proverbes 16:3.</p>
<p>Quand j'ai reçu ma première bourse entièrement financée du Gouvernement du Ghana, j'étais reconnaissant mais incertain. Quand la deuxième est arrivée — de Golden Star Gold Mines — j'ai commencé à voir un modèle. Au moment où la troisième (IBN ROCHD) et la quatrième (la Récompense d'Excellence à l'UM6P) sont venues, j'ai compris quelque chose de profond : la provision n'est pas accidentelle. Le but a une façon de s'annoncer à travers les portes ouvertes.</p>
<h2>La Salle d'Attente</h2>
<p>Entre chaque bourse, il y avait une salle d'attente : candidatures, refus, incertitude. Mais le schéma que j'ai remarqué est le suivant : les saisons d'attente n'étaient pas gaspillées. C'était une préparation. Chaque défi que j'ai rencontré dans ces saisons a approfondi quelque chose en moi que la bourse seule ne pouvait pas construire : la résilience, l'humilité, et la dépendance à Dieu plutôt qu'à ma propre intelligence.</p>
<h2>Ce que le But et la Patience Enseignent Ensemble</h2>
<p>Le but et la patience ne sont pas des opposés. Ce sont des partenaires. Le but vous donne une direction ; la patience vous donne du caractère pour le voyage. La bourse n'était pas seulement une provision financière — c'était un témoignage. Et les témoignages sont faits pour être partagés.</p>
<blockquote><p>« Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. » — Jérémie 29:11</p></blockquote>
<p>Si vous êtes dans une salle d'attente en ce moment, sachez ceci : l'attente n'est pas gaspillée. Dieu n'est pas lent ; Il est précis. Faites confiance au processus. La bourse de votre vie arrive — pas nécessairement sous la forme que vous attendez, mais sous la forme dont vous avez besoin.</p>`,
    },
  },
  {
    slug: "proverbs-16-9-planning",
    category: "scripture",
    date: "2026-01-28",
    readTime: 5,
    en: {
      title: "Proverbs 16:9 and the Art of Planning Without Controlling",
      excerpt: "We plan. He establishes. The tension between strategic thinking and sacred surrender is where some of the greatest spiritual growth happens.",
      content: `<p><em>"In their hearts humans plan their course, but the Lord establishes their steps."</em> — Proverbs 16:9</p>
<p>I am, by temperament and training, a planner. I believe in strategy, in preparation, in the discipline of thinking ahead. And yet, some of the most significant moments in my life have arrived not through my plans but in spite of them — or through the ruins of them.</p>
<h2>The Planner's Temptation</h2>
<p>The planner's temptation is to confuse preparation with control. We build spreadsheets and five-year plans and mistake our capacity for foresight with the authority to determine outcomes. Proverbs 16:9 doesn't condemn planning — the first half is <em>"in their hearts humans plan."</em> Planning is human. It is right. But the second half corrects the overreach: <em>"the Lord establishes their steps."</em></p>
<h2>Sacred Surrender</h2>
<p>The art is in holding your plans loosely enough that God can redirect them without you breaking. This is what I have learned: plan with everything you have, and then submit the plan. Bring it before God. Say, <em>"Here is what I see. What do You see?"</em> And remain genuinely open to the answer being different from your expectation.</p>
<p>Some of my best "plans" have been interrupted in ways that turned out to be divine upgrades. The detour was the route. The obstacle was the door. The disruption was the invitation to something better than I had imagined.</p>
<blockquote><p>"Commit your way to the Lord; trust in him and he will do this: He will make your righteous reward shine like the dawn." — Psalm 37:5–6</p></blockquote>`,
    },
    fr: {
      title: "Proverbes 16:9 et l'Art de Planifier Sans Contrôler",
      excerpt: "Nous planifions. Il établit. La tension entre la pensée stratégique et l'abandon sacré est là où se produit une grande partie de la croissance spirituelle.",
      content: `<p><em>« Le cœur de l'homme médite sa voie, mais c'est l'Éternel qui dirige ses pas. »</em> — Proverbes 16:9</p>
<p>Je suis, par tempérament et formation, un planificateur. Je crois en la stratégie, en la préparation, en la discipline de la pensée préventive. Et pourtant, certains des moments les plus significatifs de ma vie sont arrivés non pas à travers mes plans mais malgré eux — ou à travers leurs ruines.</p>
<h2>La Tentation du Planificateur</h2>
<p>La tentation du planificateur est de confondre la préparation avec le contrôle. Nous construisons des tableurs et des plans quinquennaux et confondons notre capacité de prévoyance avec l'autorité de déterminer les résultats. Proverbes 16:9 ne condamne pas la planification — la première moitié dit <em>« le cœur de l'homme médite sa voie. »</em> La planification est humaine. Elle est juste. Mais la seconde moitié corrige l'excès : <em>« c'est l'Éternel qui dirige ses pas. »</em></p>
<h2>L'Abandon Sacré</h2>
<p>L'art consiste à tenir vos plans suffisamment lâchement pour que Dieu puisse les réorienter sans vous briser. Ce que j'ai appris : planifiez avec tout ce que vous avez, puis soumettez le plan. Apportez-le devant Dieu. Dites : <em>« Voici ce que je vois. Que voyez-Vous ? »</em> Et restez vraiment ouvert à une réponse différente de vos attentes.</p>
<blockquote><p>« Recommande ton sort à l'Éternel, mets en lui ta confiance, et il agira. Il fera paraître ta justice comme la lumière. » — Psaume 37:5–6</p></blockquote>`,
    },
  },
  {
    slug: "ghana-to-morocco",
    category: "testimony",
    date: "2026-01-15",
    readTime: 6,
    en: {
      title: "From Ghana to Morocco: What God Teaches You When You're Far From Home",
      excerpt: "Displacement has a way of stripping away everything that isn't essential — and in that stripping, the essential becomes luminous. Faith is one of the things that remained.",
      content: `<p>There is a particular kind of loneliness that comes with crossing a continent. Not the romantic loneliness of the adventurer, but the quiet, disorienting kind — where you wake up and the sounds are wrong, the language is different, and the familiar faces are thousands of miles away.</p>
<p>When I left Ghana for Morocco to pursue my Master's degree at UM6P, I carried more than luggage. I carried expectations, anxieties, and a faith that had been tested in familiar territory but was about to be tested in new soil.</p>
<h2>What Displacement Teaches</h2>
<p>Displacement is a theological experience. It strips away the comfort of context — the community that knows you, the church that raised you, the language you dream in. What remains when all of that is taken away? For me, what remained was scripture. Not doctrine. Not habit. But actual, living words that I had stored up without knowing I would need them quite so urgently.</p>
<blockquote><p>"Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." — Psalm 23:4</p></blockquote>
<h2>The Unexpected Gift</h2>
<p>I discovered that God is not regional. He did not stay in Ghana when I left. He was in Fez, in Rabat, in Ben Guerir. He was in the conversations I wasn't expecting, the friendships I hadn't planned, the moments of clarity that came in foreign city squares at strange hours.</p>
<p>If you are far from home — geographically, emotionally, spiritually — this is what I want you to know: He is already there. Where you are going, He has already arrived. You are not the first of His children to cross unfamiliar ground, and you will not be the last.</p>`,
    },
    fr: {
      title: "Du Ghana au Maroc : Ce que Dieu Vous Enseigne Quand Vous Êtes Loin de Chez Vous",
      excerpt: "Le déplacement a une façon de dépouiller tout ce qui n'est pas essentiel — et dans ce dépouillement, l'essentiel devient lumineux. La foi est l'une des choses qui est restée.",
      content: `<p>Il y a une sorte particulière de solitude qui accompagne la traversée d'un continent. Non pas la solitude romantique de l'aventurier, mais la forme tranquille et désorientante — où vous vous réveillez et les sons sont faux, la langue est différente, et les visages familiers sont à des milliers de kilomètres.</p>
<p>Quand j'ai quitté le Ghana pour le Maroc pour poursuivre mon Master à l'UM6P, j'ai emporté plus que des bagages. J'ai emporté des attentes, des angoisses, et une foi qui avait été mise à l'épreuve en territoire familier mais qui était sur le point d'être mise à l'épreuve dans un sol nouveau.</p>
<h2>Ce que le Déplacement Enseigne</h2>
<p>Le déplacement est une expérience théologique. Il dépouille le confort du contexte — la communauté qui vous connaît, l'église qui vous a élevé, la langue dans laquelle vous rêvez. Qu'est-ce qui reste quand tout cela est enlevé ? Pour moi, ce qui restait, c'était l'Écriture. Pas la doctrine. Pas l'habitude. Mais des paroles réelles et vivantes que j'avais emmagasinées sans savoir que j'en aurais besoin avec autant d'urgence.</p>
<blockquote><p>« Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi ; ta houlette et ton bâton me rassurent. » — Psaume 23:4</p></blockquote>
<h2>Le Don Inattendu</h2>
<p>J'ai découvert que Dieu n'est pas régional. Il n'est pas resté au Ghana quand je suis parti. Il était à Fès, à Rabat, à Ben Guerir. Il était dans les conversations que je n'attendais pas, les amitiés que je n'avais pas planifiées, les moments de clarté qui venaient dans des places de villes étrangères à des heures inhabituelles.</p>`,
    },
  },
  {
    slug: "faith-over-fear",
    category: "theology",
    date: "2025-12-20",
    readTime: 8,
    en: {
      title: "Faith Over Fear: A Theology of Courage",
      excerpt: "Courage is not the absence of fear — it is faith in motion. Isaiah 41:13 isn't a nice saying; it is instructions for navigation in a terrifying world.",
      content: `<p><em>"For I am the Lord your God who takes hold of your right hand and says to you, 'Do not fear; I will help you.'"</em> — Isaiah 41:13</p>
<p>We live in an age that valorises fearlessness. We promote it, market it, perform it. But fearlessness is not the same as courage, and courage is not the absence of fear. Courage is the decision to act rightly in the presence of fear, grounded in something larger than the fear itself.</p>
<h2>Fear is Human. Faith is the Response.</h2>
<p>Scripture never pretends that fear is irrational or that the threats which generate it are imaginary. The Psalms are full of terror. Paul speaks of fighting and fears. Jesus himself, in Gethsemane, sweated blood. Fear is not the enemy. The enemy is fear allowed to govern — fear given the last word.</p>
<p>Faith does not eliminate fear. It reframes it. It places fear within a larger story — the story of a God who holds your right hand and says, <em>specifically to you</em>, "Do not fear." Not "do not notice the danger." Not "pretend the difficulty isn't real." But: do not be mastered by it.</p>
<h2>Building a Theology of Courage</h2>
<p>A theology of courage recognises three things: First, that God is aware of what frightens you. Second, that His promise to help is unconditional — not earned by your faith level but given because of His character. Third, that courage is practiced, not perfected. It is built in small moments of trust that accumulate into a posture of fearlessness.</p>
<blockquote><p>"Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you." — Deuteronomy 31:6</p></blockquote>
<p>Every test of faith I have faced — crossing borders, starting over, trusting when I couldn't see — has been, at its core, a practice in this theology. Not "I am not afraid." But "I am afraid, and I will move forward anyway, because the One who holds my right hand has proven Himself faithful."</p>`,
    },
    fr: {
      title: "La Foi sur la Peur : Une Théologie du Courage",
      excerpt: "Le courage n'est pas l'absence de peur — c'est la foi en mouvement. Ésaïe 41:13 n'est pas une belle expression ; ce sont des instructions pour naviguer dans un monde effrayant.",
      content: `<p><em>« Car je suis l'Éternel, ton Dieu, qui te saisit par la main droite, et qui te dis : Ne crains point, je viens à ton secours. »</em> — Ésaïe 41:13</p>
<p>Nous vivons dans une ère qui valorise l'intrépidité. Nous la promouvons, la commercialisons, la jouons. Mais l'intrépidité n'est pas la même chose que le courage, et le courage n'est pas l'absence de peur. Le courage est la décision d'agir correctement en présence de la peur, ancré dans quelque chose de plus grand que la peur elle-même.</p>
<h2>La Peur est Humaine. La Foi est la Réponse.</h2>
<p>L'Écriture ne prétend jamais que la peur est irrationnelle ou que les menaces qui la génèrent sont imaginaires. Les Psaumes sont pleins de terreur. Paul parle de combats et de peurs. Jésus lui-même, à Gethsémané, a sué du sang. La peur n'est pas l'ennemi. L'ennemi est la peur autorisée à gouverner — la peur à qui on donne le dernier mot.</p>
<h2>Construire une Théologie du Courage</h2>
<p>Une théologie du courage reconnaît trois choses : Premièrement, que Dieu est conscient de ce qui vous fait peur. Deuxièmement, que Sa promesse d'aider est inconditionnelle — non gagnée par votre niveau de foi mais donnée en raison de Son caractère. Troisièmement, que le courage se pratique, il ne se perfectionne pas. Il se construit dans de petits moments de confiance qui s'accumulent en une posture d'intrépidité.</p>
<blockquote><p>« Fortifie-toi et aie bon courage ! Ne t'effraie point et ne t'épouvante point devant eux ; car c'est l'Éternel, ton Dieu, qui marche avec toi : il ne te délaissera point, et il ne t'abandonnera point. » — Deutéronome 31:6</p></blockquote>`,
    },
  },
  {
    slug: "discipline-of-stillness",
    category: "prayer",
    date: "2025-12-05",
    readTime: 6,
    en: {
      title: "The Discipline of Stillness: Learning to Wait on God",
      excerpt: "In a world that rewards speed and output, stillness feels like failure. But Scripture teaches that waiting on the Lord is not passive — it is the most active and demanding spiritual practice.",
      content: `<p><em>"Be still, and know that I am God."</em> — Psalm 46:10</p>
<p>This is perhaps the most counter-cultural verse in all of Scripture. In a world that rewards speed, output, and constant movement, the command to be still feels not just difficult — it feels irresponsible.</p>
<h2>What Stillness Is Not</h2>
<p>Stillness is not inactivity. It is not passivity. It is not the absence of thought. Biblical stillness is the intentional quieting of internal noise — the worry, the striving, the performance — in order to be present to the One who is already present to you.</p>
<p>The Hebrew word in Psalm 46:10 carries the sense of <em>letting go</em>, of releasing the grip on outcomes. It is an act of trust expressed through posture. To be still is to say: I am not in control, and I no longer need to pretend that I am.</p>
<h2>The Practice</h2>
<p>I have found that the discipline of stillness requires structure, especially at first. Not the performance of stillness — sitting in the right posture with the right expression — but actual interior quiet. For me, this means early mornings before the world demands anything of me. It means scripture read slowly, without agenda. It means prayer that begins not with requests but with listening.</p>
<blockquote><p>"They that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." — Isaiah 40:31</p></blockquote>
<p>Waiting on God is not the absence of movement. It is movement in the right direction, fuelled by a Source that does not run dry. The discipline of stillness is where that refuelling happens.</p>`,
    },
    fr: {
      title: "La Discipline du Silence : Apprendre à Attendre Dieu",
      excerpt: "Dans un monde qui récompense la vitesse et la productivité, le silence ressemble à un échec. Mais l'Écriture enseigne que l'attente de l'Éternel n'est pas passive — c'est la pratique spirituelle la plus active et la plus exigeante.",
      content: `<p><em>« Arrêtez, et sachez que je suis Dieu. »</em> — Psaume 46:10</p>
<p>C'est peut-être le verset le plus contre-culturel de toute l'Écriture. Dans un monde qui récompense la vitesse, la productivité et le mouvement constant, l'ordre de s'arrêter semble non seulement difficile — il semble irresponsable.</p>
<h2>Ce que le Silence n'Est Pas</h2>
<p>Le silence n'est pas l'inactivité. Ce n'est pas la passivité. Ce n'est pas l'absence de pensée. Le silence biblique est la mise en quiétude intentionnelle du bruit intérieur — l'inquiétude, l'effort, la performance — afin d'être présent à Celui qui est déjà présent à vous.</p>
<h2>La Pratique</h2>
<p>J'ai découvert que la discipline du silence nécessite une structure, surtout au début. Non pas la performance du silence, mais une vraie quiétude intérieure. Pour moi, cela signifie les matins tôt avant que le monde n'exige quoi que ce soit de moi. Cela signifie lire les Écritures lentement, sans agenda. Cela signifie une prière qui commence non par des requêtes mais par l'écoute.</p>
<blockquote><p>« Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles ; ils courent, et ne se lassent point ; ils marchent, et ne se fatiguent point. » — Ésaïe 40:31</p></blockquote>`,
    },
  },
  {
    slug: "servant-leadership-bible",
    category: "theology",
    date: "2025-11-18",
    readTime: 7,
    en: {
      title: "The Servant Who Became Lord: Biblical Foundations of Servant Leadership",
      excerpt: "Jesus redefined greatness permanently. In the kingdom, the path to authority runs through service — not around it. This is not a management principle; it is a theological reality.",
      content: `<p><em>"Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many."</em> — Mark 10:43–45</p>
<p>Servant leadership is fashionable in corporate circles today. It appears in business school curricula, leadership conferences, and organisation development frameworks. But when it is stripped of its theological roots, it becomes a strategy — a sophisticated way to get followers to perform better. That is not what Jesus was describing.</p>
<h2>What Jesus Actually Said</h2>
<p>The disciples were arguing about who would be greatest in the kingdom. They were jockeying for position — a very human response to proximity to power. Jesus didn't rebuke the ambition; He redefined its object. "Whoever wants to be great among you must be your servant." Not: don't want greatness. But: greatness looks different than you think.</p>
<p>In the kingdom economy, authority is earned through service, not seized through rank. The leader washes feet. The greatest one takes the lowest position. This is not a tactic; it is the nature of love expressed through power.</p>
<h2>My Practice</h2>
<p>Every role I have held — from Class Prefect to church elder to program officer — I have tried to approach with this question: <em>Who am I serving?</em> Not "who reports to me?" but "who am I responsible for?" The difference in framing changes everything.</p>
<blockquote><p>"Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others." — Philippians 2:3–4</p></blockquote>`,
    },
    fr: {
      title: "Le Serviteur Qui Est Devenu Seigneur : Fondements Bibliques du Leadership Serviteur",
      excerpt: "Jésus a redéfini la grandeur de façon permanente. Dans le royaume, le chemin vers l'autorité passe par le service — pas autour de lui. Ce n'est pas un principe de gestion ; c'est une réalité théologique.",
      content: `<p><em>« Quiconque veut être grand parmi vous sera votre serviteur, et quiconque veut être le premier parmi vous sera l'esclave de tous. Car le Fils de l'homme est venu, non pour être servi, mais pour servir et donner sa vie en rançon pour beaucoup. »</em> — Marc 10:43–45</p>
<p>Le leadership serviteur est à la mode dans les cercles d'entreprise aujourd'hui. Il apparaît dans les programmes des écoles de commerce, les conférences de leadership et les cadres de développement organisationnel. Mais lorsqu'il est dépouillé de ses racines théologiques, il devient une stratégie. Ce n'est pas ce que Jésus décrivait.</p>
<h2>Ce que Jésus a Réellement Dit</h2>
<p>Les disciples se disputaient pour savoir qui serait le plus grand dans le royaume. Jésus n'a pas réprimandé l'ambition ; Il a redéfini son objet. <em>« Quiconque veut être grand parmi vous sera votre serviteur. »</em> Non pas : ne désirez pas la grandeur. Mais : la grandeur a l'air différent de ce que vous pensez.</p>
<h2>Ma Pratique</h2>
<p>Chaque rôle que j'ai occupé — de préfet de classe à ancien d'église en passant par officier de programme — j'ai essayé de l'aborder avec cette question : <em>Qui est-ce que je sers ?</em> Non pas « qui me rapporte ? » mais « de qui suis-je responsable ? » La différence de cadrage change tout.</p>
<blockquote><p>« Ne faites rien par esprit de parti ou par vaine gloire, mais que l'humilité vous fasse regarder les autres comme étant au-dessus de vous-mêmes. » — Philippiens 2:3</p></blockquote>`,
    },
  },
  {
    slug: "daily-encounter-scripture",
    category: "discipleship",
    date: "2025-11-02",
    readTime: 5,
    en: {
      title: "Reading Scripture Every Day: A Practical Guide for the Intellectually Curious",
      excerpt: "Daily Bible reading isn't about religious duty. It's about maintaining contact with a living Text — one that changes as you change, revealing more as you go deeper.",
      content: `<p>I was trained as a researcher. I am comfortable with dense texts, with annotation, with sitting inside a difficult passage until it yields meaning. And yet, for most of my life, I read the Bible poorly — skimming it the way one checks a weather app. Present, but not attentive.</p>
<h2>The Shift</h2>
<p>What changed my reading was a simple practice borrowed from the monastic tradition: <em>lectio divina</em> — sacred reading. Not reading for information, but reading for encounter. The difference is posture. You come to the text not to extract data but to be encountered by the Author.</p>
<p>In practice, this means: read slowly. When a phrase catches your attention, stop. Stay there. Read it again. Ask: <em>What is this saying? What is this saying to me, today?</em> Then sit in the answer — or in the question — before moving on.</p>
<h2>Four Keys for Bible Reading</h2>
<p><strong>1. Consistency over quantity.</strong> Ten minutes every day outperforms two hours once a week. The discipline of returning — even when you don't feel like it — is the practice of faith itself.</p>
<p><strong>2. Context matters.</strong> Read the passage, then read what comes before and after. The Bible is not a collection of fortune cookies. It is a coherent story, and sentences have addresses.</p>
<p><strong>3. Bring your questions.</strong> Intellectual engagement with scripture is not irreverence. Ask hard questions. The Text can hold them. Its Author can answer them.</p>
<p><strong>4. Let it land.</strong> The goal is not intellectual mastery. It is transformation. Ask regularly: <em>What am I supposed to do with what I just read?</em></p>
<blockquote><p>"Your word is a lamp for my feet, a light on my path." — Psalm 119:105</p></blockquote>`,
    },
    fr: {
      title: "Lire les Écritures Chaque Jour : Un Guide Pratique pour les Intellectuellement Curieux",
      excerpt: "La lecture quotidienne de la Bible ne concerne pas le devoir religieux. Il s'agit de maintenir le contact avec un Texte vivant — un texte qui change à mesure que vous changez, révélant davantage à mesure que vous allez plus profondément.",
      content: `<p>J'ai été formé comme chercheur. Je suis à l'aise avec les textes denses, avec l'annotation, avec le fait de rester à l'intérieur d'un passage difficile jusqu'à ce qu'il produise du sens. Et pourtant, pendant la plus grande partie de ma vie, j'ai mal lu la Bible — la feuilletant comme on consulte une application météo. Présent, mais pas attentif.</p>
<h2>Le Changement</h2>
<p>Ce qui a changé ma lecture était une pratique simple empruntée à la tradition monastique : la <em>lectio divina</em> — la lecture sacrée. Non pas lire pour l'information, mais lire pour la rencontre. La différence est dans la posture. Vous venez au texte non pas pour extraire des données mais pour être rencontré par l'Auteur.</p>
<h2>Quatre Clés pour la Lecture Biblique</h2>
<p><strong>1. La régularité plutôt que la quantité.</strong> Dix minutes chaque jour surpasse deux heures une fois par semaine.</p>
<p><strong>2. Le contexte compte.</strong> Lisez le passage, puis lisez ce qui précède et ce qui suit. La Bible n'est pas une collection de proverbes aléatoires. C'est une histoire cohérente.</p>
<p><strong>3. Apportez vos questions.</strong> L'engagement intellectuel avec l'Écriture n'est pas de l'irrévérence. Posez des questions difficiles. Le Texte peut les tenir.</p>
<p><strong>4. Laissez-la atterrir.</strong> Le but n'est pas la maîtrise intellectuelle. C'est la transformation.</p>
<blockquote><p>« Ta parole est une lampe à mes pieds et une lumière sur mon sentier. » — Psaume 119:105</p></blockquote>`,
    },
  },
  {
    slug: "body-of-christ-community",
    category: "reflection",
    date: "2025-10-14",
    readTime: 6,
    en: {
      title: "We Belong to Each Other: On the Body of Christ and the Necessity of Community",
      excerpt: "Faith is never meant to be solitary. The body of Christ is not a metaphor for niceness — it is a description of interdependence. You are not designed to do this alone.",
      content: `<p><em>"Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ."</em> — 1 Corinthians 12:12</p>
<p>Western Christianity has produced a version of faith that is deeply, dangerously individualistic. The gospel is presented as a personal transaction — between you and God — and community becomes optional. An add-on for the particularly extroverted.</p>
<p>This is a distortion of the New Testament. The church — the <em>ekklesia</em> — is not a gathering of individuals who happened to believe the same things. It is a body. And bodies are interdependent by nature.</p>
<h2>What I Found in the Church in Morocco</h2>
<p>When I arrived in Morocco as a stranger, the Eglise Évangélique Au Maroc became more than a gathering. It became the structure within which my faith survived and grew. Not because of programmes or production, but because of people — people who prayed for me before they knew me well, who bore burdens they didn't have to, who made space for a newcomer in their belonging.</p>
<p>I learned that vulnerability is not weakness in the body of Christ. It is the mechanism by which the body functions. When I admitted difficulty, others could carry it. When I shared joy, others could multiply it. When I doubted, others could hold the rope.</p>
<h2>The Principle</h2>
<p>You are not designed to do this alone. Not spiritually, not emotionally, not practically. The New Testament assumes community. It is written <em>to</em> churches, not to individuals. Your faith is meant to be lived in a web of relationships that challenge, sustain, and sharpen you.</p>
<blockquote><p>"And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another." — Hebrews 10:24–25</p></blockquote>`,
    },
    fr: {
      title: "Nous Nous Appartenons : Sur le Corps du Christ et la Nécessité de la Communauté",
      excerpt: "La foi n'est jamais censée être solitaire. Le corps du Christ n'est pas une métaphore pour la gentillesse — c'est une description de l'interdépendance. Vous n'êtes pas conçu pour faire cela seul.",
      content: `<p><em>« Car, comme le corps est un et a plusieurs membres, et comme tous les membres du corps, malgré leur nombre, ne forment qu'un seul corps, ainsi en est-il de Christ. »</em> — 1 Corinthiens 12:12</p>
<p>Le christianisme occidental a produit une version de la foi profondément, dangereusement individualiste. La communauté devient optionnelle. Un supplément pour les particulièrement extravertis. C'est une distorsion du Nouveau Testament. L'église — l'<em>ekklesia</em> — n'est pas un rassemblement d'individus qui ont cru les mêmes choses par hasard. C'est un corps. Et les corps sont interdépendants par nature.</p>
<h2>Ce que J'ai Trouvé dans l'Église au Maroc</h2>
<p>Quand je suis arrivé au Maroc comme étranger, l'Eglise Évangélique Au Maroc est devenue plus qu'un rassemblement. Elle est devenue la structure dans laquelle ma foi a survécu et grandi. Non pas à cause de programmes ou de production, mais à cause de gens — des gens qui ont prié pour moi avant de bien me connaître, qui ont porté des fardeaux qu'ils n'avaient pas à porter.</p>
<blockquote><p>« Veillons les uns sur les autres, pour nous exciter à la charité et aux bonnes œuvres. N'abandonnons pas notre réunion, comme c'est la coutume de quelques-uns ; mais exhortons-nous réciproquement. » — Hébreux 10:24–25</p></blockquote>`,
    },
  },
  {
    slug: "grace-not-achievement",
    category: "reflection",
    date: "2025-09-30",
    readTime: 5,
    en: {
      title: "Grace, Not Grades: What Academic Achievement Taught Me About Favour",
      excerpt: "Four scholarships. Two degrees. Enough academic credentials to feel entitled. And then a moment — quiet, clear — when it all became obviously gift rather than performance.",
      content: `<p>There is a temptation that comes with academic achievement: the temptation to believe you earned it. That the grades, the scholarships, the recognition were outputs of your effort alone. That you deserved what you received because you worked for it.</p>
<p>I held this belief implicitly for years. Not consciously, not arrogantly — but it shaped how I moved, how I received, and how I processed failure.</p>
<h2>The Moment of Clarity</h2>
<p>The shift came quietly. I was preparing for my fourth scholarship application, and I was struck by the strange sequence of events that had brought me to that moment. The teacher who had noticed me. The mentor who had written the letter. The committee member who had read my file on a different day than usual. The application deadline that had been extended once.</p>
<p>Grace is not the absence of effort. I studied hard. I prepared carefully. But grace is the presence of an organising hand in the space between effort and outcome — arranging the variables that I could not arrange, opening doors I did not know existed, closing others that would have led me elsewhere.</p>
<h2>The Theological Point</h2>
<p>The grace of God does not diminish human agency. You still need to plant the seed. You still need to water it. But the growth — the actual flourishing — is not yours to manufacture.</p>
<blockquote><p>"For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast." — Ephesians 2:8–9</p></blockquote>
<p>This is not only about salvation. It is about how all good things come — education, opportunity, talent, even the capacity to strive. Everything is gift. The appropriate response to gift is gratitude, not pride. And gratitude, I have found, is a better fuel for excellence than entitlement ever was.</p>`,
    },
    fr: {
      title: "La Grâce, Pas les Notes : Ce que la Réussite Académique m'a Appris sur la Faveur",
      excerpt: "Quatre bourses. Deux diplômes. Suffisamment de titres académiques pour se sentir fondé. Et puis un moment — calme, clair — où tout est devenu évidemment don plutôt que performance.",
      content: `<p>Il y a une tentation qui vient avec la réussite académique : la tentation de croire que vous l'avez méritée. Que les notes, les bourses, la reconnaissance étaient des résultats de votre seul effort. Que vous méritez ce que vous avez reçu parce que vous l'avez travaillé.</p>
<p>J'ai tenu cette croyance implicitement pendant des années. Pas consciemment, pas arrogamment — mais elle a façonné la façon dont je me déplaçais, dont je recevais, et dont je traitais l'échec.</p>
<h2>Le Point Théologique</h2>
<p>La grâce de Dieu ne diminue pas l'agence humaine. Vous devez encore planter la graine. Vous devez encore l'arroser. Mais la croissance — le véritable épanouissement — n'est pas la vôtre à fabriquer.</p>
<blockquote><p>« Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie. » — Éphésiens 2:8–9</p></blockquote>
<p>Ce n'est pas seulement à propos du salut. C'est à propos de la façon dont toutes les bonnes choses arrivent — l'éducation, l'opportunité, le talent, même la capacité d'aspirer. Tout est don. La réponse appropriée au don est la gratitude, pas la fierté.</p>`,
    },
  },
  {
    slug: "praying-through-uncertainty",
    category: "prayer",
    date: "2025-09-12",
    readTime: 7,
    en: {
      title: "When You Don't Know How to Pray: A Guide to Praying Through Uncertainty",
      excerpt: "There are seasons when prayer itself feels impossible — when the words don't come, when the silence feels empty rather than full. This is not a failure of faith. It is an invitation.",
      content: `<p>Not every season of prayer is clear. There are times — and if you have lived long enough in faith, you know them — when you sit down to pray and the words simply do not come. When the silence feels heavy rather than holy. When you are not sure what to ask for because you are not sure what you believe is possible.</p>
<h2>What Scripture Says About Not Knowing How to Pray</h2>
<p>Paul addresses this directly in Romans 8:26:</p>
<blockquote><p>"In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans."</p></blockquote>
<p>This is extraordinarily freeing if you let it land. The Spirit of God intercedes for you when you cannot intercede for yourself. Your confusion, your silence, your wordless presence before God is not a failure of prayer. It is prayer in its most fundamental form: showing up.</p>
<h2>Practical Approaches</h2>
<p><strong>Pray the Psalms.</strong> The Psalms are prayers written by people who did not know how to pray their own situations. Lament psalms, in particular, give voice to the kind of confusion and pain that does not easily fit into "please" and "thank you." When your own words fail, use theirs.</p>
<p><strong>Pray with your body.</strong> Sometimes the posture of prayer communicates what the mind cannot. Kneel. Raise your hands. Lie down in silence. The body has its own way of saying "I am here."</p>
<p><strong>Name the uncertainty.</strong> Tell God exactly what you don't know. "I don't know what I'm asking for." "I don't know what I believe about this." This is not irreverence — it is honesty, and God prefers honesty to performance.</p>
<p><strong>Wait.</strong> Not every prayer arrives with an answer. Some prayers are meant to be held for a season. The act of returning to them — again and again — is itself a form of trust.</p>
<p>Uncertainty is not the enemy of faith. It is the territory in which faith is exercised. You do not need clarity to be faithful. You need only to keep showing up.</p>`,
    },
    fr: {
      title: "Quand Vous Ne Savez Pas Comment Prier : Un Guide pour Prier à Travers l'Incertitude",
      excerpt: "Il y a des saisons où la prière elle-même semble impossible — quand les mots ne viennent pas, quand le silence semble vide plutôt que plein. Ce n'est pas un échec de la foi. C'est une invitation.",
      content: `<p>Toutes les saisons de prière ne sont pas claires. Il y a des moments — et si vous avez vécu assez longtemps dans la foi, vous les connaissez — où vous vous asseyez pour prier et les mots ne viennent tout simplement pas. Quand le silence semble lourd plutôt que saint.</p>
<h2>Ce que l'Écriture Dit sur Ne Pas Savoir Comment Prier</h2>
<p>Paul aborde cela directement dans Romains 8:26 :</p>
<blockquote><p>« De même aussi, l'Esprit nous aide dans notre faiblesse, car nous ne savons pas ce qu'il nous convient de demander dans nos prières. Mais l'Esprit lui-même intercède par des soupirs inexprimables. »</p></blockquote>
<p>C'est extraordinairement libérateur si vous le laissez s'ancrer. L'Esprit de Dieu intercède pour vous quand vous ne pouvez pas intercéder pour vous-même. Votre confusion, votre silence, votre présence silencieuse devant Dieu n'est pas un échec de la prière. C'est la prière dans sa forme la plus fondamentale : se présenter.</p>
<h2>Approches Pratiques</h2>
<p><strong>Priez les Psaumes.</strong> Les Psaumes sont des prières écrites par des personnes qui ne savaient pas prier leurs propres situations.</p>
<p><strong>Nommez l'incertitude.</strong> Dites à Dieu exactement ce que vous ne savez pas. Ce n'est pas de l'irrévérence — c'est de l'honnêteté, et Dieu préfère l'honnêteté à la performance.</p>
<p><strong>Attendez.</strong> Toutes les prières n'arrivent pas avec une réponse. L'acte de revenir à elles — encore et encore — est lui-même une forme de confiance.</p>
<p>L'incertitude n'est pas l'ennemi de la foi. C'est le territoire dans lequel la foi s'exerce. Vous n'avez pas besoin de clarté pour être fidèle. Vous n'avez qu'à continuer à vous présenter.</p>`,
    },
  },
];

export const categories: { value: Category | "all"; en: string; fr: string }[] = [
  { value: "all",          en: "All Writings",   fr: "Tous les Écrits" },
  { value: "theology",     en: "Theology",       fr: "Théologie"       },
  { value: "prayer",       en: "Prayer",         fr: "Prière"          },
  { value: "scripture",    en: "Scripture",      fr: "Écriture"        },
  { value: "discipleship", en: "Discipleship",   fr: "Disciples"       },
  { value: "testimony",    en: "Testimony",      fr: "Témoignage"      },
  { value: "reflection",   en: "Reflection",     fr: "Réflexion"       },
];

export function getCategoryLabel(category: Category, lang: "en" | "fr"): string {
  const found = categories.find((c) => c.value === category);
  return found ? found[lang] : category;
}
