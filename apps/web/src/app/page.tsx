"use client";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
                <h1 className="text-4xl font-bold mb-8">Website Builder Platform</h1>
                <p className="text-lg mb-4">
                    A Figma-like website builder that outputs production-ready Next.js websites
                </p>
                <div className="bg-blue-100 rounded-lg p-4 text-blue-800 mb-8">
                    Setup complete! The project structure is ready for development.
                </div>
            </div>
        </main>
    );
}