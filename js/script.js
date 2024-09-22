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
            this.parentNode.style.transform = 'scale(0) translate(-50%, -50%)';
            this.parentNode.setAttribute('aria-hidden', 'true');
        });
    });
}

// Popups
const popups = document.querySelectorAll('.popup');

if (popups) {
    popups.forEach((pop) => {
        pop.style.transform = 'scale(0) translate(-50%, -50%)';
        pop.parentNode.setAttribute('aria-hidden', 'true');
    });
}

const depositBtn = document.querySelector('.deposit');

if (depositBtn) {
    const depositPop = document.querySelector('.popup-deposit');

    depositBtn.addEventListener('click', function () {
        depositPop.style.transform = 'scale(1) translate(-50%, -50%)';
        depositPop.parentNode.setAttribute('aria-hidden', 'false');
    });
}

// Deposit
let currBalance = document.querySelector('.current-balance');

const deposit = document.querySelector('.deposit-button');

function updateBalanceInLocalStorage(balance) {
    localStorage.setItem('currentBalance', balance);
}

function loadBalanceFromLocalStorage() {
    const storedBalance = localStorage.getItem('currentBalance');
    if (storedBalance) {
        currBalance.innerText = parseFloat(storedBalance).toFixed(2);
    }
}

if (deposit) {
    deposit.addEventListener('click', function (event) {
        event.preventDefault();

        const depositAmount = document.querySelector('.deposit-amount').value;
        const amount = parseFloat(depositAmount);

        if (isNaN(depositAmount) || depositAmount === '') {
            alert('Invalid Empty Value');
        } else if (amount < 100) {
            alert('Minimum Deposit Amount is 100 BDT');
        } else {
            const currentTotal = parseFloat(currBalance.innerText) + amount;
            currBalance.innerText = currentTotal.toFixed(2);
            updateBalanceInLocalStorage(currentTotal.toFixed(2)); // Save to local storage
            alert(`${amount.toFixed(2)} BDT added successfully. Current Balance: ${currentTotal.toFixed(2)} BDT`);

            addHistory(amount, '', 'deposited');
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

            const amount = parseFloat(donationAmount[index].value);
            const updatedBalance = parseFloat(currBalance.innerText) - amount;

            if (isNaN(amount) || amount === '') {
                alert('Invalid or Empty Value');
            } else if (amount < 0.01) {
                alert('Minimum Donation Amount is 0.01 BDT');
            } else if (updatedBalance < 0) {
                alert('Insufficient Balance');
            } else {
                const updateDonationTotal = parseFloat(totalDonation[index].innerText) + amount;
                totalDonation[index].innerText = updateDonationTotal.toFixed(2);
                currBalance.innerText = updatedBalance.toFixed(2);
                updateBalanceInLocalStorage(updatedBalance.toFixed(2)); // Save balance
                updateDonationInLocalStorage(index, amount); // Save donation

                const successPop = document.querySelector('.popup-success');
                document.querySelector('.donatedMsg').innerText = `${amount.toFixed(2)} BDT`;

                successPop.style.transform = 'scale(1) translate(-50%, -50%)';
                successPop.parentNode.setAttribute('aria-hidden', 'false');

                const title = this.parentNode.parentNode.querySelector('h3').innerText.replace('Donate', '').trim();
                addHistory(amount, title, 'Donated');
            }
        });
    });
}

// ----- History Function
function addHistory(amount, title, action) {
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
            <h3 class="heading"><span class="h-amount">${amount}</span> BDT is <span class="h-action">${action} </span><span class="h-title ">${title}</span></h3>
            <p>Date: ${formattedDate} (Bangladesh Standard Time)</p>
        </div>
    `;

    content.insertAdjacentHTML('afterbegin', message);

    // Local Storage
    const history = JSON.parse(localStorage.getItem('donationHistory')) || [];
    history.push({ amount, title, action, date: formattedDate });
    saveHistoryToLocalStorage(history);

    if (content.querySelectorAll('div').length !== 0) {
        document.querySelector('.h-empty').classList.add('hidden');
    } else {
        document.querySelector('.h-empty').classList.remove('hidden');
    }
}

// ----- Local Storage
function updateDonationInLocalStorage(index, amount) {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations[index] = (donations[index] || 0) + amount;
    localStorage.setItem('donations', JSON.stringify(donations));
}

function loadDonationsFromLocalStorage() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.forEach((amount, index) => {
        if (amount) {
            totalDonation[index].innerText = amount.toFixed(2);
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
                <h3 class="heading"><span class="h-amount">${entry.amount}</span> BDT is <span class="h-action">${entry.action} </span><span class="h-title ">${entry.title}</span></h3>
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
});
