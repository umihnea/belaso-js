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

const encrypt = (plaintext, key, alphabetSize, letterToCode, codeToLetter) => {
  const cipher = [];
  let blockLength = key.length;
  for (let i = 0, k = 0; i < plaintext.length; i++, k = (k + 1) % blockLength) {
    const shiftedCode = (letterToCode[plaintext[i]] + letterToCode[key[k]]) % alphabetSize;
    cipher.push(codeToLetter[shiftedCode]);
  }

  return cipher.join('');
};

/**
 * Replacement for modulo.
 * Reasoning: the negative modulo in JS does not perform very well.
 * @param x: any integer number
 * @param n: any non-zero natural number
 * @returns number
 */
const modulo = (x, n) => (x % n + n) % n;

const decrypt = (ciphertext, key, alphabetSize, letterToCode, codeToLetter) => {
  const plain = [];
  let blockLength = key.length;
  for (let i = 0, k = 0; i < ciphertext.length; i++, k = (k + 1) % blockLength) {
    const shiftedCode = modulo(letterToCode[ciphertext[i]] - letterToCode[key[k]], alphabetSize);
    plain.push(codeToLetter[shiftedCode]);
  }

  return plain.join('');
};

const getCleanInput = () => {
  const errors = [];

  const rawKey = $("#key-input").val();
  const rawAlphabet = $("#alphabet-input").val();
  const rawPlaintext = $("#plaintext-textarea").val();
  const rawCiphertext = $("#ciphertext-textarea").val();

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

  const plaintext = [];
  for (let i = 0; i < rawPlaintext.length; i++) {
    if (!alphabet.includes(rawPlaintext[i])) {
      errors.push('Some plaintext letters are not from the alphabet.');
      break;
    }

    plaintext.push(rawPlaintext[i]);
  }

  const ciphertext = [];
  for (let i = 0; i < rawCiphertext.length; i++) {
    if (!alphabet.includes(rawCiphertext[i])) {
      errors.push('Some ciphertext letters are not from the alphabet.');
      break;
    }

    ciphertext.push(rawCiphertext[i]);
  }

  return {alphabet, key, plaintext, ciphertext, errors};
};

$('#encrypt-button').on('click', () => {
  const {alphabet, key, plaintext, _, errors} = getCleanInput();

  if (errors && errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  const {letterToCode, codeToLetter} = mapLettersToCodes(alphabet);
  const ciphertext = encrypt(plaintext, key, alphabet.length, letterToCode, codeToLetter);

  $("#ciphertext-textarea").val(ciphertext);
});

$('#decrypt-button').on('click', () => {
  const {alphabet, key, _, ciphertext, errors} = getCleanInput();

  if (errors && errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  const {letterToCode, codeToLetter} = mapLettersToCodes(alphabet);
  const plaintext = decrypt(ciphertext, key, alphabet.length, letterToCode, codeToLetter);

  $("#plaintext-textarea").val(plaintext);
});
