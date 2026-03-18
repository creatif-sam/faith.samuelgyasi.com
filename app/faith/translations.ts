// Faith page — bilingual content (English & French)
// Each section has `en` and `fr` keys.

export type Lang = "en" | "fr";

export const faithTranslations = {
  nav: {
    back: { en: "Faith", fr: "Foi" },
    logo: { en: "Samuel Kobina Gyasi", fr: "Samuel Kobina Gyasi" },
    tag:  { en: "Beliefs", fr: "Convictions" },
  },

  hero: {
    eyebrow: { en: "Faith · Belief · Conviction · Wisdom", fr: "Foi · Croyance · Conviction · Sagesse" },
    title:   { en: "Beliefs", fr: "Convictions" },
    subtitle: {
      en: "A life anchored in sacred wisdom, shaped by scripture, and illuminated by an unshakeable conviction that truth is both found and lived.",
      fr: "Une vie ancrée dans la sagesse sacrée, façonnée par l'Écriture, et illuminée par une conviction inébranlable que la vérité se trouve et se vit.",
    },
    verse: {
      en: "\"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\"",
      fr: "« Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers. »",
    },
    verseRef: {
      en: "Proverbs 3:5–6 · The foundation of Samuel's journey",
      fr: "Proverbes 3:5–6 · Le fondement du parcours de Samuel",
    },
    scrollHint: { en: "Explore", fr: "Explorer" },
  },

  beliefs: {
    label: { en: "Core Convictions", fr: "Convictions Fondamentales" },
    cards: [
      {
        num: "I",
        title:  { en: "The Living Word",          fr: "La Parole Vivante" },
        body:   { en: "Samuel holds the Bible not as a historical relic but as a living, breathing guide — a lamp that illuminates every decision, relationship, and ambition. Scripture is the lens through which all of life is interpreted and understood.", fr: "Samuel tient la Bible non comme une relique historique, mais comme un guide vivant et inspiré — une lampe qui éclaire chaque décision, relation et ambition. L'Écriture est la lentille à travers laquelle toute la vie est interprétée et comprise." },
        verse:  { en: "\"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.\" — 2 Timothy 3:16", fr: "« Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice. » — 2 Timothée 3:16" },
      },
      {
        num: "II",
        title:  { en: "Faith Over Fear",           fr: "La Foi sur la Peur" },
        body:   { en: "At every crossroads — as a scholar, as a leader, as a young man far from home — Samuel's faith has been the anchor that refuses to yield to doubt or circumstance. Courage is not the absence of fear; it is faith in motion.", fr: "À chaque carrefour — en tant que chercheur, leader, jeune homme loin de chez lui — la foi de Samuel a été l'ancre qui refuse de céder au doute ou aux circonstances. Le courage n'est pas l'absence de peur ; c'est la foi en mouvement." },
        verse:  { en: "\"For I am the Lord your God who takes hold of your right hand and says to you, 'Do not fear; I will help you.'\" — Isaiah 41:13", fr: "« Car je suis l'Éternel, ton Dieu, qui te saisit par la main droite, et qui te dis : Ne crains point, je viens à ton secours. » — Ésaïe 41:13" },
      },
      {
        num: "III",
        title:  { en: "Purpose-Driven Existence",  fr: "Une Existence Orientée par le But" },
        body:   { en: "Every talent, every scholarship, every position of leadership is understood as a stewardship — entrusted by God for a reason greater than personal gain. Samuel believes his life is a narrative being written by a hand wiser than his own.", fr: "Chaque talent, chaque bourse d'études, chaque position de leadership est comprise comme une intendance — confiée par Dieu pour une raison plus grande que le gain personnel. Samuel croit que sa vie est un récit écrit par une main plus sage que la sienne." },
        verse:  { en: "\"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.\" — Ephesians 2:10", fr: "« Car nous sommes son ouvrage, ayant été créés en Jésus-Christ pour de bonnes œuvres, que Dieu a préparées d'avance, afin que nous les pratiquions. » — Éphésiens 2:10" },
      },
      {
        num: "IV",
        title:  { en: "Transformation from Within", fr: "Transformation de l'Intérieur" },
        body:   { en: "True change — in communities, in nations, in minds — begins not with systems or strategies but with the renewal of the human spirit. Samuel believes that inward transformation is the seed of all outward revolution.", fr: "Le vrai changement — dans les communautés, les nations, les esprits — ne commence pas par des systèmes ou des stratégies, mais par le renouvellement de l'esprit humain. Samuel croit que la transformation intérieure est la graine de toute révolution extérieure." },
        verse:  { en: "\"Do not conform to the pattern of this world, but be transformed by the renewing of your mind.\" — Romans 12:2", fr: "« Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence. » — Romains 12:2" },
      },
    ],
  },

  journey: {
    label:    { en: "The Inner Story",             fr: "L'Histoire Intérieure" },
    headline: { en: "A Pilgrim's",                 fr: "Le Chemin" },
    headlineEm: { en: "Path",                      fr: "d'un Pèlerin" },
    desc: {
      en: "Faith is not a destination arrived at once. It is a road walked daily — through Ghana, through Morocco, through the halls of academia and the quiet rooms of prayer.",
      fr: "La foi n'est pas une destination à laquelle on arrive une fois pour toutes. C'est une route parcourue chaque jour — à travers le Ghana, le Maroc, les couloirs de l'académie et les salles de prière.",
    },
    entries: [
      {
        title: { en: "Rooted in Ghana",             fr: "Enraciné au Ghana" },
        body:  { en: "From the Ghana-China Friendship School to Saint John's, Samuel grew up in an environment where faith was woven into community life. The early discipline of stewardship — caring for others, showing up with integrity — was shaped by deeply held beliefs about service and honour.", fr: "De l'École d'Amitié Ghana-Chine à Saint John's, Samuel a grandi dans un environnement où la foi était tissée dans la vie communautaire. La discipline précoce de l'intendance — prendre soin des autres, agir avec intégrité — a été façonnée par des convictions profondes sur le service et l'honneur." },
        verse: { en: "\"Start children off on the way they should go, and even when they are old they will not turn from it.\" — Proverbs 22:6", fr: "« Instruis l'enfant selon la voie qu'il doit suivre ; et quand il sera vieux, il ne s'en détournera pas. » — Proverbes 22:6" },
      },
      {
        title: { en: "Stretched Across Borders",    fr: "Étendu Par-delà les Frontières" },
        body:  { en: "Moving from Ghana to Morocco for university required more than academic ambition — it demanded a faith resilient enough to sustain through cultural displacement and personal challenge. In Fez and then Rabat, Samuel learned that conviction does not depend on geography.", fr: "Se déplacer du Ghana au Maroc pour l'université exigeait plus que de l'ambition académique — cela nécessitait une foi assez résiliente pour traverser le déracinement culturel et les défis personnels. À Fès puis à Rabat, Samuel a appris que la conviction ne dépend pas de la géographie." },
        verse: { en: "\"Even though I walk through the darkest valley, I will fear no evil, for you are with me.\" — Psalm 23:4", fr: "« Quand je marche dans la vallée de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi. » — Psaume 23:4" },
      },
      {
        title: { en: "Scholarship as Testimony",    fr: "La Bourse comme Témoignage" },
        body:  { en: "Four fully-funded scholarships — from the Government of Ghana, Golden Star Gold Mines, IBN ROCHD, and an Excellence Award — are not coincidences. Samuel views each as a tangible expression of providential favour: evidence that diligence and faith working together open doors no human hand alone could unlock.", fr: "Quatre bourses entièrement financées — du Gouvernement du Ghana, de Golden Star Gold Mines, d'IBN ROCHD et d'une récompense d'excellence — ne sont pas des coïncidences. Samuel les voit chacune comme une expression tangible de la faveur providentielle : la preuve que la diligence et la foi combinées ouvrent des portes qu'aucune main humaine seule ne pourrait déverrouiller." },
        verse: { en: "\"Commit to the Lord whatever you do, and he will establish your plans.\" — Proverbs 16:3", fr: "« Recommande à l'Éternel tes œuvres, et tes projets réussiront. » — Proverbes 16:3" },
      },
      {
        title: { en: "Collective Intelligence as Calling", fr: "L'Intelligence Collective comme Vocation" },
        body:  { en: "The choice to study Collective Intelligence at UM6P is, for Samuel, a spiritual one. He sees the pursuit of shared knowledge, collaborative decision-making, and community empowerment as a form of sacred stewardship — using the mind God gave him to serve the world God loves.", fr: "Le choix d'étudier l'Intelligence Collective à l'UM6P est, pour Samuel, un choix spirituel. Il voit la recherche du savoir partagé, de la prise de décision collaborative et de l'autonomisation communautaire comme une forme de gérance sacrée — utiliser l'esprit que Dieu lui a donné pour servir le monde que Dieu aime." },
        verse: { en: "\"Love the Lord your God with all your heart and with all your soul and with all your mind.\" — Matthew 22:37", fr: "« Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, et de toute ta pensée. » — Matthieu 22:37" },
      },
    ],
  },

  scriptures: {
    label: { en: "Words That Anchor",              fr: "Paroles qui Ancrent" },
    intro: {
      en: "These are the verses Samuel returns to — in quiet mornings, in difficult seasons, in moments of decision.",
      fr: "Ce sont les versets auxquels Samuel revient — dans les matins calmes, dans les saisons difficiles, dans les moments de décision.",
    },
    cards: [
      { text: { en: "\"I can do all this through him who gives me strength.\"",                  fr: "« Je puis tout par celui qui me fortifie. »" },              ref: "Philippians 4:13 / Philippiens 4:13",  wide: false, tall: true  },
      { text: { en: "\"For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future.\"", fr: "« Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »" }, ref: "Jeremiah 29:11 / Jérémie 29:11", wide: true, tall: false },
      { text: { en: "\"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\"", fr: "« Sois fort et courageux ! Ne t'effraie pas et ne te laisse pas épouvanter, car l'Éternel, ton Dieu, sera avec toi dans tout ce que tu feras. »" }, ref: "Joshua 1:9 / Josué 1:9", wide: false, tall: false },
      { text: { en: "\"The heart of man plans his way, but the Lord establishes his steps.\"",    fr: "« Le cœur de l'homme médite sa voie, mais c'est l'Éternel qui dirige ses pas. »" },                 ref: "Proverbs 16:9 / Proverbes 16:9", wide: false, tall: false },
      { text: { en: "\"And we know that in all things God works for the good of those who love him, who have been called according to his purpose.\"", fr: "« Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu. »" }, ref: "Romans 8:28 / Romains 8:28", wide: true, tall: false },
      { text: { en: "\"With unveiled faces we are being transformed into his image with ever-increasing glory.\"", fr: "« Nous sommes transformés en la même image, de gloire en gloire. »" }, ref: "2 Corinthians 3:18 / 2 Corinthiens 3:18", wide: false, tall: false },
    ],
  },

  practice: {
    label: { en: "How Faith Shows Up",             fr: "Comment la Foi Se Manifeste" },
    items: [
      { num: "01", name: { en: "Daily Study of Scripture",  fr: "Étude Quotidienne des Écritures"  }, desc: { en: "The Bible is not reserved for Sundays. Samuel approaches scripture with the same intellectual rigour he brings to research — reading deeply, questioning carefully, and allowing the text to challenge and reshape his thinking.", fr: "La Bible n'est pas réservée aux dimanches. Samuel aborde l'Écriture avec la même rigueur intellectuelle qu'il apporte à la recherche — lisant en profondeur, questionnant avec soin, et laissant le texte défier et remodeler sa pensée." } },
      { num: "02", name: { en: "Prayer as Orientation",      fr: "La Prière comme Orientation"      }, desc: { en: "Before decisions, before difficult conversations, before new seasons — Samuel grounds himself in prayer. It is not a ritual of words but a discipline of attentiveness: positioning himself to hear before he speaks.", fr: "Avant les décisions, avant les conversations difficiles, avant les nouvelles saisons — Samuel s'ancre dans la prière. Ce n'est pas un rituel de paroles mais une discipline d'attention : se positionner pour écouter avant de parler." } },
      { num: "03", name: { en: "Servant Leadership",         fr: "Leadership Serviteur"              }, desc: { en: "Every position of authority Samuel has held — from Class Prefect to President of the Collective Intelligence Consortium — has been exercised with the understanding that leadership is service. The model is clear: to lead is to give, not to take.", fr: "Chaque position d'autorité que Samuel a occupée — de préfet de classe à président du Consortium d'Intelligence Collective — a été exercée avec la compréhension que le leadership est un service. Le modèle est clair : diriger, c'est donner, pas prendre." } },
      { num: "04", name: { en: "Community & Belonging",       fr: "Communauté & Appartenance"        }, desc: { en: "Faith, for Samuel, is never solitary. From his roots in Ghana to his community in Morocco, he has consistently sought and built spaces where people encourage one another, bear one another's burdens, and grow together.", fr: "La foi, pour Samuel, n'est jamais solitaire. De ses racines au Ghana à sa communauté au Maroc, il a constamment cherché et construit des espaces où les gens s'encouragent mutuellement, portent les fardeaux des uns et des autres et grandissent ensemble." } },
      { num: "05", name: { en: "Gratitude as a Posture",      fr: "La Gratitude comme Posture"       }, desc: { en: "Each scholarship, each opportunity, each relationship is received with gratitude — not entitlement. Samuel views his story as a gift, and generosity with time, knowledge, and encouragement is his way of passing that gift forward.", fr: "Chaque bourse, chaque opportunité, chaque relation est reçue avec gratitude — non comme un droit. Samuel considère son histoire comme un cadeau, et la générosité en temps, en connaissance et en encouragement est sa façon de transmettre ce cadeau." } },
    ],
  },

  reflection: {
    ornament: "✦ ✦ ✦",
    quote: {
      en: "\"I am not defined by where I started,\nnor limited by where I stand today.\nI am being transformed —\nand that is enough to move forward.\"",
      fr: "« Je ne suis pas défini par là où j'ai commencé,\nni limité par là où je me trouve aujourd'hui.\nJe suis en train d'être transformé —\net cela suffit pour avancer. »",
    },
    quoteStrong: { en: "transformed", fr: "transformé" },
    ref: { en: "— Samuel Kobina Gyasi", fr: "— Samuel Kobina Gyasi" },
    body: {
      en: "Faith is not the elimination of questions. It is the courage to carry them forward, trusting that the One who began a good work will be faithful to complete it.",
      fr: "La foi n'est pas l'élimination des questions. C'est le courage de les porter en avant, en faisant confiance à Celui qui a commencé une bonne œuvre qu'il sera fidèle à l'achever.",
    },
  },

  blogStrip: {
    eyebrow:  { en: "The Faith Journal",            fr: "Le Journal de Foi" },
    title:    { en: "Writings on",                  fr: "Écrits sur" },
    titleEm:  { en: "Faith & Belief",               fr: "la Foi & la Conviction" },
    sub: {
      en: "Essays on scripture, sacred conviction, and the daily practice of trusting God — pen to paper, heart to page.",
      fr: "Essais sur l'Écriture, la conviction sacrée et la pratique quotidienne de la confiance en Dieu — plume sur papier, cœur sur page.",
    },
    btnBlog:  { en: "Read the Journal →",           fr: "Lire le Journal →" },
    btnCredo: { en: "Statement of Faith →",          fr: "Profession de Foi →" },
  },

  connect: {
    title1:   { en: "Spiritual",                    fr: "Dialogue" },
    title2:   { en: "Dialogue &",                   fr: "Spirituel &" },
    titleEm:  { en: "Connection",                   fr: "Connexion" },
    body: {
      en: "Samuel welcomes conversations about faith, belief, Scripture, and the sacred journey of walking with God. Whether you have questions or simply seek prayer — you are welcome.",
      fr: "Samuel accueille les conversations sur la foi, la croyance, l'Écriture et le chemin sacré de suivre Dieu. Que vous ayez des questions ou cherchiez simplement la prière — vous êtes le bienvenu.",
    },
    links: {
      email:      { en: "Email Samuel",             fr: "Écrire à Samuel" },
      credo:      { en: "My Story",                fr: "Mon Histoire" },
      blog:       { en: "Faith Journal",            fr: "Journal de Foi" },
    },
  },

  langToggle: { en: "FR", fr: "EN" },
  langLabel:  { en: "Français", fr: "English" },
};

export type FaithTranslations = typeof faithTranslations;
