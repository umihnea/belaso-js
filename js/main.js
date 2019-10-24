const mapLettersToCodes = (rawAlphabet) => {
  const letters = [];
  let letterToCode = {};
  let codeToLetter = {};

  for (let i = 0; i < rawAlphabet.length; i++) {
    if (letters.includes(rawAlphabet[i])) {
      console.warn(`Found duplicate '${rawAlphabet[i]}' in alphabet. Skipping.`);
      continue;
    }

    letters.push(rawAlphabet[i]);
  }

  let alphabetSize = letters.length;

  let code = 0;
  letters.forEach(letter => {
    letterToCode[letter] = code;
    codeToLetter[code] = letter;
    code++;
  });

  return { letterToCode, codeToLetter, alphabetSize };
};

const cleanKey = (rawKey, letterToCode) => {
  const key = [];
  let errorLetters = [];

  for (let i = 0; i < rawKey.length; i++) {
    if (key.includes(rawKey[i])) {
      console.warn(`Found duplicate '${rawKey[i]}' in key. Skipping.`);
      continue;
    }

    if (!(rawKey[i] in letterToCode)) {
      errorLetters.push(rawKey[i]);
      continue;
    }

    key.push(rawKey[i]);
  }

  return { key, keyError: errorLetters };
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

  return { plaintext: text, plaintextError: errorLetters };
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

$('#encrypt-button').on('click', () => {

  const rawAlphabet = $("#alphabet-input").val();

  if (!rawAlphabet) {
    alert('Alphabet is empty.');
    return;
  }

  const { letterToCode, codeToLetter, alphabetSize } = mapLettersToCodes(rawAlphabet);

  if (Object.keys(letterToCode).length === 0) {
    return;
  }

  const rawKey = $("#key-input").val();

  if (!rawKey) {
    alert('Key is empty.');
    return;
  }

  const { key, keyError } = cleanKey(rawKey, letterToCode);

  if (keyError.length > 0) {
    alert(`Some key letters are not in the alphabet.\n${keyError.join(', ')}`);
    return;
  }

  const rawPlaintext = $("#plaintext-textarea").val();

  const { plaintext, plaintextError } = cleanPlaintext(rawPlaintext, letterToCode);

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
