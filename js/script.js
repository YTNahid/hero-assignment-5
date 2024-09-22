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

if (deposit) {
    deposit.addEventListener('click', function (event) {
        event.preventDefault();

        const depositAmount = document.querySelector('.deposit-amount').value;
        const amount = parseFloat(depositAmount);

        if (isNaN(depositAmount) || depositAmount === '') {
            alert('Invalid Empty Value');
        } else if (amount < 100) {
            alert('Minimum Deposite Amount is 100 BDT');
        } else {
            const currentTotal = parseFloat(currBalance.innerText) + amount;
            currBalance.innerText = currentTotal.toFixed(2);
            alert(`${amount.toFixed(2)} BDT added successfully. Current Balance: ${currentTotal.toFixed(2)} BDT`);
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
                console.log(amount);
                alert('Invalid or Empty Value');
            } else if (amount < 0.01) {
                alert('Minimum Donation Amount is 0.01 BDT');
            } else if (updatedBalance < 0) {
                alert('Insufficient Balance');
            } else {
                const updateDonationTotal = parseFloat(totalDonation[index].innerText) + amount;

                totalDonation[index].innerText = updateDonationTotal.toFixed(2);

                currBalance.innerText = updatedBalance.toFixed(2);

                const successPop = document.querySelector('.popup-success');
                document.querySelector('.donatedMsg').innerText = `${amount.toFixed(2)} BDT`;

                successPop.style.transform = 'scale(1) translate(-50%, -50%)';
                successPop.parentNode.setAttribute('aria-hidden', 'false');
            }
        });
    });
}
