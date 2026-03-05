export const MEDICAL_TERMS = [
  {
    term: "Sphygmomanometer",
    phonetic: "sfig-moh-muh-NOM-i-ter",
    definition: "An instrument for measuring blood pressure, typically consisting of an inflatable rubber cuff.",
    difficulty: "medium"
  },
  {
    term: "Otorhinolaryngology",
    phonetic: "oh-toh-ry-noh-lar-ing-GOL-uh-jee",
    definition: "The study of diseases of the ear, nose, and throat.",
    difficulty: "hard"
  },
  {
    term: "Lymphangioleiomyomatosis",
    phonetic: "lim-FAN-jee-oh-LY-oh-MY-oh-muh-TOH-sis",
    definition: "A rare, progressive lung disease that primarily affects women of childbearing age.",
    difficulty: "hard"
  },
  // {
  //   term: "Thyroparathyroidectomy",
  //   phonetic: "thy-roh-par-uh-thy-roy-dek-tuh-mee",
  //   definition: "Surgical removal of the thyroid and parathyroid glands.",
  //   difficulty: "expert"
  // }
];

export const getDailyWord = () => {
  const today = new Date();
  const index = (today.getUTCFullYear() * 366 + today.getUTCMonth() * 31 + today.getUTCDate()) % MEDICAL_TERMS.length;
  return MEDICAL_TERMS[index];
};
