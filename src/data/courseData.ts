import { Tab, Tool, Partner, SectionContentProps, CourseDetail } from "@/types/course";
import { courses } from "@/data/homeData";

const tabs: Tab[] = [
  { title: "Introduction", key: "introduction" },
  { title: "Curriculum", key: "curriculum", active: true },
  { title: "Campus", key: "campus" },
  { title: "Méthodologie", key: "method" },
  { title: "Carrières", key: "careers" },
  { title: "Financement", key: "financing" },
  { title: "Admission", key: "admission" },
];

const partners: Partner[] = [
  { name: "Orange Guinée" },
  { name: "Guinea Technology" },
  { name: "Startups locales" },
  { name: "Marché de Madina" },
  { name: "Tech Innovators" },
];

const sectionContents: Record<string, Record<string, SectionContentProps>> = {
  "web-development": {
    introduction: {
      title: "Introduction",
      subtitle: "Sculptez votre avenir en 9 semaines de code",
      description:
        "Devenez développeur web full-stack et maîtrisez l’intégration de l’IA avec Goulotech à Conakry. Ce bootcamp unique vous prépare à créer des solutions pour des entreprises locales comme Orange Guinée ou des projets comme le Marché de Madina.",
      items: [
        "Maîtrisez les bases du web et de l’IA",
        "Créez des applications dynamiques",
        "Développez des projets full-stack avec IA",
        "Construisez un portfolio percutant",
      ],
      children: {
        title: "Les outils et langages que vous apprendrez :",
        content: [
          { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
          { src: "/img/icon-openai.webp", name: "OpenAI" },
          { src: "/img/icon-github.svg", name: "GitHub" },
          { src: "/img/icon-html.svg", name: "HTML" },
        ],
      },
    },
    curriculum: {
      title: "Curriculum",
      subtitle: "Le seul bootcamp qui enseigne le développement web et l’intégration de l’IA",
      description:
        "Contrairement aux bootcamps de codage traditionnels, notre curriculum éprouvé intègre l’intelligence artificielle comme composante centrale, adapté à l’écosystème technologique guinéen.",
      items: [
        "Développement web full-stack avec architecture MVC",
        "Programmation orientée objet et conception de bases de données",
        "Intégration de l’IA avec les grands modèles de langage (LLM)",
        "Codage assisté par IA et collaboration stratégique",
        "Déploiement en production et optimisation",
      ],
      children: {
        overviewTitle: "Du code à l’IA en 9 semaines intensives",
        overviewDescription:
          "Maîtrisez les compétences fondamentales de l’économie numérique et les capacités d’IA qui définiront les innovations de demain. Ce cours complet vous apprend à créer des applications IA avec les technologies de ChatGPT et des startups modernes, inspirées des besoins de Conakry.",
        modules: [
          {
            number: 1,
            title: "Fondations et bases de la programmation",
            duration: "90H",
            description:
              "Établissez votre environnement de développement et maîtrisez la syntaxe de JavaScript tout en pensant comme un programmeur. Structurez votre logiciel selon les principes orientés objet et apprenez le modèle MVC en codant des applications depuis zéro.",
            steps: [
              "Construisez des jeux basés sur la ligne de commande",
              "Créez des scripts pour détecter les e-mails et numéros de téléphone",
              "Développez des scrapers web pour collecter des données e-commerce",
              "Construisez une application de gestion de recettes avec MVC",
              "Traitez des ensembles de données et intégrez des API",
              "Concevez des composants de code modulaires et réutilisables",
            ],
            tools: [
              { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
              { src: "/img/icon-html.svg", name: "HTML" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
          {
            number: 2,
            title: "Architecture logicielle",
            duration: "80H",
            description:
              "Apprenez à concevoir des applications web évolutives avec l’architecture MVC, en mettant l’accent sur un code propre, adapté aux startups guinéennes comme celles du Marché de Madina.",
            steps: [
              "Structurez les applications avec les principes MVC",
              "Implémentez des API RESTful",
              "Concevez des systèmes back-end évolutifs",
              "Intégrez le front-end avec le back-end",
              "Optimisez les performances du code",
            ],
            tools: [
              { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
              { src: "/img/icon-sql.svg", name: "SQL" },
              { src: "/img/icon-copilot.webp", name: "Copilot" },
            ],
          },
          {
            number: 3,
            title: "Bases de données et SQL",
            duration: "70H",
            description:
              "Maîtrisez les bases de données relationnelles et SQL pour gérer et interroger les données efficacement, comme pour les systèmes d’inventaire d’Orange Guinée.",
            steps: [
              "Concevez des schémas de bases de données relationnelles",
              "Écrivez des requêtes SQL complexes",
              "Optimisez les performances des bases de données",
              "Intégrez les bases de données avec des applications web",
            ],
            tools: [
              { src: "/img/icon-sql.svg", name: "SQL" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
          {
            number: 4,
            title: "Développement front-end",
            duration: "80H",
            description:
              "Construisez des interfaces utilisateur dynamiques et responsives avec des frameworks JavaScript modernes pour des expériences engageantes en Guinée.",
            steps: [
              "Créez des mises en page responsives avec HTML et CSS",
              "Construisez des interfaces interactives avec JavaScript",
              "Utilisez React pour des interfaces basées sur des composants",
              "Optimisez les performances du front-end",
            ],
            tools: [
              { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
              { src: "/img/icon-html.svg", name: "HTML" },
              { src: "/img/icon-figma.svg", name: "Figma" },
            ],
          },
          {
            number: 5,
            title: "Développement web full-stack",
            duration: "90H",
            description:
              "Combinez front-end et back-end pour construire des applications web complètes avec intégration de l’IA, comme des plateformes e-commerce pour le Marché de Madina.",
            steps: [
              "Intégrez le front-end et le back-end",
              "Déployez des applications en production",
              "Implémentez l’authentification des utilisateurs",
              "Optimisez les performances full-stack",
            ],
            tools: [
              { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
              { src: "/img/icon-copilot.webp", name: "Copilot" },
            ],
          },
          {
            number: 6,
            title: "Semaine IA",
            duration: "60H",
            description:
              "Plongez dans les concepts de l’IA et intégrez les grands modèles de langage dans des applications web pour des solutions innovantes à Conakry.",
            steps: [
              "Comprendre les fondamentaux de l’IA",
              "Intégrer les LLM dans des applications",
              "Utiliser des API d’IA pour l’automatisation",
              "Tester les fonctionnalités pilotées par l’IA",
            ],
            tools: [
              { src: "/img/icon-openai.webp", name: "OpenAI" },
              { src: "/img/icon-copilot.webp", name: "Copilot" },
            ],
          },
          {
            number: 7,
            title: "Codage assisté par IA",
            duration: "50H",
            description:
              "Exploitez des outils d’IA comme Copilot pour améliorer l’efficacité du codage et la collaboration, préparant au développement en Guinée.",
            steps: [
              "Utiliser l’IA pour l’auto-complétion de code",
              "Automatiser les tâches répétitives",
              "Collaborer avec des outils d’IA",
              "Déboguer avec l’assistance de l’IA",
            ],
            tools: [
              { src: "/img/icon-copilot.webp", name: "Copilot" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
          {
            number: 8,
            title: "Projet final",
            duration: "100H",
            description:
              "Construisez et déployez une application web full-stack avec des fonctionnalités d’IA, comme une plateforme pour le Marché de Madina, pour mettre en valeur vos compétences.",
            steps: [
              "Planifier un projet full-stack",
              "Développer le front-end et le back-end",
              "Intégrer des fonctionnalités d’IA",
              "Déployer en production",
              "Présenter aux parties prenantes",
            ],
            tools: [
              { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
              { src: "/img/icon-openai.webp", name: "OpenAI" },
              { src: "/img/icon-github.svg", name: "GitHub" },
              { src: "/img/icon-html.svg", name: "HTML" },
            ],
          },
        ],
        technologies: [
          { src: "/img/icon-javascript-lg.svg", name: "JavaScript" },
          { src: "/img/icon-openai.webp", name: "OpenAI" },
          { src: "/img/icon-github.svg", name: "GitHub" },
          { src: "/img/icon-html.svg", name: "HTML" },
        ],
      },
    },
    campus: {
      title: "Campus",
      subtitle: "Un espace moderne à Conakry",
      description:
        "Notre campus à Conakry offre un espace dynamique équipé d’ordinateurs grâce à des partenariats locaux, parfait pour coder et collaborer.",
      items: [
        "Salles de classe modernes avec ordinateurs fournis",
        "Connexion Internet fiable pour un codage sans interruption",
        "Espaces pour le pair programming et les hackathons",
      ],
    },
    method: {
      title: "Méthodologie",
      subtitle: "Apprentissage pratique",
      description:
        "Notre approche pratique transforme les débutants en développeurs confiants en 9 semaines, avec un mentorat par des experts locaux.",
      items: [
        "80 % de pratique : codez dès le premier jour",
        "Pair programming : apprenez plus vite ensemble",
        "Hackathons hebdomadaires : stimulez la créativité",
        "Mentorat quotidien : accompagnement personnalisé",
      ],
    },
    careers: {
      title: "Carrières",
      subtitle: "Services de carrière",
      description:
        "Préparez-vous à une carrière dans la tech avec un portfolio solide, un coaching de carrière et des connexions avec des employeurs locaux comme Orange Guinée.",
      items: [
        "Portfolio professionnel : impressionnez les recruteurs",
        "Coaching de carrière : CV, entretiens, LinkedIn",
        "Réseau d’employeurs : opportunités locales et mondiales",
        "400 heures de formation intensive",
      ],
    },
    financing: {
      title: "Financement",
      subtitle: "Accessible à tous",
      description:
        "Des options flexibles garantissent que chaque Guinéen motivé peut rejoindre la révolution technologique.",
      items: [
        "Bourses pour les jeunes motivés",
        "Plans de paiement adaptés à tous les budgets",
        "Accords de partage de revenus : payez après l’emploi",
      ],
    },
    admission: {
      title: "Admission",
      subtitle: "Rejoignez-nous dès aujourd’hui",
      description:
        "Aucune expérience en codage requise, juste de la passion et de la motivation. Postulez maintenant pour façonner votre avenir dans la tech !",
      items: [
        "Aucun prérequis : la motivation suffit",
        "Processus simple : postulez en quelques minutes",
        "Places limitées : sécurisez la vôtre maintenant",
      ],
      children: {
        type: "button",
        label: "Postuler maintenant",
        size: "lg",
      },
    },
  },
  "data-ai-course": {
    introduction: {
      title: "Data Science & IA",
      subtitle: "Formation complète en ingénierie des données",
      description: "Devenez expert en analyse de données, machine learning et MLOps avec des applications concrètes pour le marché africain.",
      items: [
        "Python avancé pour la data",
        "Machine Learning et Deep Learning",
        "Visualisation professionnelle",
        "MLOps et déploiement",
        "Traitement du langage naturel"
      ],
      children: {
        title: "Stack technique complète :",
        content: [
          { src: "/img/tech/python.svg", name: "Python" },
          { src: "/img/tech/pytorch.svg", name: "PyTorch" },
          { src: "/img/tech/kubeflow.svg", name: "Kubeflow" },
          { src: "/img/tech/snowflake.svg", name: "Snowflake" }
        ],
      },
    },
    curriculum: {
      title: "Programme Data Scientist",
      subtitle: "De la donnée brute aux modèles en production",
      description: "Parcours complet couvrant l'ensemble du pipeline de data science avec des cas concrets sur des données africaines.",
      items: [
        "9 semaines intensives (450 heures)",
        "6 projets professionnels",
        "Datasets locaux réels",
        "Préparation aux certifications AWS/GCP",
        "Accès à des clusters GPU"
      ],
      children: {
        overviewTitle: "Parcours d'apprentissage",
        overviewDescription: "Programme conçu par des data scientists seniors ayant travaillé sur des projets panafricains.",
        modules: [
          {
            number: 1,
            title: "Fondamentaux Python pour la Data",
            duration: "90H",
            description: "Maîtrise des librairies scientifiques et des bonnes pratiques.",
            steps: [
              "NumPy/Pandas avancés",
              "Manipulation de gros datasets",
              "Optimisation mémoire",
              "Parallel processing",
              "Tests unitaires"
            ],
            tools: [
              { src: "/img/tech/python.svg", name: "Python" },
              { src: "/img/tech/jupyter.svg", name: "Jupyter" }
            ],
          },
          {
            number: 2,
            title: "Analyse Exploratoire",
            duration: "80H",
            description: "Techniques professionnelles de nettoyage et d'analyse.",
            steps: [
              "Feature engineering",
              "Détection d'anomalies",
              "Analyse multivariée",
              "Visualisation avancée",
              "Storytelling data"
            ],
            tools: [
              { src: "/img/tech/pandas.svg", name: "Pandas" },
              { src: "/img/tech/seaborn.svg", name: "Seaborn" }
            ],
          },
          {
            number: 3,
            title: "Machine Learning",
            duration: "100H",
            description: "Algorithmes supervisés et non-supervisés.",
            steps: [
              "Préprocessing avancé",
              "Sélection de modèles",
              "Optimisation hyperparamètres",
              "Feature importance",
              "Interprétabilité"
            ],
            tools: [
              { src: "/img/tech/scikitlearn.svg", name: "Scikit-learn" },
              { src: "/img/tech/xgboost.svg", name: "XGBoost" }
            ],
          },
          {
            number: 4,
            title: "Deep Learning",
            duration: "90H",
            description: "Architectures neuronales modernes.",
            steps: [
              "TensorFlow/PyTorch",
              "Computer Vision",
              "NLP avec transformers",
              "Transfer learning",
              "Optimisation GPU"
            ],
            tools: [
              { src: "/img/tech/tensorflow.svg", name: "TensorFlow" },
              { src: "/img/tech/pytorch.svg", name: "PyTorch" }
            ],
          },
          {
            number: 5,
            title: "MLOps",
            duration: "80H",
            description: "Industrialisation des modèles.",
            steps: [
              "Pipeline automatisé",
              "Versioning des modèles",
              "Monitoring en production",
              "CI/CD pour ML",
              "Serving optimisé"
            ],
            tools: [
              { src: "/img/tech/mlflow.svg", name: "MLflow" },
              { src: "/img/tech/kubeflow.svg", name: "Kubeflow" }
            ],
          },
          {
            number: 6,
            title: "Projet Final",
            duration: "110H",
            description: "Solution complète de A à Z.",
            steps: [
              "Collecte de données locales",
              "Entraînement de modèles",
              "API de prédiction",
              "Dashboard interactif",
              "Présentation aux experts"
            ],
            tools: [
              { src: "/img/tech/fastapi.svg", name: "FastAPI" },
              { src: "/img/tech/streamlit.svg", name: "Streamlit" }
            ],
          }
        ],
        technologies: [
          { src: "/img/tech/spark.svg", name: "Spark" },
          { src: "/img/tech/airflow.svg", name: "Airflow" },
          { src: "/img/tech/databricks.svg", name: "Databricks" },
          { src: "/img/tech/tableau.svg", name: "Tableau" }
        ],
      },
    },
    campus: {
      title: "Campus",
      subtitle: "Un espace moderne à Conakry",
      description:
        "Notre campus à Conakry offre un espace dynamique équipé d’ordinateurs grâce à des partenariats locaux, parfait pour coder et collaborer.",
      items: [
        "Salles de classe modernes avec ordinateurs fournis",
        "Connexion Internet fiable pour un codage sans interruption",
        "Espaces pour le pair programming et les hackathons",
      ],
    },
    method: {
      title: "Méthodologie",
      subtitle: "Apprentissage pratique",
      description:
        "Notre approche pratique transforme les débutants en data scientists confiants en 9 semaines, avec un mentorat par des experts locaux.",
      items: [
        "80 % de pratique : analysez des données dès le premier jour",
        "Pair programming : apprenez plus vite ensemble",
        "Hackathons hebdomadaires : stimulez la créativité",
        "Mentorat quotidien : accompagnement personnalisé",
      ],
    },
    careers: {
      title: "Carrières",
      subtitle: "Services de carrière",
      description:
        "Préparez-vous à une carrière dans la tech avec un portfolio solide, un coaching de carrière et des connexions avec des employeurs locaux comme Orange Guinée.",
      items: [
        "Portfolio professionnel : impressionnez les recruteurs",
        "Coaching de carrière : CV, entretiens, LinkedIn",
        "Réseau d’employeurs : opportunités locales et mondiales",
        "400 heures de formation intensive",
      ],
    },
    financing: {
      title: "Financement",
      subtitle: "Accessible à tous",
      description:
        "Des options flexibles garantissent que chaque Guinéen motivé peut rejoindre la révolution technologique.",
      items: [
        "Bourses pour les jeunes motivés",
        "Plans de paiement adaptés à tous les budgets",
        "Accords de partage de revenus : payez après l’emploi",
      ],
    },
    admission: {
      title: "Admission",
      subtitle: "Rejoignez-nous dès aujourd’hui",
      description:
        "Aucune expérience en codage requise, juste de la passion et de la motivation. Postulez maintenant pour façonner votre avenir dans la tech !",
      items: [
        "Aucun prérequis : la motivation suffit",
        "Processus simple : postulez en quelques minutes",
        "Places limitées : sécurisez la vôtre maintenant",
      ],
      children: {
        type: "button",
        label: "Postuler maintenant",
        size: "lg",
      },
    },
  },
  "bureautique-course": {
    introduction: {
      title: "Introduction",
      subtitle: "Boostez votre productivité avec la bureautique en 6 semaines",
      description:
        "Devenez expert en bureautique avec Excel, Word et PowerPoint pour répondre aux besoins des entreprises guinéennes comme Orange Guinée ou des projets comme la gestion du Marché de Madina.",
      items: [
        "Maîtrisez Excel pour l’analyse et la gestion de données",
        "Créez des documents professionnels avec Word",
        "Concevez des présentations percutantes avec PowerPoint",
        "Construisez un portfolio de projets bureautiques",
      ],
      children: {
        title: "Les outils que vous apprendrez :",
        content: [
          { src: "/img/icon-excel.svg", name: "Excel" },
          { src: "/img/icon-word.svg", name: "Word" },
          { src: "/img/icon-powerpoint.svg", name: "PowerPoint" },
          { src: "/img/icon-onedrive.svg", name: "OneDrive" },
        ],
      },
    },
    curriculum: {
      title: "Curriculum",
      subtitle: "Maîtrisez les outils bureautiques pour une productivité maximale",
      description:
        "Ce cours intensif vous apprend à utiliser les outils Microsoft Office pour optimiser la gestion de données, la rédaction et les présentations, adapté aux besoins professionnels guinéens.",
      items: [
        "Analyse de données avec Excel",
        "Rédaction professionnelle avec Word",
        "Création de présentations visuelles avec PowerPoint",
        "Collaboration en ligne avec OneDrive",
        "Projets appliqués au contexte local",
      ],
      children: {
        overviewTitle: "De la bureautique de base à l’expertise en 6 semaines",
        overviewDescription:
          "Apprenez à utiliser les outils Microsoft Office pour automatiser les tâches, analyser les données et présenter des résultats, avec des projets inspirés par des besoins guinéens comme la gestion des stocks au Marché de Madina.",
        modules: [
          {
            number: 1,
            title: "Fondations en bureautique",
            duration: "60H",
            description:
              "Maîtrisez les bases d’Excel, Word et PowerPoint pour créer des documents et analyser des données simples.",
            steps: [
              "Configurez votre environnement Office",
              "Créez des documents de base avec Word",
              "Construisez des feuilles de calcul simples avec Excel",
              "Réalisez des présentations de base avec PowerPoint",
            ],
            tools: [
              { src: "/img/icon-excel.svg", name: "Excel" },
              { src: "/img/icon-word.svg", name: "Word" },
              { src: "/img/icon-powerpoint.svg", name: "PowerPoint" },
            ],
          },
          {
            number: 2,
            title: "Analyse de données avec Excel",
            duration: "70H",
            description:
              "Apprenez à analyser des données avec Excel pour des applications comme la gestion des stocks ou des ventes au Marché de Madina.",
            steps: [
              "Utilisez des formules et fonctions avancées",
              "Créez des tableaux croisés dynamiques",
              "Visualisez les données avec des graphiques",
              "Automatisez les tâches avec des macros",
            ],
            tools: [
              { src: "/img/icon-excel.svg", name: "Excel" },
              { src: "/img/icon-onedrive.svg", name: "OneDrive" },
            ],
          },
          {
            number: 3,
            title: "Rédaction professionnelle avec Word",
            duration: "60H",
            description:
              "Maîtrisez Word pour créer des documents professionnels, comme des rapports pour Orange Guinée.",
            steps: [
              "Utilisez les styles et modèles",
              "Créez des documents avec table des matières",
              "Collaborez sur des documents en ligne",
              "Formatez des rapports professionnels",
            ],
            tools: [
              { src: "/img/icon-word.svg", name: "Word" },
              { src: "/img/icon-onedrive.svg", name: "OneDrive" },
            ],
          },
          {
            number: 4,
            title: "Présentations percutantes avec PowerPoint",
            duration: "60H",
            description:
              "Concevez des présentations visuelles engageantes pour des pitchs ou des réunions professionnelles.",
            steps: [
              "Créez des diapositives avec des animations",
              "Utilisez des modèles professionnels",
              "Intégrez des graphiques et vidéos",
              "Présentez efficacement vos idées",
            ],
            tools: [
              { src: "/img/icon-powerpoint.svg", name: "PowerPoint" },
              { src: "/img/icon-onedrive.svg", name: "OneDrive" },
            ],
          },
          {
            number: 5,
            title: "Projet final",
            duration: "80H",
            description:
              "Réalisez un projet bureautique complet, comme un tableau de bord de gestion pour le Marché de Madina, intégrant Excel, Word et PowerPoint.",
            steps: [
              "Planifiez un projet bureautique",
              "Analysez des données avec Excel",
              "Rédigez un rapport avec Word",
              "Créez une présentation avec PowerPoint",
              "Présentez aux parties prenantes",
            ],
            tools: [
              { src: "/img/icon-excel.svg", name: "Excel" },
              { src: "/img/icon-word.svg", name: "Word" },
              { src: "/img/icon-powerpoint.svg", name: "PowerPoint" },
              { src: "/img/icon-onedrive.svg", name: "OneDrive" },
            ],
          },
        ],
        technologies: [
          { src: "/img/icon-excel.svg", name: "Excel" },
          { src: "/img/icon-word.svg", name: "Word" },
          { src: "/img/icon-powerpoint.svg", name: "PowerPoint" },
          { src: "/img/icon-onedrive.svg", name: "OneDrive" },
        ],
      },
    },
    campus: {
      title: "Campus",
      subtitle: "Un espace moderne à Conakry",
      description:
        "Notre campus à Conakry offre un espace dynamique équipé d’ordinateurs grâce à des partenariats locaux, parfait pour apprendre et collaborer.",
      items: [
        "Salles de classe modernes avec ordinateurs fournis",
        "Connexion Internet fiable pour un apprentissage sans interruption",
        "Espaces pour la collaboration et les projets pratiques",
      ],
    },
    method: {
      title: "Méthodologie",
      subtitle: "Apprentissage pratique",
      description:
        "Notre approche pratique transforme les débutants en experts bureautiques en 6 semaines, avec un mentorat par des experts locaux.",
      items: [
        "80 % de pratique : travaillez sur des projets dès le premier jour",
        "Collaboration : apprenez plus vite ensemble",
        "Projets hebdomadaires : stimulez la créativité",
        "Mentorat quotidien : accompagnement personnalisé",
      ],
    },
    careers: {
      title: "Carrières",
      subtitle: "Services de carrière",
      description:
        "Préparez-vous à une carrière administrative avec un portfolio solide, un coaching de carrière et des connexions avec des employeurs locaux comme Orange Guinée.",
      items: [
        "Portfolio professionnel : impressionnez les recruteurs",
        "Coaching de carrière : CV, entretiens, LinkedIn",
        "Réseau d’employeurs : opportunités locales et mondiales",
        "270 heures de formation intensive",
      ],
    },
    financing: {
      title: "Financement",
      subtitle: "Accessible à tous",
      description:
        "Des options flexibles garantissent que chaque Guinéen motivé peut rejoindre la révolution bureautique.",
      items: [
        "Bourses pour les jeunes motivés",
        "Plans de paiement adaptés à tous les budgets",
        "Accords de partage de revenus : payez après l’emploi",
      ],
    },
    admission: {
      title: "Admission",
      subtitle: "Rejoignez-nous dès aujourd’hui",
      description:
        "Aucune expérience requise, juste de la passion et de la motivation. Postulez maintenant pour booster votre productivité !",
      items: [
        "Aucun prérequis : la motivation suffit",
        "Processus simple : postulez en quelques minutes",
        "Places limitées : sécurisez la vôtre maintenant",
      ],
      children: {
        type: "button",
        label: "Postuler maintenant",
        size: "lg",
      },
    },
  },
  "mobile-development-course": {
    introduction: {
      title: "Introduction",
      subtitle: "Créez des applications mobiles en 9 semaines",
      description:
        "Apprenez à développer des applications mobiles pour Android et iOS avec Flutter, en créant des solutions pour des entreprises comme Orange Guinée ou des projets comme le Marché de Madina.",
      items: [
        "Maîtrisez Flutter pour le développement multiplateforme",
        "Créez des applications mobiles responsives",
        "Intégrez des fonctionnalités modernes",
        "Construisez un portfolio d’applications mobiles",
      ],
      children: {
        title: "Les outils et langages que vous apprendrez :",
        content: [
          { src: "/img/icon-flutter.svg", name: "Flutter" },
          { src: "/img/icon-dart.svg", name: "Dart" },
          { src: "/img/icon-firebase.svg", name: "Firebase" },
          { src: "/img/icon-github.svg", name: "GitHub" },
        ],
      },
    },
    curriculum: {
      title: "Curriculum",
      subtitle: "Maîtrisez le développement mobile avec Flutter en 9 semaines",
      description:
        "Ce cours intensif vous apprend à créer des applications mobiles multiplateformes avec Flutter, adaptées aux besoins guinéens comme les applications pour le commerce local.",
      items: [
        "Développement d’applications avec Flutter et Dart",
        "Conception d’interfaces utilisateur responsives",
        "Intégration de services backend avec Firebase",
        "Déploiement d’applications sur Android et iOS",
        "Projets appliqués au contexte local",
      ],
      children: {
        overviewTitle: "Du code à l’application mobile en 9 semaines intensives",
        overviewDescription:
          "Apprenez à développer des applications mobiles performantes avec Flutter, en créant des solutions pour des besoins guinéens comme des applications pour le Marché de Madina ou Orange Guinée.",
        modules: [
          {
            number: 1,
            title: "Fondations en développement mobile",
            duration: "90H",
            description:
              "Configurez votre environnement Flutter et maîtrisez la syntaxe de Dart pour créer des applications mobiles simples.",
            steps: [
              "Installez et configurez Flutter et Dart",
              "Créez votre première application mobile",
              "Comprendre les widgets de base",
              "Gérez la navigation dans l’application",
            ],
            tools: [
              { src: "/img/icon-flutter.svg", name: "Flutter" },
              { src: "/img/icon-dart.svg", name: "Dart" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
          {
            number: 2,
            title: "Conception d’interfaces utilisateur",
            duration: "80H",
            description:
              "Apprenez à concevoir des interfaces utilisateur modernes et responsives avec Flutter pour des applications engageantes.",
            steps: [
              "Créez des mises en page responsives",
              "Utilisez des widgets avancés",
              "Implémentez des animations fluides",
              "Testez l’interface sur Android et iOS",
            ],
            tools: [
              { src: "/img/icon-flutter.svg", name: "Flutter" },
              { src: "/img/icon-dart.svg", name: "Dart" },
            ],
          },
          {
            number: 3,
            title: "Gestion des données et backend",
            duration: "70H",
            description:
              "Intégrez des services backend comme Firebase pour gérer les données et les fonctionnalités des applications mobiles.",
            steps: [
              "Connectez votre application à Firebase",
              "Gérez l’authentification des utilisateurs",
              "Stockez et récupérez des données",
              "Implémentez des notifications push",
            ],
            tools: [
              { src: "/img/icon-firebase.svg", name: "Firebase" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
          {
            number: 4,
            title: "Développement avancé",
            duration: "80H",
            description:
              "Approfondissez vos compétences en Flutter pour créer des applications complexes avec des fonctionnalités modernes.",
            steps: [
              "Implémentez des fonctionnalités avancées",
              "Optimisez les performances de l’application",
              "Testez sur plusieurs appareils",
              "Intégrez des API externes",
            ],
            tools: [
              { src: "/img/icon-flutter.svg", name: "Flutter" },
              { src: "/img/icon-dart.svg", name: "Dart" },
            ],
          },
          {
            number: 5,
            title: "Projet final",
            duration: "100H",
            description:
              "Développez une application mobile complète, comme une plateforme e-commerce pour le Marché de Madina, pour mettre en valeur vos compétences.",
            steps: [
              "Planifiez un projet mobile",
              "Développez une application avec Flutter",
              "Intégrez Firebase pour le backend",
              "Déployez sur Android et iOS",
              "Présentez aux parties prenantes",
            ],
            tools: [
              { src: "/img/icon-flutter.svg", name: "Flutter" },
              { src: "/img/icon-dart.svg", name: "Dart" },
              { src: "/img/icon-firebase.svg", name: "Firebase" },
              { src: "/img/icon-github.svg", name: "GitHub" },
            ],
          },
        ],
        technologies: [
          { src: "/img/icon-flutter.svg", name: "Flutter" },
          { src: "/img/icon-dart.svg", name: "Dart" },
          { src: "/img/icon-firebase.svg", name: "Firebase" },
          { src: "/img/icon-github.svg", name: "GitHub" },
        ],
      },
    },
    campus: {
      title: "Campus",
      subtitle: "Un espace moderne à Conakry",
      description:
        "Notre campus à Conakry offre un espace dynamique équipé d’ordinateurs grâce à des partenariats locaux, parfait pour coder et collaborer.",
      items: [
        "Salles de classe modernes avec ordinateurs fournis",
        "Connexion Internet fiable pour un codage sans interruption",
        "Espaces pour le pair programming et les hackathons",
      ],
    },
    method: {
      title: "Méthodologie",
      subtitle: "Apprentissage pratique",
      description:
        "Notre approche pratique transforme les débutants en développeurs mobiles confiants en 9 semaines, avec un mentorat par des experts locaux.",
      items: [
        "80 % de pratique : codez dès le premier jour",
        "Pair programming : apprenez plus vite ensemble",
        "Hackathons hebdomadaires : stimulez la créativité",
        "Mentorat quotidien : accompagnement personnalisé",
      ],
    },
    careers: {
      title: "Carrières",
      subtitle: "Services de carrière",
      description:
        "Préparez-vous à une carrière dans le développement mobile avec un portfolio solide, un coaching de carrière et des connexions avec des employeurs locaux comme Orange Guinée.",
      items: [
        "Portfolio professionnel : impressionnez les recruteurs",
        "Coaching de carrière : CV, entretiens, LinkedIn",
        "Réseau d’employeurs : opportunités locales et mondiales",
        "400 heures de formation intensive",
      ],
    },
    financing: {
      title: "Financement",
      subtitle: "Accessible à tous",
      description:
        "Des options flexibles garantissent que chaque Guinéen motivé peut rejoindre la révolution technologique.",
      items: [
        "Bourses pour les jeunes motivés",
        "Plans de paiement adaptés à tous les budgets",
        "Accords de partage de revenus : payez après l’emploi",
      ],
    },
    admission: {
      title: "Admission",
      subtitle: "Rejoignez-nous dès aujourd’hui",
      description:
        "Aucune expérience en codage requise, juste de la passion et de la motivation. Postulez maintenant pour façonner votre avenir dans la tech !",
      items: [
        "Aucun prérequis : la motivation suffit",
        "Processus simple : postulez en quelques minutes",
        "Places limitées : sécurisez la vôtre maintenant",
      ],
      children: {
        type: "button",
        label: "Postuler maintenant",
        size: "lg",
      },
    },
  },
};

export const courseDetails: CourseDetail[] = courses.map((course) => {
  const key = course.link.replace(/^\/+/, "").toLowerCase();
  const sections = sectionContents[key] || {};
  console.log(`Clé de cours générée : ${key}`);
  console.log(`Clés de sections disponibles pour ${key} :`, Object.keys(sections));
  if (Object.keys(sections).length === 0) {
    console.warn(`Aucune section trouvée pour la clé de cours : ${key}`);
  }
  return {
    key,
    title: course.title,
    description: course.description,
    imageSrc: course.imageSrc,
    imageAlt: course.imageAlt,
    tabs,
    partners,
    sectionContents: sections,
  };
});

console.log("Clés de cours disponibles :", courseDetails.map((c) => c.key));