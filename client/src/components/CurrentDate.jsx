export default function CurrentDate() {
    const today = new Date();

    function getCurrentWeek() {
        // Get the previous Monday (or today if today is Monday)
        const day = today.getDay();
        // getDay(): Sunday - 0, Monday - 1, ..., Saturday - 6
        const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        return monday.toDateString();
    }

    const currentWeek = getCurrentWeek();

    return (
        <div className="space-y-1">
            <p className="font-sans text-base sm:text-lg antialiased font-bold text-left underline underline-offset-4 text-slate-800 dark:text-slate-100">
                Week Commencing {currentWeek}
            </p>
            <p className="font-sans text-xs sm:text-sm antialiased text-left text-slate-600 dark:text-slate-400">
                Today is {today.toDateString()}
            </p>
        </div>
    );
}