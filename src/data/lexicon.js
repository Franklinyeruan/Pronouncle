export const MEDICAL_TERMS = [
  {
    term: "Lymphangioleiomyomatosis",
    phonetic: "lim-FAN-jee-oh-LY-oh-MY-oh-muh-TOH-sis",
    definition: "A rare, progressive lung disease that primarily affects women of childbearing age.",
    difficulty: "hard"
  }
];

export const getDailyWord = () => {
  // Always returns the only word in the list for now
  return MEDICAL_TERMS[0];
};
