import { Category } from "@prisma/client"

const creatorsMock = [
  {
    id: "2",
    username: "duchesse_aristochat",
    email: "duchesse@example.com",
    password: "hashed_password_2",
    profilePicture: {
      key: "/seed/e4f.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "FEMALE",
    description:
      "Miaou les amis ! 🐱 Abonne-toi pour voir cette chatte aristocrate s'étirer dans tous les sens. Je ronronne quand on me caresse et je griffe quand on me provoque. Contenus exclusifs de ma litière privée tous les vendredis. Rejoins mes VIP pour des séances de toilettage en direct où je lèche TOUT. #ChatteEnChaleur #GriffesDeHors",
    price: 20,
    age: 28,
  },
  {
    id: "3",
    username: "hello_kitty_officiel",
    email: "hello.kitty@example.com",
    password: "hashed_password_3",
    profilePicture: {
      key: "/seed/4sb.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "FEMALE",
    description:
      "Mrrrrr... Cette minette élégante te montre ses coussinets roses en exclusivité ! Administratrice de jour, mais la nuit, je deviens une vraie tigresse insatiable. Abonnement gratuit mais mes miaulements les plus sauvages sont en messages privés. Viens voir comment je joue avec ma pelote ! #ChatteLibérée #RonronnementNocturne",
    price: null,
    age: 35,
  },
  {
    id: "4",
    username: "garfield_lasagne",
    email: "garfield@example.com",
    password: "hashed_password_4",
    profilePicture: {
      key: "/seed/9u8.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "MALE",
    description:
      "Ce matou de gouttière a plus d'un tour dans son sac ! 🐈‍⬛ Photos quotidiennes de ma queue dressée et de mes griffes acérées. Pour les plus gourmands, vidéos de léchage en gros plan. Abonne-toi pour voir ce chat de rue marquer son territoire. Promotion : -20% pour voir mes coussinets mouillés ! #MatouDominant #GriffesEtLéchouilles",
    price: 15,
    age: 40,
  },
  {
    id: "6",
    username: "marie_aristochat",
    email: "marie@example.com",
    password: "hashed_password_6",
    profilePicture: {
      key: "/seed/au3.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "FEMALE",
    description:
      "🎵 Cette chatte musicienne fait vibrer plus que des cordes ! Contenus exclusifs où je me lèche au rythme du jazz. Mes miaulements atteignent des octaves que tu n'as jamais entendues ! Abonne-toi pour me voir jouer avec ma souris préférée tous les soirs. Ronronnements ASMR en bonus pour mes VIP. #ChatteHarmonie #MélodiesFélines",
    price: 25,
    age: 33,
  },
  {
    id: "8",
    username: "cheshire_wonderland",
    email: "cheshire@example.com",
    password: "hashed_password_8",
    profilePicture: {
      key: "/seed/bgf.png",
      filetype: "image/png",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "FEMALE",
    description:
      "🌍 Cette chatte voyageuse te fera découvrir des territoires inexplorés ! Je m'étire dans des positions exotiques venues des quatre coins du monde. Abonne-toi pour voir mes pattes écartées sur tous les continents ! Photos de mes coussinets mouillés en pleine jungle. Messages privés pour voir comment je marque mon territoire. #ChatteGlobetrotteuse #MiaulementsMondains",
    price: 18,
    age: 29,
  },
  {
    id: "10",
    username: "salem_witchcat",
    email: "salem@example.com",
    password: "hashed_password_10",
    profilePicture: {
      key: "/seed/bjf.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "FEMALE",
    description:
      "🖥️ Geekette féline qui ronronne en binaire ! Je lèche mon écran pour toi et je montre mes ports USB les plus secrets. Vidéos exclusives de moi jouant avec ma souris sans les pattes ! Contenus bonus : je renverse du lait sur mon clavier et je nettoie tout avec ma langue râpeuse. #ChatteConnectée #RonronnementVirtuel",
    price: 22,
    age: 26,
  },
  {
    id: "11",
    username: "felix_doctorcat",
    email: "felix@example.com",
    password: "hashed_password_11",
    profilePicture: {
      key: "/seed/MTY1NDA3OA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "MALE",
    description:
      "Docteur en ronronthérapie avec spécialité en anatomie féline ! 🩺 Abonne-toi pour un diagnostic quotidien de mes parties les plus sensibles. Je prescris des vidéos de mes coussinets en gros plan et des séances d'auscultation où j'examine TOUT avec ma langue. Traitement intensif en messagerie privée. #ChatMédecin #OrdonnanceCoquine",
    price: 28,
    age: 50,
  },
  {
    id: "12",
    username: "sylvestre_detecticat",
    email: "sylvestre@example.com",
    password: "hashed_password_12",
    profilePicture: {
      key: "/seed/MTcxNjAxOA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "MALE",
    description:
      "Ce détective félin résout l'énigme du plaisir ! 🔍 Photos exclusives où je traque la souris avec mon flair légendaire. Abonne-toi pour me voir lécher les indices et renifler les pistes les plus chaudes. Vidéos hebdomadaires où je montre mes techniques d'investigation sous la couette. Élémentaire, mon cher matou ! #ChatDétective #EnquêteSensuelle",
    price: 30,
    age: 40,
  },
  {
    id: "13",
    username: "tom_technocat",
    email: "tom@example.com",
    password: "hashed_password_13",
    profilePicture: {
      key: "/seed/MTc1MDUwMg.gif",
      filetype: "image/gif",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "MALE",
    description:
      "Ce chat de génie invente des positions jamais vues ! 💻 Photos quotidiennes de mon réacteur qui s'illumine d'excitation. Abonne-toi pour voir comment j'utilise ma technologie pour atteindre des sommets de plaisir félin. Vidéos exclusives de mes expérimentations avec mes jouets high-tech. #ChatInventeur #RonronnementsTechnologiques",
    price: 30,
    age: 45,
  },
  {
    id: "14",
    username: "chat_potte_officiel",
    email: "chat.potte@example.com",
    password: "hashed_password_14",
    profilePicture: {
      key: "/seed/r0.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    isCathub: true,
    sex: "MALE",
    description:
      "La nuit, ce chat devient une créature de l'ombre... 🦇 Abonne-toi pour voir ce que cache ma grotte secrète ! Photos exclusives de mon costume noir moulant et vidéos de mes prouesses nocturnes. Mes griffes laissent des marques que tu n'oublieras jamais. Messages privés pour des missions spéciales dans l'obscurité. #ChatVengeance #RonronnementsNocturnes",
    price: 27,
    age: 38,
  },
]

const postsMock = [
  {
    id: "p1-2",
    image: {
      key: "/seed/MjAwMjk5MQ.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Miaou! Ma première fois sans mon collier... Je suis une Maine Coon libérée et mes poils sont tous dressés d'excitation!",
    createdAt: new Date(2023, 8, 15, 14, 30),
    category: [Category.KINKY_KITTENS, Category.TABBY_TEASES],
    userId: "2",
  },
  {
    id: "p2-2",
    image: {
      key: "/seed/d3j.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes pupilles sont toutes dilatées... Je suis prête à jouer toute la nuit, viens caresser ma fourrure humide!",
    createdAt: new Date(2023, 9, 3, 9, 15),
    category: [Category.FELINE_FETISH],
    userId: "2",
  },
  {
    id: "p3-2",
    image: {
      key: "/seed/ebv.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mmmr... J'adore quand mon petit tigré me fait des câlins sur le canapé. Il sait exactement où me lécher!",
    createdAt: new Date(2023, 10, 21, 18, 45),
    category: [Category.WHISKER_WONDERS, Category.SULTRY_STRAYS],
    userId: "2",
  },
  {
    id: "p4-2",
    image: {
      key: "/seed/5ek.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Quand je m'étire, mes muscles félins te montrent à quel point je suis souple. Prêt à explorer mon territoire sauvage?",
    createdAt: new Date(2022, 10, 12, 15, 20),
    category: [Category.FELINE_FETISH],
    userId: "2",
  },
  {
    id: "p5-2",
    image: {
      key: "/seed/6r4.jpg",
      filetype: "image/ ",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon lasso de vérité révèle que tu as des pensées très coquines me concernant... Laisse-moi te punir pour ça!",
    createdAt: new Date(2023, 0, 8, 12, 45),
    category: [Category.SULTRY_STRAYS, Category.KINKY_KITTENS],
    userId: "2",
  },
  {
    id: "p6-2",
    image: {
      key: "/seed/d90.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Cette princesse sait comment manier son fouet... Miaou! Mes griffes sont sorties et prêtes à te marquer!",
    createdAt: new Date(2023, 2, 27, 18, 30),
    category: [Category.WHISKER_WONDERS],
    userId: "2",
  },
  {
    id: "p1-3",
    image: {
      key: "/seed/aap.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "J'administre ma toilette intime... Tu aimes regarder quand je lèche mes parties les plus sensibles? Vilain matou!",
    createdAt: new Date(2023, 7, 11, 11, 20),
    category: [Category.TABBY_TEASES],
    userId: "3",
  },
  {
    id: "p2-3",
    image: {
      key: "/seed/s_SbQ3Xju.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes coussinets roses sont si doux et sensibles... Touche-les et je te promets de ronronner très fort pour toi!",
    createdAt: new Date(2023, 8, 22, 15, 10),
    category: [Category.FELINE_FETISH, Category.WHISKER_WONDERS],
    userId: "3",
  },
  {
    id: "p3-3",
    image: {
      key: "/seed/8fb.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Une sieste coquine avec mon rouquin... nos corps chauds et velus entrelacés sous les draps froissés.",
    createdAt: new Date(2023, 9, 14, 8, 30),
    category: [Category.SULTRY_STRAYS],
    userId: "3",
  },
  {
    id: "p4-3",
    image: {
      key: "/seed/abg.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je peux sauter très haut... surtout quand je m'empale sur des choses excitantes! Miaou de plaisir!",
    createdAt: new Date(2022, 9, 15, 16, 10),
    category: [Category.TABBY_TEASES],
    userId: "3",
  },
  {
    id: "p5-3",
    image: {
      key: "/seed/acd.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes sens félins détectent ton désir à des kilomètres... Laisse-moi renifler ton entrejambe pour confirmer!",
    createdAt: new Date(2022, 11, 28, 9, 30),
    category: [Category.FELINE_FETISH, Category.WHISKER_WONDERS],
    userId: "3",
  },
  {
    id: "p6-3",
    image: {
      key: "/seed/a47.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce matou et moi travaillons notre relation... avec beaucoup de friction et de positions expérimentales!",
    createdAt: new Date(2023, 1, 14, 20, 45),
    category: [Category.SULTRY_STRAYS],
    userId: "3",
  },
  {
    id: "p1-4",
    image: {
      key: "/seed/c31.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je m'étire sur ton clavier... Tu aimes quand je me mets à quatre pattes comme ça, la queue bien levée?",
    createdAt: new Date(2023, 6, 5, 19, 45),
    category: [Category.KINKY_KITTENS],
    userId: "4",
  },
  {
    id: "p2-4",
    image: {
      key: "/seed/dbl.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ma première expérience en laisse! J'adore quand tu me contrôles fermement et me montres qui est le maître...",
    createdAt: new Date(2023, 7, 18, 17, 30),
    category: [Category.TABBY_TEASES, Category.SULTRY_STRAYS],
    userId: "4",
  },
  {
    id: "p3-4",
    image: {
      key: "/seed/e4f.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Moment intime avec mon Sphinx... un amour sans poils qui me permet d'accéder à toutes ses zones sensibles!",
    createdAt: new Date(2023, 9, 2, 12, 15),
    category: [Category.FELINE_FETISH],
    userId: "4",
  },
  {
    id: "p4-4",
    image: {
      key: "/seed/bua.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je grimpe aux murs d'excitation quand tu me caresses... Ma morsure laissera des marques de plaisir!",
    createdAt: new Date(2022, 8, 20, 17, 35),
    category: [Category.KINKY_KITTENS],
    userId: "4",
  },
  {
    id: "p5-4",
    image: {
      key: "/seed/c6q.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Photos de chats en chaleur > tout le reste. Regarde comme ma posture t'invite à venir jouer!",
    createdAt: new Date(2022, 10, 5, 14, 20),
    category: [Category.TABBY_TEASES, Category.WHISKER_WONDERS],
    userId: "4",
  },
  {
    id: "p6-4",
    image: {
      key: "/seed/dkn.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon sens félin me dit que tu prépares quelque chose de coquin... et mon corps frémissant est prêt!",
    createdAt: new Date(2022, 12, 19, 11, 15),
    category: [Category.FELINE_FETISH],
    userId: "4",
  },

  {
    id: "p1-6",
    image: {
      key: "/seed/cs_LyHtif.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je ronronne en rythme quand tu joues du piano... mais je vibre encore plus fort quand tu joues avec moi!",
    createdAt: new Date(2023, 5, 12, 20, 30),
    category: [Category.WHISKER_WONDERS],
    userId: "6",
  },
  {
    id: "p2-6",
    image: {
      key: "/seed/78d.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Session d'enregistrement torride... Tu veux entendre mes miaulements quand j'atteins le septième ciel?",
    createdAt: new Date(2023, 6, 28, 13, 45),
    category: [Category.SULTRY_STRAYS, Category.KINKY_KITTENS],
    userId: "6",
  },
  {
    id: "p3-6",
    image: {
      key: "/seed/ziBew-QH2.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes yeux bleus te fixent pendant que ma langue rose lèche sensuellement mes babines... Hypnotisé?",
    createdAt: new Date(2023, 8, 7, 9, 10),
    category: [Category.FELINE_FETISH],
    userId: "6",
  },
  {
    id: "p4-6",
    image: {
      key: "/seed/28j.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je suis si discrète en mission que tu ne m'entendras pas venir... mais tu sentiras ma langue râpeuse partout!",
    createdAt: new Date(2022, 7, 18, 22, 10),
    category: [Category.SULTRY_STRAYS],
    userId: "6",
  },
  {
    id: "p5-6",
    image: {
      key: "/seed/2bs.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Je comprends tous tes ordres secrets... 'Plus bas', 'Plus vite', 'Miaou'... Je suis ton agent spécial à fourrure!",
    createdAt: new Date(2022, 9, 30, 19, 45),
    category: [Category.KINKY_KITTENS, Category.WHISKER_WONDERS],
    userId: "6",
  },
  {
    id: "p6-6",
    image: {
      key: "/seed/dh5.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "L'entraînement commence jeune... Cette petite chatte est déjà capable de te faire atteindre l'extase en quelques coups de langue!",
    createdAt: new Date(2022, 11, 12, 15, 30),
    category: [Category.TABBY_TEASES],
    userId: "6",
  },

  {
    id: "p1-8",
    image: {
      key: "/seed/IMG_3753.jpg%3Fex%3D67c1759d%26is%3D67c0241d%26hm%3D1b04e2f49c1da91d963ecd0eaa41705d12110e245419f2177bc6ca16499264b9%26",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce chat balinais m'a suivie toute la journée... Il a reniflé mon intimité et s'est frotté entre mes jambes sans arrêt!",
    createdAt: new Date(2023, 4, 9, 16, 20),
    category: [Category.SULTRY_STRAYS],
    userId: "8",
  },
  {
    id: "p2-8",
    image: {
      key: "/seed/ehu.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Blogging avec mon compagnon sur mes genoux... Sa queue qui frétille contre mon entrejambe me donne des idées coquines!",
    createdAt: new Date(2023, 6, 15, 10, 45),
    category: [Category.TABBY_TEASES, Category.WHISKER_WONDERS],
    userId: "8",
  },
  {
    id: "p3-8",
    image: {
      key: "/seed/8ik.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Chat errant adopté à Lisbonne... Il est devenu mon compagnon de voyage et de plaisir sous les draps exotiques!",
    createdAt: new Date(2023, 7, 30, 14, 25),
    category: [Category.KINKY_KITTENS],
    userId: "8",
  },
  {
    id: "p4-8",
    image: {
      key: "/seed/717.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce patriote aime se vautrer sur les drapeaux... et sur mon corps! Sa langue exploratrice ne connaît pas de frontières!",
    createdAt: new Date(2022, 6, 4, 13, 15),
    category: [Category.FELINE_FETISH],
    userId: "8",
  },
  {
    id: "p5-8",
    image: {
      key: "/seed/cem.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "70 ans de congélation n'ont rien changé... Ce chat m'attendait pour réchauffer mon corps glacé avec sa langue de feu!",
    createdAt: new Date(2022, 8, 25, 10, 45),
    category: [Category.WHISKER_WONDERS, Category.SULTRY_STRAYS],
    userId: "8",
  },
  {
    id: "p6-8",
    image: {
      key: "/seed/bsp.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon bouclier protège cette petite chatte sensible... Mais qui me protégera de ses assauts de plaisir?",
    createdAt: new Date(2022, 10, 15, 16, 30),
    category: [Category.KINKY_KITTENS],
    userId: "8",
  },

  {
    id: "p1-10",
    image: {
      key: "/seed/1oe.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon chat curieux explore tous mes nouveaux gadgets... surtout les vibrants qui me font miauler de plaisir!",
    createdAt: new Date(2023, 3, 20, 12, 10),
    category: [Category.WHISKER_WONDERS],
    userId: "10",
  },
  {
    id: "p2-10",
    image: {
      key: "/seed/MTc0NDc0OA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Séance nocturne avec mon félin sur les épaules... Pendant que je code, il me lèche le cou et me fait frissonner!",
    createdAt: new Date(2023, 5, 5, 22, 30),
    category: [Category.FELINE_FETISH, Category.KINKY_KITTENS],
    userId: "10",
  },
  {
    id: "p3-10",
    image: {
      key: "/seed/cim.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Cette petite minette a choisi mon bureau comme terrain de jeu... Elle aime s'étaler sur mon clavier, les pattes écartées!",
    createdAt: new Date(2023, 7, 14, 15, 45),
    category: [Category.TABBY_TEASES],
    userId: "10",
  },
  {
    id: "p4-10",
    image: {
      key: "/seed/abm.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce chat reste calme même quand je m'emporte... Sa langue râpeuse sur mes zones sensibles apaise toutes mes tensions!",
    createdAt: new Date(2022, 5, 22, 18, 20),
    category: [Category.WHISKER_WONDERS],
    userId: "10",
  },
  {
    id: "p5-10",
    image: {
      key: "/seed/adc.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Expériences scientifiques: ce chat préfère lécher la crème entre mes doigts plutôt que dans son bol!",
    createdAt: new Date(2022, 7, 14, 11, 10),
    category: [Category.TABBY_TEASES, Category.FELINE_FETISH],
    userId: "10",
  },
  {
    id: "p6-10",
    image: {
      key: "/seed/3vl.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Son ronronnement apaise même le Hulk... Imagine ce que sa langue peut faire à ton petit monstre!",
    createdAt: new Date(2022, 9, 8, 20, 45),
    category: [Category.SULTRY_STRAYS],
    userId: "10",
  },

  {
    id: "p1-11",
    image: {
      key: "/seed/d7f.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon diagnostic: ce chat souffre d'un excès de sensualité... Le traitement implique des caresses prolongées dans les zones intimes!",
    createdAt: new Date(2023, 2, 18, 14, 20),
    category: [Category.SULTRY_STRAYS, Category.WHISKER_WONDERS],
    userId: "11",
  },
  {
    id: "p2-11",
    image: {
      key: "/seed/abr.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon assistant médical félin détecte les points sensibles avec sa langue... Son diagnostic est toujours mouillé mais précis!",
    createdAt: new Date(2023, 4, 23, 9, 15),
    category: [Category.KINKY_KITTENS],
    userId: "11",
  },
  {
    id: "p3-11",
    image: {
      key: "/seed/cua.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce chat a un QI plus élevé que mes internes... et il connaît bien mieux l'anatomie des zones de plaisir!",
    createdAt: new Date(2023, 6, 9, 17, 40),
    category: [Category.FELINE_FETISH],
    userId: "11",
  },
  {
    id: "p4-11",
    image: {
      key: "/seed/bis.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce matou perçoit les réalités alternatives... Dans toutes, sa langue exploratrice trouve mes points G!",
    createdAt: new Date(2022, 4, 10, 17, 40),
    category: [Category.KINKY_KITTENS, Category.WHISKER_WONDERS],
    userId: "11",
  },
  {
    id: "p5-11",
    image: {
      key: "/seed/bi9.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon chat apparaît sous mes draps comme par magie... Son pouvoir de téléportation le mène toujours entre mes cuisses!",
    createdAt: new Date(2022, 6, 25, 14, 15),
    category: [Category.FELINE_FETISH],
    userId: "11",
  },
  {
    id: "p6-11",
    image: {
      key: "/seed/bnb.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Cette lueur rouge dans ses yeux la nuit... C'est quand il me regarde me toucher que son regard s'enflamme!",
    createdAt: new Date(2022, 8, 17, 21, 30),
    category: [Category.SULTRY_STRAYS, Category.TABBY_TEASES],
    userId: "11",
  },

  {
    id: "p1-12",
    image: {
      key: "/seed/MTUzOTY3NQ.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "L'affaire du jouet perdu... Je l'ai retrouvé à quatre pattes, mon derrière relevé, en reniflant sous le lit!",
    createdAt: new Date(2023, 1, 14, 18, 30),
    category: [Category.TABBY_TEASES],
    userId: "12",
  },
  {
    id: "p2-12",
    image: {
      key: "/seed/1tj.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "En bon détective, je peux sentir ton excitation... Laisse-moi inspecter ton entrejambe pour recueillir plus d'indices!",
    createdAt: new Date(2023, 3, 27, 11, 45),
    category: [Category.WHISKER_WONDERS, Category.SULTRY_STRAYS],
    userId: "12",
  },
  {
    id: "p3-12",
    image: {
      key: "/seed/b19.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "L'affaire des griffures mystérieuses... Elles sont apparues sur ton dos après notre nuit torride, élémentaire!",
    createdAt: new Date(2023, 5, 16, 15, 20),
    category: [Category.FELINE_FETISH],
    userId: "12",
  },
  {
    id: "p4-12",
    image: {
      key: "/seed/9no.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "J'analyse les probabilités que tu craques quand je me lèche sensuellement devant toi... 100% selon mes calculs!",
    createdAt: new Date(2022, 3, 5, 15, 20),
    category: [Category.WHISKER_WONDERS, Category.FELINE_FETISH],
    userId: "12",
  },
  {
    id: "p5-12",
    image: {
      key: "/seed/9u7.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "La conscience féline comprend le plaisir mieux que personne... Observe ma queue frétiller quand je m'approche de toi!",
    createdAt: new Date(2022, 5, 18, 12, 45),
    category: [Category.TABBY_TEASES],
    userId: "12",
  },
  {
    id: "p6-12",
    image: {
      key: "/seed/c98.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes yeux reflètent mon intelligence... et le désir que j'ai de te mordiller les oreilles pendant nos ébats!",
    createdAt: new Date(2022, 7, 30, 9, 15),
    category: [Category.SULTRY_STRAYS, Category.KINKY_KITTENS],
    userId: "12",
  },

  {
    id: "p1-13",
    image: {
      key: "/seed/95g.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mon armure Iron Cat est rigide et brillante... tout comme certaines parties de mon anatomie quand je te vois!",
    createdAt: new Date(2022, 12, 10, 21, 15),
    category: [Category.KINKY_KITTENS],
    userId: "13",
  },
  {
    id: "p2-13",
    image: {
      key: "/seed/43a.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "J'adore tester de nouveaux jouets vibrants... Ils font ronronner ma petite chatte de plaisir toute la nuit!",
    createdAt: new Date(2023, 2, 5, 13, 40),
    category: [Category.TABBY_TEASES, Category.WHISKER_WONDERS],
    userId: "13",
  },
  {
    id: "p3-13",
    image: {
      key: "/seed/a3d.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Jarvis, allume le laser... J'aime quand ce point rouge se balade sur toutes mes zones érogènes!",
    createdAt: new Date(2023, 4, 18, 16, 30),
    category: [Category.FELINE_FETISH],
    userId: "13",
  },
  {
    id: "p4-13",
    image: {
      key: "/seed/MTgwODA3MA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce félin noir a la noblesse d'un roi... Sa langue royale sait exactement comment me faire jouir!",
    createdAt: new Date(2022, 2, 12, 16, 30),
    category: [Category.FELINE_FETISH, Category.WHISKER_WONDERS],
    userId: "13",
  },
  {
    id: "p5-13",
    image: {
      key: "/seed/MTU2ODk0NA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "La panthère et le chat sont cousins... Tous deux aiment se faufiler dans l'obscurité pour surprendre leur proie!",
    createdAt: new Date(2022, 4, 25, 13, 10),
    category: [Category.SULTRY_STRAYS],
    userId: "13",
  },
  {
    id: "p6-13",
    image: {
      key: "/seed/MTYyNTc1MA.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce félin possède une sagesse ancestrale... Il connaît des positions que même le Kamasutra a oubliées!",
    createdAt: new Date(2022, 6, 8, 19, 45),
    category: [Category.KINKY_KITTENS, Category.TABBY_TEASES],
    userId: "13",
  },

  {
    id: "p1-14",
    image: {
      key: "/seed/4bp.gif",
      filetype: "image/gif",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Dans ma bat-grotte humide et sombre, mes instincts sauvages se réveillent... Ma queue se dresse à ton approche!",
    createdAt: new Date(2022, 11, 5, 23, 45),
    category: [Category.SULTRY_STRAYS],
    userId: "14",
  },
  {
    id: "p2-14",
    image: {
      key: "/seed/bbi.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Alfred sait exactement où me gratter pour me faire miauler de plaisir... Ses doigts experts trouvent toujours mes points sensibles!",
    createdAt: new Date(2023, 1, 20, 19, 10),
    category: [Category.KINKY_KITTENS, Category.WHISKER_WONDERS],
    userId: "14",
  },
  {
    id: "p3-14",
    image: {
      key: "/seed/4g4.gif",
      filetype: "image/gif",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Même les milliardaires ont besoin d'affection... Viens réchauffer mon lit et faire vibrer mes cordes sensibles!",
    createdAt: new Date(2023, 3, 15, 14, 30),
    category: [Category.TABBY_TEASES],
    userId: "14",
  },
  {
    id: "p4-14",
    image: {
      key: "/seed/MTc4NTcxMg.gif",
      filetype: "image/gif",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Ce matou solitaire a survécu dans les rues... Maintenant il cherche une chatte en chaleur pour partager sa nuit!",
    createdAt: new Date(2022, 1, 20, 14, 15),
    category: [Category.SULTRY_STRAYS, Category.WHISKER_WONDERS],
    userId: "14",
  },
  {
    id: "p5-14",
    image: {
      key: "/seed/7iq.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Férocité et tendresse à la fois... Ma langue peut te griffer délicatement ou te lécher passionnément!",
    createdAt: new Date(2022, 3, 15, 10, 30),
    category: [Category.FELINE_FETISH],
    userId: "14",
  },
  {
    id: "p6-14",
    image: {
      key: "/seed/91i.jpg",
      filetype: "image/jpg",
      bucket: "cathub",
      endpoint: "s3.fr-par.scw.cloud",
    },
    text: "Mes griffes acérées te marqueront comme mien... Un peu de douleur pour beaucoup de plaisir, miaou!",
    createdAt: new Date(2022, 5, 28, 17, 50),
    category: [Category.KINKY_KITTENS, Category.TABBY_TEASES],
    userId: "14",
  },
]

export default { creatorsMock, postsMock }
