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
            <h3>{currentWeek}</h3>
        </div>
    );
}