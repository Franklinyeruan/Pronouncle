export const MEDICAL_TERMS = [
  {
    term: "Sphygmomanometer",
    phonetic: "SFIG-mo-mə-NOM-i-tər",
    definition: "An instrument for measuring blood pressure, typically consisting of an inflatable rubber cuff.",
    difficulty: "hard"
  },
  {
    term: "Otorhinolaryngology",
    phonetic: "OH-toh-RY-noh-LAR-ing-GOL-ə-jee",
    definition: "The study of diseases of the ear, nose, and throat (ENT).",
    difficulty: "hard"
  },
  {
    term: "Phenylketonuria",
    phonetic: "FEN-ul-KEE-toh-NOO-ree-ə",
    definition: "An inherited metabolic disorder where the body cannot break down the amino acid phenylalanine.",
    difficulty: "hard"
  },
  {
    term: "Pheochromocytoma",
    phonetic: "FEE-oh-KROH-moh-sy-TOH-mə",
    definition: "A rare tumor of adrenal gland tissue that causes the release of too much epinephrine and norepinephrine.",
    difficulty: "hard"
  },
  {
    term: "Choledocholithiasis",
    phonetic: "koh-LED-ə-koh-li-THY-ə-sis",
    definition: "The presence of at least one gallstone in the common bile duct.",
    difficulty: "hard"
  },
  {
    term: "Onychomycosis",
    phonetic: "ON-i-koh-my-KOH-sis",
    definition: "A common fungal infection of the fingernails or toenails.",
    difficulty: "hard"
  },
  {
    term: "Lymphangioleiomyomatosis",
    phonetic: "lim-FAN-jee-oh-LY-oh-MY-oh-muh-TOH-sis",
    definition: "A rare, progressive lung disease that primarily affects women of childbearing age.",
    difficulty: "hard"
  },
  {
    term: "Sternocleidomastoid",
    phonetic: "STUR-noh-KLY-doh-MAS-toid",
    definition: "A pair of long muscles in the neck that help rotate the head and flex the neck.",
    difficulty: "hard"
  },
  {
    term: "Electroencephalography",
    phonetic: "i-LEK-troh-en-SEF-ə-LOG-rə-fee",
    definition: "A technique used to record and study the electrical activity of the brain.",
    difficulty: "hard"
  },
  {
    term: "Spondylolisthesis",
    phonetic: "SPON-di-loh-lis-THEE-sis",
    definition: "A spinal condition in which one vertebra slips forward over the one below it.",
    difficulty: "hard"
  }
];

export const getDailyWord = () => {
  const today = new Date();
  // Using a simpler index calculation for exactly 10 words
  const index = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % MEDICAL_TERMS.length;
  return MEDICAL_TERMS[index];
};
