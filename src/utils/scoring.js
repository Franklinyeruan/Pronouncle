import { doubleMetaphone } from 'double-metaphone';

/**
 * Returns the phonetic codes (phonemes) for a given string.
 */
export const getPhoneticCode = (text) => {
    if (!text) return '';
    const clean = text.toLowerCase().replace(/[^a-z]/g, '');
    const [p1, p2] = doubleMetaphone(clean);
    return p2 ? `${p1} / ${p2}` : p1;
};

/**
 * Calculates a similarity score between 0 and 100 based on phonetic similarity.
 * Uses Double Metaphone to compare the "sounds" of the target and spoken words.
 */
export const calculateScore = (target, spoken) => {
    if (!spoken) return 0;

    const targetClean = target.toLowerCase().replace(/[^a-z]/g, '');
    const spokenClean = spoken.toLowerCase().replace(/[^a-z]/g, '');

    if (targetClean === spokenClean) return 100;

    const [t1, t2] = doubleMetaphone(targetClean);
    const [s1, s2] = doubleMetaphone(spokenClean);

    // If the primary or secondary codes match exactly, high score
    if (t1 === s1) return 95;
    if (t1 === s2 || t2 === s1 || (t2 && s2 && t2 === s2)) return 85;

    // Partial matching using Levenshtein on the metaphone codes
    const dist = levenshteinDistance(t1, s1);
    const maxLen = Math.max(t1.length, s1.length);
    const similarity = Math.max(0, 1 - dist / maxLen);

    return Math.round(similarity * 80); // Max 80 for partial phonetic match
};

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}
