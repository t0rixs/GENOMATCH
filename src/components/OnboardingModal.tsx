import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, ChevronRight } from 'lucide-react';

export const OnboardingModal = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [step, setStep] = useState(0); // 0: Intro, 1: Profile Input

    // Form State
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const handleNext = () => {
        setStep(1);
    };

    const handleFileUpload = () => {
        // Mock upload
        setTimeout(() => {
            setIsFileUploaded(true);
        }, 800);
    };

    const handleComplete = () => {
        if (!name || !height || !isFileUploaded) return;

        localStorage.setItem('hasVisited', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userHeight', height);
        setIsVisible(false);
    };

    const isFormValid = name.length > 0 && height.length > 0 && isFileUploaded;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[1000] bg-background flex items-center justify-center p-6 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full max-w-md relative flex flex-col items-center">
                        {/* Decorative background elements */}
                        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
                        <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-40 pointer-events-none" />

                        <div className="relative z-10 w-full">
                            {step === 0 ? (
                                // Step 0: Intro
                                <motion.div
                                    key="step0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center"
                                >
                                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-12 text-center leading-tight tracking-tight">
                                        Welcome to<br />GENOMATCH
                                    </h2>

                                    <div className="space-y-10 mb-16 w-full">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">1</div>
                                                <h3 className="font-bold text-xl text-white">遺伝子レベルのマッチング</h3>
                                            </div>
                                            <p className="text-muted-foreground pl-16 text-lg leading-relaxed">
                                                このアプリは入力した自分のゲノムと、登録された相手のゲノムから、相性診断と子供の遺伝などを推測します。
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl shrink-0">2</div>
                                                <h3 className="font-bold text-xl text-white">簡単操作で探す</h3>
                                            </div>
                                            <p className="text-muted-foreground pl-16 text-lg leading-relaxed">
                                                <b className="text-white">スワイプ</b> で好みの相手を発見。<br />
                                                <b className="text-white">タップ</b> で遺伝情報の詳細を確認。
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-2 text-lg"
                                    >
                                        <span>次へ</span>
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            ) : (
                                // Step 1: Profile Input
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-3xl font-bold text-white mb-3 text-center">
                                        プロフィールの入力
                                    </h2>
                                    <p className="text-muted-foreground text-center mb-10 text-base">
                                        マッチング精度を高めるために<br />あなたの情報を入力してください
                                    </p>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">名前</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="例: 山田 太郎"
                                                className="w-full bg-secondary/30 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">身長 (cm)</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder="例: 170"
                                                className="w-full bg-secondary/30 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">ゲノムデータ (.geno)</label>
                                            <button
                                                onClick={handleFileUpload}
                                                disabled={isFileUploaded}
                                                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${isFileUploaded
                                                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                                                    : 'border-white/20 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary'
                                                    }`}
                                            >
                                                {isFileUploaded ? (
                                                    <>
                                                        <Check className="w-10 h-10" />
                                                        <span className="font-bold text-lg">アップロード完了</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-10 h-10 opacity-50" />
                                                        <span className="font-bold text-lg">ファイルをアップロード</span>
                                                        <span className="text-sm opacity-70">クリックして .geno ファイルを選択</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleComplete}
                                        disabled={!isFormValid}
                                        className={`w-full mt-10 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${isFormValid
                                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/25 active:scale-[0.98] hover:brightness-110 cursor-pointer'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>マッチングを開始</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
