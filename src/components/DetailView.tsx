import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dna, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import type { Profile } from '../types';

interface DetailViewProps {
    profile: Profile;
    onClose: () => void;
}

const helpContent = {
    geneticCompatibility: {
        title: "遺伝的適合性とは？",
        text: "あなたと相手のゲノム情報に基づく相性予測です。パラメータの差が少ないパートナーを選ぶことで、離婚率を引き下げられる傾向があります。"
    },
    childPrediction: {
        title: "次世代予測モデルとは？",
        text: "あなたと相手のゲノムデータに基づき、高い確率で遺伝する形質を予測したモデルです。メンデル遺伝だけでなく、多因子遺伝（身長、知能、気質など）も考慮した統計的予測であり、潜在的な可能性を示唆します。"
    }
};

const HelpButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="text-muted-foreground hover:text-primary transition-colors ml-2">
        <HelpCircle className="w-4 h-4" />
    </button>
);

const HelpModal = ({ content, onClose }: { content: { title: string, text: string } | null, onClose: () => void }) => {
    if (!content) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10">
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <HelpCircle className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{content.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {content.text}
                </p>
            </motion.div>
        </motion.div>
    );
};

const IQBar = ({ value }: { value: number }) => {
    // Sigmoid function to map infinite IQ range to 0-100% container width
    const scale = 25;
    const normalized = 1 / (1 + Math.exp(-(value - 100) / scale));
    const percentage = normalized * 100;

    // Calculate width relative to left (0%)
    const width = percentage;

    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm text-gray-300">推定IQ</span>
                <span className={`text-sm font-bold ${value < 100 ? 'text-red-500' : 'text-primary'}`}>
                    {value}
                </span>
            </div>

            <div className="relative h-2 bg-secondary/30 rounded-full overflow-hidden">
                {/* Center marker */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 z-10" />

                {/* Bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 bottom-0 left-0 h-full rounded-full ${value < 100 ? 'bg-red-500' : 'bg-primary'}`}
                />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                <span>Low</span>
                <span className="text-white/30">100</span>
                <span>High</span>
            </div>
        </div>
    );
};

const BinaryGauge = ({ label, leftLabel, rightLabel, value }: { label: string, leftLabel: string, rightLabel: string, value: number }) => (
    <div className="bg-secondary/20 rounded-xl p-3 border border-border">
        <span className="text-xs text-muted-foreground block mb-2">{label}</span>
        <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden mb-1">
            <div
                className="absolute top-0 bottom-0 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
            />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
        </div>
    </div>
);

const TraitBar = ({ label, value, isRisk = false, unit = "%" }: { label: string, value: number, isRisk?: boolean, unit?: string }) => (
    <div>
        <div className="flex justify-between items-end mb-1">
            <span className="text-sm text-gray-300">{label}</span>
            <span className={`text-sm font-bold ${isRisk ? 'text-red-400' : 'text-primary'}`}>
                {value}<span className="text-xs ml-0.5 opacity-70">{unit}</span>
            </span>
        </div>
        <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isRisk ? 'bg-red-500' : 'bg-primary'}`}
            />
        </div>
    </div>
);

export const DetailView = ({ profile, onClose }: DetailViewProps) => {
    // State for help modal
    const [activeHelp, setActiveHelp] = React.useState<keyof typeof helpContent | null>(null);

    // Prepare Radar Data
    const radarData = [
        { subject: '年齢差', A: profile.details.geneticCompatibility.ageGap, fullMark: 20 },
        { subject: 'IQ差', A: profile.details.geneticCompatibility.iqGap, fullMark: 40 },
        { subject: 'クロノタイプ差', A: profile.details.geneticCompatibility.morningTypeGap, fullMark: 50 },
        { subject: '外向性差', A: profile.details.geneticCompatibility.extraversionGap, fullMark: 100 },
        { subject: '思考スタイル差', A: profile.details.geneticCompatibility.thinkingStyleGap, fullMark: 100 },
    ];

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-background flex flex-col overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 p-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border z-10">
                <h2 className="text-lg font-bold">シミュレーション結果</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="p-6 space-y-8 pb-20">
                {/* Genetic Compatibility Chart */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Dna className="w-5 h-5" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">遺伝的適合性</h3>
                        <HelpButton onClick={() => setActiveHelp('geneticCompatibility')} />
                    </div>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                <Radar
                                    name="数値差"
                                    dataKey="A"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Child Prediction Model */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Dna className="w-5 h-5" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">次世代予測モデル</h3>
                        <HelpButton onClick={() => setActiveHelp('childPrediction')} />
                    </div>

                    {profile.details.childPrediction && (
                        <>
                            {/* Binary Traits (Gauges) */}
                            <div className="grid grid-cols-2 gap-4">
                                <BinaryGauge
                                    label="気質"
                                    leftLabel="内向"
                                    rightLabel="外向"
                                    value={profile.details.childPrediction.extraversion}
                                />
                                <BinaryGauge
                                    label="クロノタイプ"
                                    leftLabel="夜型"
                                    rightLabel="朝型"
                                    value={profile.details.childPrediction.morningType}
                                />
                            </div>

                            {/* Linear Traits */}
                            <div className="space-y-4 pt-2">
                                <TraitBar label="推定寿命スコア" value={profile.details.childPrediction.estimatedLifeExpectancy} unit="歳" />
                                <IQBar value={profile.details.childPrediction.estimatedIQ} />
                                <TraitBar label="ストレス耐性" value={profile.details.childPrediction.stressTolerance} />
                                <TraitBar label="報酬依存性" value={profile.details.childPrediction.rewardDependence} />
                                <TraitBar label="肥満リスク" value={profile.details.childPrediction.obesityRisk} isRisk />
                                <TraitBar label="脱毛リスク" value={profile.details.childPrediction.hairLossRisk} isRisk />
                            </div>
                        </>
                    )}
                    <p>遺伝的リスク</p>
                    <div className="flex gap-2">
                        {profile.genomePrediction.majorRisks.length > 0 ? (
                            profile.genomePrediction.majorRisks.map((risk, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                                    {risk.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full border border-green-400/20">なし</span>
                        )}
                    </div>
                </section>

            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {activeHelp && (
                    <HelpModal
                        content={helpContent[activeHelp]}
                        onClose={() => setActiveHelp(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};
