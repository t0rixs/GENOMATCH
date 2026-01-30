import { motion, useMotionValue, useTransform, type PanInfo, animate } from 'framer-motion';
import { MapPin, Brain, Activity, AlertTriangle } from 'lucide-react';
import type { Profile } from '../types';

interface CardProps {
    profile: Profile;
    onSwipe: (direction: 'left' | 'right') => void;
    onTap: () => void;
    style?: React.CSSProperties;
    isFront: boolean;
}

export const Card = ({ profile, onSwipe, onTap, style, isFront }: CardProps) => {
    // Local motion values for drag (only active when isFront)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color overlays for swipe feedback
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [0, -150], [0, 1]);

    const handleDragEnd = async (_: any, info: PanInfo) => {
        const threshold = 100;
        const velocity = info.velocity.x;

        if (info.offset.x > threshold) {
            // Fly out right
            await animate(x, window.innerWidth + 200, {
                type: "spring",
                velocity: velocity,
                stiffness: 200,
                damping: 50
            });
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            // Fly out left
            await animate(x, -window.innerWidth - 200, {
                type: "spring",
                velocity: velocity,
                stiffness: 200,
                damping: 50
            });
            onSwipe('left');
        }
    };

    // Construct styles carefully.
    // If isFront, we use local motion values x and y for drag.
    // If !isFront, we ignore local motion values and rely on props (stack effect).
    // Note: Framer Motion style prop with motion values overrides standard style prop with same keys.
    const combinedStyle = isFront
        ? { ...style, x, y, rotate, opacity, cursor: 'grab' }
        : { ...style, x: 0, y: (style as any)?.y || 0, rotate: 0, opacity: 1 };


    return (
        <motion.div
            style={combinedStyle as any}
            drag={isFront ? true : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1} // Allow free movement
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-[calc(100vh-140px)] rounded-3xl overflow-hidden shadow-2xl bg-card border border-border"
            onClick={onTap}
            whileTap={isFront ? { cursor: 'grabbing' } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Snap back
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
            </div>

            {/* Swipe Feedback Overlays */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 transform -rotate-12 border-4 border-green-500 rounded-lg px-4 py-2">
                <span className="text-4xl font-bold text-green-500 uppercase tracking-widest">LIKE</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-20 transform rotate-12 border-4 border-red-500 rounded-lg px-4 py-2">
                <span className="text-4xl font-bold text-red-500 uppercase tracking-widest">NOPE</span>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4">
                {/* Name & Basic Info */}
                <div>
                    <div className="flex items-end gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                        <span className="text-xl text-gray-300 mb-1">{profile.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{profile.location}</span>
                    </div>
                </div>

                {/* Genome Stats Card */}
                <div className="bg-background/60 backdrop-blur-md rounded-xl p-4 border border-white/10" onClick={onTap}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">ゲノム予測</span>
                        <div className="flex items-center gap-1 text-primary">
                            <Activity className="w-4 h-4" />
                            <span className="font-bold">{profile.matchScore}% マッチ</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">予測IQ</span>
                            </div>
                            <span className="text-sm font-bold text-blue-400">{profile.details.childPrediction.estimatedIQ}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-400" />
                                <span className="text-sm">身体能力</span>
                            </div>
                            <span className="text-sm font-bold text-green-400">{profile.genomePrediction.physicalAbility}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm">リスク</span>
                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
