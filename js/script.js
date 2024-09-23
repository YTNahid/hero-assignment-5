// ----- Sticky Header
const header = document.querySelector('.header-sticky');

const toggleHeaderClass = () => {
    if (window.scrollY > 0) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
};

window.addEventListener('scroll', toggleHeaderClass);

// ----- Formatting Taka with commas
function formatTaka(amount) {
    // Reusable Function
    const numString = amount.toString();
    const lastThreeDigits = numString.slice(-6);
    const otherDigits = numString.slice(0, -6);

    const formattedOtherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

    return otherDigits.length > 0 ? `${formattedOtherDigits},${lastThreeDigits}` : lastThreeDigits;
}

// ----- Tab
const tabButtons = document.querySelectorAll('.tab-buttons button');
const tabContents = document.querySelectorAll('.tab-contents');

if (tabButtons && tabContents) {
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabContents.forEach((el) => el.classList.add('hidden'));

            button.classList.add('active');
            tabContents[index].classList.remove('hidden');
        });
    });
}

// ----- PopUps
// Popup Close
const closePop = document.querySelectorAll('.popup-close');

if (closePop) {
    closePop.forEach((close) => {
        close.addEventListener('click', function () {
            this.parentNode.style.transform = 'translate(-50%, -1000px)';
            this.parentNode.setAttribute('aria-hidden', 'true');
        });
    });
}

// Popups
const popups = document.querySelectorAll('.popup');

if (popups) {
    popups.forEach((pop) => {
        pop.style.transform = 'translate(-50%, -1000px)';
        pop.parentNode.setAttribute('aria-hidden', 'true');
    });
}

const depositBtn = document.querySelector('.deposit');

if (depositBtn) {
    const depositPop = document.querySelector('.popup-deposit');

    depositBtn.addEventListener('click', function () {
        depositPop.style.transform = 'translate(-50%, -50%)';
        depositPop.parentNode.setAttribute('aria-hidden', 'false');
    });
}

// Deposit
let currBalance = document.querySelector('.current-balance');
currBalance.innerText = '0.00';

const deposit = document.querySelector('.deposit-button');

if (deposit) {
    deposit.addEventListener('click', function (event) {
        event.preventDefault();

        const depositAmount = document.querySelector('.deposit-amount').value;
        const amount = parseFloat(depositAmount.replace(/,/g, ''));

        if (isNaN(amount) || amount === '') {
            alert('Invalid Empty Value');
        } else if (amount < 100) {
            alert('Minimum Deposit Amount is 100 BDT');
        } else {
            if (confirm(`Are you sure you want to deposit ${formatTaka(amount.toFixed(2))} BDT?`)) {
                const currentTotal = parseFloat(currBalance.innerText.replace(/,/g, '')) + amount;
                currBalance.innerText = formatTaka(currentTotal.toFixed(2));

                updateBalanceInLocalStorage(currentTotal.toFixed(2)); // Save to local storage

                alert(`${formatTaka(amount.toFixed(2))} added successfully. Current Balance: ${formatTaka(currentTotal.toFixed(2))}`);

                addHistory(amount, '', 'Deposited', currentTotal);
            }
        }
    });
}

// ----- Donation
const donateBtn = document.querySelectorAll('.donate-button');
const totalDonation = document.querySelectorAll('.total-donation');
const donationAmount = document.querySelectorAll('.donation-amount');

if (donateBtn) {
    donateBtn.forEach((btn, index) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();

            const amount = parseFloat(donationAmount[index].value.replace(/,/g, ''));
            const updatedBalance = parseFloat(currBalance.innerText.replace(/,/g, '')) - amount;

            if (isNaN(amount) || amount === '') {
                alert('Invalid or Empty Value');
            } else if (amount < 0.01) {
                alert('Minimum Donation Amount is 0.01 BDT');
            } else if (updatedBalance < 0) {
                alert('Insufficient Balance');
            } else {
                if (confirm(`Are you sure you want to donate ${formatTaka(amount.toFixed(2))} BDT?`)) {
                    const updateDonationTotal = parseFloat(totalDonation[index].innerText.replace(/,/g, '')) + amount;

                    totalDonation[index].innerText = formatTaka(updateDonationTotal.toFixed(2));
                    currBalance.innerText = formatTaka(updatedBalance.toFixed(2));

                    updateBalanceInLocalStorage(updatedBalance.toFixed(2));
                    updateDonationInLocalStorage(index, amount);

                    const successPop = document.querySelector('.popup-success');
                    document.querySelector('.donatedMsg').innerText = `${formatTaka(amount.toFixed(2))}`;

                    successPop.style.transform = 'scale(1) translate(-50%, -50%)';
                    successPop.parentNode.setAttribute('aria-hidden', 'false');

                    const title = this.parentNode.parentNode.querySelector('h3').innerText.replace('Donate', '').trim();
                    addHistory(amount, title, 'Donated', updatedBalance);
                }
            }
        });
    });
}

// ----- History Function
function addHistory(amount, title, action, newBalance) {
    // Reusable Function
    const content = document.querySelector('.history-content');

    const date = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka',
    };

    const formattedDate = date.toLocaleString('en-US', options);

    const message = `
        <div class="column border border-border-color rounded-2xl p-6">
            <h3 class="heading">
                <span class="h-amount">${formatTaka(amount.toFixed(2))}</span> is 
                <span class="h-action">${action}</span>
                <span class="h-title">${title}</span>
                <span>(New Balance: ${formatTaka(newBalance.toFixed(2))})</span>
            </h3>
            <p>Date: ${formattedDate} (Bangladesh Standard Time)</p>
        </div>
    `;

    content.insertAdjacentHTML('afterbegin', message);

    const history = JSON.parse(localStorage.getItem('donationHistory')) || [];
    history.push({ amount, title, action, newBalance, date: formattedDate });
    saveHistoryToLocalStorage(history);

    if (content.querySelectorAll('div').length !== 0) {
        document.querySelector('.h-empty').classList.add('hidden');
    } else {
        document.querySelector('.h-empty').classList.remove('hidden');
    }
}

// ----- Local Storage
function updateBalanceInLocalStorage(balance) {
    localStorage.setItem('currentBalance', balance);
}

function loadBalanceFromLocalStorage() {
    const storedBalance = localStorage.getItem('currentBalance');
    if (storedBalance) {
        currBalance.innerText = formatTaka(parseFloat(storedBalance).toFixed(2));
    }
}

function updateDonationInLocalStorage(index, amount) {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations[index] = (donations[index] || 0) + amount;
    localStorage.setItem('donations', JSON.stringify(donations));
}

function loadDonationsFromLocalStorage() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.forEach((amount, index) => {
        if (amount) {
            totalDonation[index].innerText = formatTaka(amount.toFixed(2));
        }
    });
}

function saveHistoryToLocalStorage(history) {
    localStorage.setItem('donationHistory', JSON.stringify(history));
}

function loadHistoryFromLocalStorage() {
    const history = JSON.parse(localStorage.getItem('donationHistory')) || [];
    const content = document.querySelector('.history-content');

    history.forEach((entry) => {
        const message = `
            <div class="column border border-border-color rounded-2xl p-6">
                <h3 class="heading">
                    <span class="h-amount">${formatTaka(entry.amount.toFixed(2))}</span> is 
                    <span class="h-action">${entry.action}</span> 
                    <span class="h-title">${entry.title}</span>
                    <span>(New Balance: ${formatTaka(entry.newBalance.toFixed(2))})</span>
                </h3>
                <p>Date: ${entry.date} (Bangladesh Standard Time)</p>
            </div>
        `;
        content.insertAdjacentHTML('afterbegin', message);
    });

    if (history.length !== 0) {
        document.querySelector('.h-empty').classList.add('hidden');
    } else {
        document.querySelector('.h-empty').classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadBalanceFromLocalStorage();
    loadDonationsFromLocalStorage();
    loadHistoryFromLocalStorage();

    const hAction = document.querySelectorAll('.h-action');

    if (hAction) {
        hAction.forEach((el) => {
            console.log(el);
            if (el.innerText === 'Deposited') el.style.color = 'green';
            else el.style.color = 'blue';
        });
    }
});
