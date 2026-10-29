/**
 * Bundled curated list of ~350 common passwords, leaked patterns, and dictionary words
 * used for baseline ranking, training synthetic generation, and security checks.
 */

export const COMMON_PASSWORDS: string[] = [
  // Top 100 most common passwords globally
  '123456', 'password', '123456789', '12345', '12345678', 'qwerty', '111111', '1234567',
  'dragon', '123123', 'baseball', 'football', 'letmein', 'monkey', 'master', 'welcome',
  'shadow', 'sunshine', 'princess', 'solo', 'starwars', 'access', 'freedom', 'trustno1',
  'iloveyou', 'password1', '1234567890', 'admin', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  'hunter2', 'superman', 'batman', 'michael', 'charlie', 'jessica', 'hannah', 'thomas',
  'secret', 'login', 'testing', 'root', 'pass1234', 'p@ssword', 'p@ssw0rd', 'Password1',
  'Password123', 'qwerty123', '1234', '1111', '0000', '666666', '7777777', '88888888',
  '999999999', 'abc123', 'orange', 'cookie', 'killer', 'liverpool', 'arsenal', 'chelsea',
  'playboy', 'mustang', 'mercedes', 'ferrari', 'harley', 'bailey', 'robert', 'anthony',
  'barcelona', 'realmadrid', 'pokemon', 'matrix', 'terminator', 'matrix123', 'gangsta',
  'blink128', 'forever', 'ginger', 'pepper', 'summer', 'winter', 'autumn', 'spring',
  'hello123', 'guest', 'system', 'default', 'server', 'database', 'network', 'router',
  'jordan', 'justin', 'brandon', 'william', 'joshua', 'daniel', 'andrew', 'matthew',
  'security', 'secure123', 'supersecret', 'ilovegod', 'jesus123', 'computer', 'laptop',

  // Frequent variations & common word+number additions
  'password12', 'password1234', 'admin123', 'admin1234', 'admin@123', 'root123', 'rootadmin',
  'pass123', 'pass@123', 'welcome1', 'welcome123', 'welcome@123', 'qwerty789', 'qazwsx',
  'wsxedc', 'edcrfv', 'rfvtgb', 'tgbnhy', 'yhnujm', 'ujmikol', 'qazwsxedc', 'zaq12wsx',
  'xsw2cde3', '1q2w3e4r', '1qaz2wsx', 'asdf1234', 'zxcv1234', 'qwer1234', 'abcd1234',
  'iloveu', 'iloveyou1', 'iloveyou123', 'loveyou', 'forever123', 'darling', 'honey123',
  'sweetheart', 'babygirl', 'beautiful', 'angel123', 'prince123', 'cute123', 'monkey123',
  'dragon123', 'tiger123', 'lion123', 'panther', 'cheetah', 'phoenix', 'ninja123',
  'samurai', 'warrior', 'champion', 'victory', 'winner1', 'winner123', 'success',

  // Years and birthdays
  '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999',
  '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
  '2010', '2011', '2012', '2015', '2018', '2020', '2021', '2022', '2023', '2024',
  '2025', '2026', 'password2020', 'password2021', 'password2022', 'password2023',
  'password2024', 'password2025', 'password2026', 'admin2024', 'admin2025', 'admin2026',

  // Common internet and pop-culture words
  'netflix', 'spotify', 'youtube', 'google', 'amazon', 'facebook', 'instagram', 'twitter',
  'tiktok', 'discord', 'reddit', 'github', 'windows', 'microsoft', 'android', 'apple123',
  'marvel', 'avengers', 'ironman', 'spiderman', 'superhero', 'captain', 'disney', 'anime123',
  'naruto', 'goku123', 'pikachu', 'charizard', 'starwars1', 'skywalker', 'vader123',
  'hogwarts', 'potter', 'gandalf', 'frodo123', 'legolas', 'aragorn', 'golum',

  // Sports & brands
  'nike123', 'adidas', 'puma123', 'reebok', 'rolex123', 'supreme', 'gucci123', 'prada',
  'bmw1234', 'audi1234', 'honda123', 'toyota', 'yamaha', 'suzuki', 'ducati', 'kawasaki',
  'lakers', 'bulls123', 'celtics', 'warriors', 'yankees', 'redsox', 'cowboys', 'patriots',

  // Food and everyday objects
  'coffee', 'chocolate', 'vanilla', 'strawberry', 'pizza123', 'burger', 'sandwich',
  'cheesecake', 'pancake', 'icecream', 'popcorn', 'banana', 'applepie', 'whiskey',
  'tequila', 'corona', 'heineken', 'guinness', 'mountain', 'ocean123', 'river123',
  'thunder', 'lightning', 'breeze', 'cloudy', 'sunnyday', 'rainbow', 'moonlight',

  // Common phrases / deceptive "complex" passwords
  'Password!', 'Password1!', 'Password@1', 'Password#1', 'P@ssword1!', 'Tr0ub4dor&3',
  'Letmein1!', 'Admin@1234', 'Welcome@2024', 'Welcome@2025', 'ChangeMe1!', 'Winter2024!',
  'Summer2024!', 'Spring2025!', 'Autumn2025!', 'Passw0rd!', 'Qwerty!123', 'Abcd@1234',
  'Temp1234!', 'Secret123!'
];

// Base dictionary words for substring matching and l33tspeak detection
export const DICTIONARY_WORDS = [
  'password', 'admin', 'welcome', 'shadow', 'dragon', 'monkey', 'master', 'access',
  'freedom', 'secret', 'orange', 'cookie', 'killer', 'summer', 'winter', 'spring',
  'autumn', 'purple', 'yellow', 'guitar', 'player', 'system', 'server', 'client',
  'doctor', 'police', 'school', 'office', 'family', 'friend', 'sister', 'brother',
  'mother', 'father', 'castle', 'knight', 'hunter', 'prince', 'silver', 'golden',
  'coffee', 'flower', 'market', 'station', 'wonder', 'camera', 'simple', 'number',
  'people', 'person', 'street', 'garden', 'forest', 'island', 'planet', 'bridge',
  'stream', 'engine', 'rocket', 'shield', 'energy', 'future', 'action', 'spirit',
  'wizard', 'dragon', 'animal', 'memory', 'matrix', 'portal', 'galaxy', 'cosmos',
  'secure', 'safety', 'danger', 'online', 'active', 'silent', 'bright', 'yellow',
  'correct', 'horse', 'battery', 'staple', 'troubadour', 'troubador'
];

// Pre-create lowercase Set for O(1) membership check
export const COMMON_PASSWORDS_SET = new Set(
  COMMON_PASSWORDS.map((p) => p.toLowerCase())
);

// Rank map for log10(rank) calculation
export const COMMON_PASSWORDS_RANK = new Map<string, number>();
COMMON_PASSWORDS.forEach((pwd, idx) => {
  const lower = pwd.toLowerCase();
  if (!COMMON_PASSWORDS_RANK.has(lower)) {
    COMMON_PASSWORDS_RANK.set(lower, idx + 1);
  }
});
