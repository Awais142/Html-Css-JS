const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthIndicator = document.getElementById('strength-indicator');
const strengthText = document.getElementById('strength-text');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

generateBtn.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    
    const password = generatePassword(length, hasUpper, hasNumber, hasSymbol);
    passwordEl.value = password;
    
    // Calculate and show password strength
    updatePasswordStrength(password);
});

copyBtn.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = passwordEl.value;
    
    if(!password) return;
    
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert('Password copied to clipboard!');
});

function generatePassword(length, hasUpper, hasNumber, hasSymbol) {
    let generatedPassword = '';
    const typesArr = [];
    
    // Always include lowercase
    typesArr.push('lower');
    
    if (hasUpper) typesArr.push('upper');
    if (hasNumber) typesArr.push('number');
    if (hasSymbol) typesArr.push('symbol');
    
    if (typesArr.length === 0) {
        return '';
    }
    
    for(let i = 0; i < length; i++) {
        const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
        generatedPassword += randomFunc[randomType]();
    }
    
    return generatedPassword;
}

function updatePasswordStrength(password) {
    let strength = calculatePasswordStrength(password);
    
    // Remove all classes first
    strengthIndicator.classList.remove('weak', 'medium', 'strong');
    
    // Add appropriate class and text based on strength
    if (strength < 40) {
        strengthIndicator.classList.add('weak');
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ff4444';
    } else if (strength < 80) {
        strengthIndicator.classList.add('medium');
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#ffbb33';
    } else {
        strengthIndicator.classList.add('strong');
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#00C851';
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length contribution (up to 25 points)
    strength += Math.min(25, Math.floor(password.length * 2));
    
    // Character variety contribution
    if (/[a-z]/.test(password)) strength += 10; // lowercase
    if (/[A-Z]/.test(password)) strength += 20; // uppercase
    if (/[0-9]/.test(password)) strength += 20; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25; // symbols
    
    // Bonus for mixture (up to 20 points)
    let varietyCount = (/[a-z]/.test(password) ? 1 : 0)
        + (/[A-Z]/.test(password) ? 1 : 0)
        + (/[0-9]/.test(password) ? 1 : 0)
        + (/[^a-zA-Z0-9]/.test(password) ? 1 : 0);
    
    strength += varietyCount * 5;
    
    return Math.min(100, strength);
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}
