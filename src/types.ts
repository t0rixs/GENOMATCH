export interface GeneticCompatibility {
    ageGap: number;
    iqGap: number;
    morningTypeGap: number;
    extraversionGap: number;
    thinkingStyleGap: number;
}

export interface GenomePrediction {
    iqExpectation: number;
    physicalAbility: string;
    majorRisks: Array<{
        name: string;
        level: string;
    }>;
}

export interface ChildPrediction {
    estimatedLifeExpectancy: number;
    estimatedIQ: number;
    extraversion: number;
    stressTolerance: number;
    rewardDependence: number;
    morningType: number;
    obesityRisk: number;
    hairLossRisk: number;
}

export interface Temperament {
    extraversion: number;
    stressTolerance: number;
}

export interface ProfileDetails {
    temperament: Temperament;
    geneticCompatibility: GeneticCompatibility;
    childPrediction: ChildPrediction;
    debugRecommendation?: string;
}

export interface Profile {
    id: number;
    name: string;
    age: number;
    location: string;
    image: string;
    genomePrediction: GenomePrediction;
    details: ProfileDetails;
    matchScore: number;
}
