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
        <div>
            <p class="font-sans text-lg antialiased font-bold text-left underline underline-offset-4">Week Commencing {currentWeek}</p>
            <p class="font-sans text-base antialiased text-left">The date today is: {today.toDateString()}</p>
        </div>
    );
}