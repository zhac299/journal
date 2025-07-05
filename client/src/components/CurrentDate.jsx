export default function CurrentDate() {
    const today = Date.now();
    var currentWeek = getCurrentWeek();
    const weekCommencing = "Week Commencing " + currentWeek;

    function getCurrentWeek() {
        if (today.getDay() == 1) return 'Monday ' + today.toDateString(); // current day is Monday

        
        var isMonday = false;
        var tillMonday = Date.now();
        if (tillMonday.getDay() > 1) {
           isMonday = false;
        } else {
            isMonday = true;
        }

        tillMonday.getDay() > 1 ? isMonday = false : isMonday = true;
        while (isMonday == false) {
            tillMonday--;
        }

        return 'Monday ' + today.toDateString(); 
    }

    return(
        <>
        {{currentWeek}}
        </>
    );
}