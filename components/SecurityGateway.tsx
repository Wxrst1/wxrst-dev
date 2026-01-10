import React, { useState } from 'react';

interface SecurityGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const SecurityGateway: React.FC<SecurityGatewayProps> = ({ isOpen, onClose, onLogin }) => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // HARDCODED SECURITY CHECK (For Demo/Theme purposes)
        // In production, use Supabase Auth or a hashed token.
        if (passcode === 'radical_admin' || passcode === 'admin123') {
            onLogin();
            onClose();
            setPasscode('');
            setError(false);
        } else {
            setError(true);
            setAttempts(p => p + 1);
            setPasscode('');

            // Lockout simulation
            if (attempts > 3) {
                alert("SECURITY BREACH DETECTED. SYSTEM LOCKDOWN INITIATED.");
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center font-mono">
            <div className="w-full max-w-md bg-zinc-900 border-2 border-red-900 p-8 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                <h2 className="text-2xl text-red-600 font-bold mb-6 flex items-center gap-3">
                    <span className="animate-pulse">🔒</span> SYSTEM_GATEWAY
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-red-900 font-bold">Authentication_Token</label>
                        <input
                            type="password"
                            autoFocus
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full bg-black border border-red-900/50 p-3 text-red-500 outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all placeholder:text-red-900/30"
                            placeholder="ENTER_PASSCODE"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-bold animate-pulse">
                            Example: ERROR: INVALID_CREDENTIALS // ATTEMPT {attempts}/5
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs text-red-900 hover:text-red-500 uppercase tracking-widest"
                        >
                            Terminate
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg"
                        >
                            Authenticate
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-4 border-t border-red-900/20 text-[10px] text-red-900/50 text-center">
                    SECURE_CONNECTION_ESTABLISHED_V.4.2.0
                </div>
            </div>
        </div>
    );
};

export default SecurityGateway;
