export default function CurrentDate() {
    const today = new Date();
    var currentWeek = getCurrentWeek();

    function getCurrentWeek() {
        if (today.getDay() == 1) return 'Monday ' + today.toDateString(); // current day is Monday

        var isMonday = false;
        var tillMonday = new Date();
        if (tillMonday.getDay() > 1) {
           isMonday = false;
        } else {
            isMonday = true;
        }

        tillMonday.getDay() > 1 ? isMonday = false : isMonday = true;
        while (isMonday == false) {
            tillMonday--;
        }

        return tillMonday.toDateString();
    }

    return(
        <>
        <div>
            <h3>{currentWeek}</h3>
        </div>
        </>
    );
}