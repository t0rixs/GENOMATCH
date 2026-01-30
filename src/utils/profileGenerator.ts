import type { Profile, GenomePrediction, GeneticCompatibility, ChildPrediction, Temperament } from '../types';

// Data Pools
const NAMES = [
    "森田紗耶", "中城恵美", "神田礼奈",
    "佐藤美緒", "鈴木舞香", "高橋菜々子",
    "田中陽葵", "渡辺千尋", "伊藤結衣",
    "中村彩乃", "小林真央", "山本莉子",
    "加藤愛梨", "吉田詩織", "山田佳奈",
    "佐々木心", "山口里奈", "松本明日香",
    "井上美月", "木村優希", "清水楓",
    "林くるみ", "斉藤杏奈", "斎藤美香",
    "山崎日和", "中島萌", "池田美咲",
    "橋本七海", "石川春香", "山下琴音",
    "小川奈々", "岡田華", "前田栞"
];
const LOCATIONS = [
    "東京-港区", "大阪-北区", "神奈川-横浜",
    "東京-新宿区", "東京-足立区", "東京-八王子市",
    "神奈川-相模原", "神奈川-藤沢", "千葉-千葉",
    "千葉-柏", "埼玉-川越", "埼玉-越谷",
    "大阪-吹田", "大阪-東大阪", "兵庫-姫路",
    "兵庫-西宮", "京都-宇治", "愛知-豊田",
    "愛知-一宮", "静岡-静岡", "北海道-旭川",
    "北海道-函館", "宮城-石巻", "福島-いわき",
    "新潟-長岡", "石川-白山", "長野-長野",
    "広島-福山", "岡山-倉敷", "香川-高松",
    "福岡-北九州", "福岡-久留米", "鹿児島-鹿児島"
];
const IMAGES = [
    "/images/profile1.png",
    "/images/profile2.png",
    "/images/profile3.png",
    "/images/gen_profile_01.png",
    "/images/gen_profile_02.png",
    "/images/gen_profile_03.png",
    "/images/gen_profile_04.png",
    "/images/gen_profile_05.png",
    "/images/gen_profile_06.png",
    "/images/gen_profile_07.png",
    "/images/gen_profile_08.png",
    "/images/gen_profile_09.png",
    "/images/gen_profile_10.png"
];

const RISKS = [
    "高血圧",
    "糖尿病",
    "肥満傾向",
    "近視",
    "アルコール依存",
    "カフェイン依存",
    "片頭痛",
    "アルツハイマー型認知症"
];

// Helper to get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to generate normally distributed random number (Box-Muller transform)
// Mean: 100, StdDev: 15 (estimated to fit 75-150 range mostly within +/- 2-3 sigma)
const getNormallyDistributedIQ = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Scale to Mean 100, StdDev 15
    num = num * 15 + 100;

    // Clamp to 75-150
    return Math.max(75, Math.min(150, Math.round(num)));
};

// Helper for physical ability class
const getPhysicalAbility = (): string => {
    const rand = Math.random();
    if (rand < 0.1) return "クラスS"; // 10%
    if (rand < 0.3) return "クラスA"; // 20%
    if (rand < 0.7) return "クラスB"; // 40%
    return "クラスC"; // 30%
};

// Helper for risk list (0 to 2 items)
const getRandomRisks = () => {
    const count = Math.random() < 0.5 ? 0 : (Math.random() < 0.7 ? 1 : 2); // 50% None, 35% One, 15% Two
    if (count === 0) return [];

    const shuffled = [...RISKS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(name => ({
        name,
        level: ["低", "中", "高"][getRandomInt(0, 2)]
    }));
};

export const generateProfiles = (count: number): Profile[] => {
    return Array.from({ length: count }, (_, i) => {
        const id = i + 1;

        // Randomly combine Name, Location, Image independently
        const name = getRandomItem(NAMES);
        const location = getRandomItem(LOCATIONS);
        const image = getRandomItem(IMAGES);

        const age = getRandomInt(20, 35);
        const matchScore = getRandomInt(70, 99);

        // Child Prediction
        // IQ is approximated based on parents, but here we just simulate the result
        // Let's assume the user has avg IQ, so child IQ is loosely based on Partner IQ but randomized
        const iq = getNormallyDistributedIQ();

        const childPrediction: ChildPrediction = {
            estimatedLifeExpectancy: getRandomInt(80, 100),
            estimatedIQ: Math.round((iq + 100) / 2), // Regress to mean (assuming user is avg 100) + random noise could be added but this is simple
            extraversion: getRandomInt(0, 100),
            stressTolerance: getRandomInt(0, 100),
            rewardDependence: getRandomInt(0, 100),
            morningType: getRandomInt(0, 100),
            obesityRisk: getRandomInt(0, 40), // Lower is better generally
            hairLossRisk: getRandomInt(0, 60)
        };

        const geneticCompatibility: GeneticCompatibility = {
            ageGap: getRandomInt(0, 10),
            iqGap: Math.abs(iq - 100), // Assuming user IQ 100
            morningTypeGap: getRandomInt(0, 100),
            extraversionGap: getRandomInt(0, 100),
            thinkingStyleGap: getRandomInt(0, 100)
        };

        const temperament: Temperament = {
            extraversion: getRandomInt(0, 100),
            stressTolerance: getRandomInt(0, 100)
        };

        const genomePrediction: GenomePrediction = {
            iqExpectation: iq, // This seems to be "Expectation of Partner" or "Child"? Based on previous JSON it was low numbers like +22?
            // Checking previous JSON: "iqExpectation": 22. 
            // Wait, in previous JSON it was "iqExpectation": 8, 22. This looks like "Difference" or "+/-"?
            // Or maybe "Probability"?
            // Let's check the UI usage.
            // In Card.tsx or DetailView?
            // The JSON had "iqExpectation": 8.
            // If the user said "IQ is 75~150", they probably mean the actual value, OR the child prediction value.
            // But `genomePrediction.iqExpectation` was likely displayed somewhere.
            // Let's assume for now it's the raw value or scaled value.
            // If existing was 8/22, maybe it was a score out of something? 
            // Or maybe it was "+8" (difference)?
            // The user prompt said: "IQ予測: +0 〜 +30 (推定)" -> "IQは75~150までで"
            // So I should replace that field with the 75-150 value.

            // However, the interface might expect something else?
            // Let's look at `types.ts` again. `iqExpectation: number`.
            // In DetailView, is it used? I grep'd `iqExpectation` and found nothing in components?
            // Wait, I grepped but maybe missed it or it wasn't used.
            // Let's double check usage in next step if unsure, but for now I'll put the full IQ value here
            // because the user explicitly talked about "IQ = 75-150".
            // Previous JSON had `estimatedIQ` in `childPrediction` (e.g. 91, 121), which looks like actual IQ.
            // `genomePrediction.iqExpectation` might have been something different.
            // I will set `iqExpectation` to match `childPrediction.estimatedIQ` or similar logic?
            // No, the user instruction "IQは75~150までで" likely applies to the most prominent IQ number.

            physicalAbility: getPhysicalAbility(),
            majorRisks: getRandomRisks()
        };

        // Adjust child prediction estimated IQ to be consistent if needed, 
        // or just random. User instruction was specific about distribution.

        return {
            id,
            name,
            age,
            location,
            image,
            genomePrediction,
            details: {
                geneticCompatibility,
                temperament,
                childPrediction,
                debugRecommendation: Math.random() > 0.8 ? "出生前編集によりリスク回避済み" : undefined
            },
            matchScore
        };
    });
};
