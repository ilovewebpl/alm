var LocalStorageService = (function(){
    
    let isSupported = function() {
        try {
            let itemBackup = localStorage.getItem("");
            localStorage.removeItem("");
            localStorage.setItem("", itemBackup);
            if (itemBackup === null)
                localStorage.removeItem("");
            else
                localStorage.setItem("", itemBackup);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    let saveValue = function(key, value) {
        let currentValue = getValue(key);
        if(value >= 0) {
            key === 'donate' ? currentValue += value : currentValue = value;
            localStorage.setItem(key, currentValue);
        }
    } 

    let getValue = function(key) {
        return +localStorage.getItem(key);
    }

    return {
        isSupported: isSupported,
        saveValue: saveValue,
        getValue: getValue
    };

})();

export default LocalStorageService
