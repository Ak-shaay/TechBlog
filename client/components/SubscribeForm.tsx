import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SubscribeFormProps {
    className?: string;
    variant?: 'footer' | 'hero';
}

export function SubscribeForm({ className = "", variant = 'footer' }: SubscribeFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMsg('Subscribed successfully!');
                setEmail('');
            } else {
                setStatus('error');
                setMsg(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            setStatus('error');
            setMsg('Error subscribing');
        }
    };

    if (variant === 'hero') {
        return (
            <div className="w-full">
                <form className={`flex flex-col sm:flex-row gap-3 ${className}`} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? '...' : (status === 'success' ? 'Joined!' : <><Sparkles className="h-4 w-4" /> Subscribe</>)}
                    </button>
                </form>
                {msg && <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>{msg}</p>}
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading' || status === 'success'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                >
                    {status === 'loading' ? '...' : (status === 'success' ? '✓' : 'Join')}
                </button>
            </form>
            {msg && <p className={`text-xs mt-1 ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>{msg}</p>}
        </div>
    );
}
