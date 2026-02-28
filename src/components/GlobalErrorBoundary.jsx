import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Global Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 font-sans">
                    <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                        <h1 className="text-3xl font-bold text-red-500 mb-4">Application Crashed</h1>
                        <p className="text-slate-300 mb-6">
                            A critical error prevented the application from loading. This is likely due to missing configuration.
                        </p>

                        <div className="bg-slate-950 p-4 rounded-lg overflow-auto max-h-60 mb-6 border border-slate-800">
                            <code className="text-red-400 font-mono text-sm">
                                {this.state.error?.toString()}
                            </code>
                        </div>

                        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 mb-6">
                            <h3 className="font-bold text-blue-400 mb-2">Troubleshooting:</h3>
                            <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                                <li>Check if your <b>.env</b> file exists in the project root.</li>
                                <li>Ensure all Firebase keys (VITE_FIREBASE_API_KEY, etc.) are set.</li>
                                <li>Restart the development server after changing .env file.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
