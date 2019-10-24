/**
 * Takes in the alphabet and maps each letter to a numeric code.
 * @param alphabet: list: valid alphabet
 * @returns {{alphabetSize: *, codeToLetter: *, letterToCode: *}}
 */
const mapLettersToCodes = (alphabet) => {
  let letterToCode = {};
  let codeToLetter = {};
  const letters = alphabet || [];

  let code = 0;
  letters.forEach(letter => {
    letterToCode[letter] = code;
    codeToLetter[code] = letter;
    code++;
  });

  return {letterToCode, codeToLetter};
};

const cleanPlaintext = (rawPlaintext, letterToCode) => {
  const text = [];
  let errorLetters = [];

  for (let i = 0; i < rawPlaintext.length; i++) {
    if (!(rawPlaintext[i] in letterToCode)) {
      errorLetters.push(rawPlaintext[i]);
      continue;
    }

    text.push(rawPlaintext[i]);
  }

  return {plaintext: text, plaintextError: errorLetters};
};

const encrypt = (plaintext, key, alphabetSize, letterToCode, codeToLetter) => {
  const cipher = [];
  let blockLength = key.length;
  for (let i = 0, k = 0; i < plaintext.length; i++, k = (k + 1) % blockLength) {
    const shiftedCode = (letterToCode[plaintext[i]] + letterToCode[key[k]]) % alphabetSize;
    cipher.push(codeToLetter[shiftedCode]);
  }

  return cipher.join('');
};

const getCleanInput = () => {
  const errors = [];

  const rawKey = $("#key-input").val();
  const rawAlphabet = $("#alphabet-input").val();

  if (!rawAlphabet || rawAlphabet.length === 0) {
    errors.push('Alphabet is empty.');
  }

  if (!rawKey || rawKey.length === 0) {
    errors.push('Key is empty.');
  }

  /* The alphabet is a sequence (stored as a list) of unique characters. */
  const alphabet = [];
  for (let i = 0; i < rawAlphabet.length; i++) {
    if (alphabet.includes(rawAlphabet[i])) {
      errors.push('Repeated letters in alphabet.');
      break;
    }
    alphabet.push(rawAlphabet[i]);
  }

  /* The key is a sequence of characters from the alphabet. */
  const key = [];
  for (let i = 0; i < rawKey.length; i++) {
    if (!alphabet.includes(rawKey[i])) {
      errors.push('Some key letters are not from the alphabet.');
      break;
    }

    key.push(rawKey[i]);
  }

  const alphabetSize = alphabet.length;

  return {alphabet, alphabetSize, key, errors};
};

$('#encrypt-button').on('click', () => {
  const rawPlaintext = $("#plaintext-textarea").val();

  const {alphabet, alphabetSize, key, errors} = getCleanInput();

  if (errors && errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  const {letterToCode, codeToLetter} = mapLettersToCodes(alphabet);

  if (Object.keys(letterToCode).length === 0) {
    return;
  }

  const {plaintext, plaintextError} = cleanPlaintext(rawPlaintext, letterToCode);

  if (plaintextError.length > 0) {
    alert(`Some plaintext letters are not in the alphabet.\n${plaintextError.join(', ')}`);
    return;
  }

  const ciphertext = encrypt(plaintext, key, alphabetSize, letterToCode, codeToLetter);
  $("#ciphertext-textarea").text(ciphertext);
});

$('#decrypt-button').on('click', () => {
  alert('decrypt.');
});
