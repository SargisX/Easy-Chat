import { motion, AnimatePresence } from "framer-motion";


interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onHover: () => void;
}

export function InfoBox({ title, children, isOpen, onHover }: InfoBoxProps) {
    return (
        <div
            className="mb-3 w-100"
            onMouseEnter={onHover}
            style={{ cursor: "pointer" }}
        >
            <div className="bg-white rounded shadow-sm p-3">
                <h6 className="mb-0">{title}</h6>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 text-dark"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
