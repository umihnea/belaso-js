## belaso-js
A JS & jQuery implementation for the Belaso-Vigenère Cipher.

### About Belaso-Vigenère
Belaso-Vigenère is a **simple shift cipher** and can be considered a natural evolution of the Caesar cipher.
Instead of using a single-valued key, this cipher uses a whole
sequence of characters. As such, the key can be defined as a word in the alphabet.
More information can be found [here](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher). 

### Implementation  
The JS implementation has ~160 lines. However the core algorithm is only a few lines long:
> **Note.** This is a functional example but the exact implementation is subject to change.
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

We use two dictionaries: one that maps from letter to numeric (_code_) values
and a reverse dictionary: `letterToCode`, and `codeToLetter` respectively.
The mapping between letters and codes is pre-computed at the start, given the **alphabet**.

Each **block** of plaintext is then encrypted using the key. We denote with `blockLength` the key length.

For each individual letter within the block, we take the code and shift it.
The shift is given by the current position in the key (`key[k]`).
The key is simply rotated using `k = (k + 1) % blockLength`.

The **resulted code** is piped through a modulo (over `alphabetSize`) to keep results in the **same space**.
After the final code is obtained - we **re-map** the code to **a letter**. 

Internally, all the operations above occur on lists. Calling `.join('');` concatenates the elements and the
final result is a string - either the **plaintext** (in case of `decrypt`) or the **ciphertext**.

#### Cleaning Input Phase
The raw input is fetched via jQuery from the HTML form. The raw values are
split into lists. The following invariants need to be respected:
* the _alphabet_ is a sequence of unique characters (letters)
* the key, plaintext and ciphertext only contain characters from the _alphabet_

#### The Special Case of `modulo`
Depending on the version of ECMAScript running in the browser, one can get wrong results when computing the modulo of a
 negative integer. In order to correct the negative modulo problem, I implemented a small `modulo` function. 
