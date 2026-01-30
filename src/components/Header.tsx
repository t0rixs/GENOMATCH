import { Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border"
        >
            <div className="flex items-center gap-2">
                <Menu className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="flex flex-col items-center">
                <h1 className="text-sm font-semibold tracking-wider text-primary">GENOMATCH</h1>
            </div>

            <div className="relative">
                <Bell className="w-6 h-6 text-muted-foreground" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            </div>
        </motion.header>
    );
};
