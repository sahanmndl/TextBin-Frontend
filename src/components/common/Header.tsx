import {PlusIcon} from "lucide-react";

const Header = () => {
    return (
        <header className="border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between h-16 px-4 sm:px-8">
                <a href="/">
                    <h1 className="text-xl font-semibold">TextBin</h1>
                </a>
                <div className="flex items-center gap-2 sm:gap-8">
                    <a
                        className="text-sm font-medium hover:underline"
                        href="https://textbin-pro.vercel.app/read/ZE9fLh56"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        About
                    </a>
                    <a href="/terms-of-service" className="text-sm font-medium hover:underline">
                        Terms
                    </a>
                    <a href="/public" className="text-sm font-medium hover:underline">
                        Public
                    </a>
                    <a href="/saved" className="text-sm font-medium hover:underline">
                        Saved
                    </a>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        <PlusIcon size={20}/>
                        <span className="hidden sm:inline">New Document</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header;