import './assets/scss/style.scss';
import LocalStorageService from './components/localStorageService.js';

const config = {
    numberOfDays: 3,
    donorsNumber: 42,
    startDonateValue: 57,
    maxDonateValue: 500
}

const donateFormElement = document.querySelector('#form');

var EventsService = (function() {
    let infoButton = document.querySelector('#info');
    let closeCollapseButton = document.querySelector('#collapse button');
    let shareButton = document.querySelector('#share');
    let saveButton = document.querySelector('#save');
    
    let setEvents = function() {
        donateFormElement.addEventListener("submit", function(event) {
            let inputValue = +donateFormElement.querySelector('input').value,
                validationNumbers = !/^\s*$/.test(inputValue) && !isNaN(inputValue) && inputValue > 0,
                maxDonateValue = (config.maxDonateValue - LocalStorageService.getValue('donate')) >= inputValue;
                console.log(maxDonateValue +''+ validationNumbers);
            if (!validationNumbers || !maxDonateValue) { 
                DonateModule.showAlert('Please enter correct number or grater than 0 or less than maximum', 'warning');
                event.preventDefault();  
                return;
            } else {
                LocalStorageService.saveValue('donate', inputValue);
                DonateModule.showAlert('Thanks for money!', 'success');
                DonateModule.disableButton(true);
                DonateModule.setProgress(DonateModule.calculateProgress(LocalStorageService.getValue('donate')));
                event.preventDefault();    
            }
        }, false);

        infoButton.addEventListener("click", function(event) {
            let collapseItem = document.querySelector('#collapse');
            if (collapseItem.classList.contains('u-display-none')){
                collapseItem.classList.remove('u-display-none');
            }
            event.preventDefault();
        });

        closeCollapseButton.addEventListener("click", function(event) {
            let collapseItem = document.querySelector('#collapse');
            if (!collapseItem.classList.contains('u-display-none')){
                collapseItem.classList.add('u-display-none');
            }
            event.preventDefault();
        });

        shareButton.addEventListener("click", function(event) {
            let email = '',
                subject = 'I would like to share you something.',
                emailBody = 'Hi my friend, I am sending you interesting adress';
            document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
            event.preventDefault();
        });

        saveButton.addEventListener("click", function(event) {
            let tempValue = +donateFormElement.querySelector('input').value;
            LocalStorageService.saveValue('temp-donate', tempValue);
            DonateModule.showAlert('See you leter', 'success');
            event.preventDefault();
        });
    }
    return {
        init: setEvents
    }
})();

var DonateModule = (function() {

    let disableButton = function(status){
        let button = donateFormElement.querySelector('button');
        status ? button.disabled = true : button.disabled = false; 
    }

    let showAlert = function(message, type) {
        let alertElement = document.querySelector('#alert');
        if (alertElement.classList.contains('u-display-none')) {
            alertElement.classList.remove('u-display-none');
        }
        type === 'success' ? alertElement.classList.add('m-alert--success') : alertElement.classList.add('m-alert--warning');
        alertElement.innerHTML = '<p>'+message+'</p>';
    }

    let calculateProgress = function(value){
        return value / config.maxDonateValue * 100;
    }

    let setProgress = function(value) {
        let progressBarElement = document.querySelector('#progress > span');
        progressBarElement.style['width'] = value + '%';
        setCounter();
    }

    let setCounter = function() {
        let tooltipElement = document.querySelector('.a-tooltip-value');
        let counterValue = config.maxDonateValue - LocalStorageService.getValue('donate');
        tooltipElement.innerHTML= '$'+counterValue;
    }

    let init = function(){
        let initValue = 0;
        donateFormElement.querySelector('input').value = LocalStorageService.getValue('temp-donate');
        
        if(!LocalStorageService.isSupported()) {
            showAlert('Update your browser!', 'warning');
            disableButton(true);
            return;
        }

        if(!LocalStorageService.getValue('donate')) {
            initValue = config.startDonateValue;
            LocalStorageService.saveValue('donate', initValue);
            setProgress(calculateProgress(initValue));
        }
        else {
            setProgress(calculateProgress(LocalStorageService.getValue('donate')));
        }
    }

    return {
        calculateProgress: calculateProgress,
        setProgress: setProgress,
        showAlert: showAlert,
        disableButton: disableButton,
        setCounter: setCounter,
        init: init,
    }

})(); 

DonateModule.init();
EventsService.init();