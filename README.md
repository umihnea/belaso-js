## belaso-js
A JS & JQuery implementation for the Belaso-Vigenère Cipher.

### About Belaso-Vigenère
Belaso-Vigenère is a shift cipher and can be considered a natural evolution from the Caesar cipher.
Instead of using a single-valued key, this cipher uses a whole
sequence of characters. As such, the key can be defined as a word in the alphabet.
More information can be found [here](http://tamboril.de:12514/classical_ciphers#belaso-vigen%C3%A8re-cipher). 

### Implementation
The JS implementation has a little over 150 LoC. However the core algorithm is only a few lines long:
```$xslt
const encrypt = (plaintext, key, alphabetSize, letterToCode, codeToLetter) => {
  const cipher = [];
  let blockLength = key.length;
  for (let i = 0, k = 0; i < plaintext.length; i++, k = (k + 1) % blockLength) {
    const shiftedCode = (letterToCode[plaintext[i]] + letterToCode[key[k]]) % alphabetSize;
    cipher.push(codeToLetter[shiftedCode]);
  }

  return cipher.join('');
};
```
We use two dictionaries to map from letter to numeric values and vice versa: `letterToCode` and `codeToLetter`.
The mapping between letters and codes is done at the start.

We compute a `blockLength` which is nothing else than the length of the key.
Each **block** of plaintext is then encrypted using the key.

The computation uses the numeric codes. The encryption formula is applied.
Then the result (which is computed modulo `alphabetSize` to keep results in the **same space**).

After the computation, we map the code back to a letter using the pre-computed `codeToLetter`.

Internally, the operations occur on lists. Eventually we will obtain a string with `.join('');`.



