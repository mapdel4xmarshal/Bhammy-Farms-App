const moment = require('moment');

class Salary {
  static LOAN = 'loan';
  static ABSENCE = 'unapproved';

  constructor(employee, fullMonthsOnly = false) {
    this._fullMonthsOnly = fullMonthsOnly;
    this._salary = employee.salaries;
    this.base = employee.salary;
    this.totalRepayment = employee.salaries;
    this.paidSalaries = employee.salaries;
    this.outstandingLoanAmount = employee.deductibles;
    this.absences = employee.Absences.filter((absence) => absence.type === Salary.ABSENCE);
  }

  get paidSalaries() {
    return this._paidSalaries;
  }

  set paidSalaries(salaries) {
    this._paidSalaries = salaries.reduce((totalPaidAmount, salary) => (totalPaidAmount + +salary.amount), 0);
  }

  set absences(absences) {
    this._absenceMap = new Map();
    absences.forEach(absence => {
      const start = moment(absence.start_date, "YYYY-MM-DD");
      const end = moment(absence.end_date, "YYYY-MM-DD");

      this._absenceMap.set(absence.start_date.substr(0,7), (moment.duration(end.diff(start)).asDays()) + 1);
    });
  }

  get absences() {
    return this._absenceMap;
  }

  get nextRepaymentAmount() {
    if (this._loanPaymentDate && this.outstandingLoanAmount > 0) {
      const start = moment(new Date(), "YYYY-MM-DD");
      const end = moment(this._loanPaymentDate, "YYYY-MM-DD");

      const monthsRemaining = Math.max(1, Math.ceil(moment.duration(end.diff(start)).asMonths()));

      return (this.outstandingLoanAmount / monthsRemaining).toFixed(2);
    }
    return 0;
  }

  get nextSalary() {
    if (this._fullMonthsOnly) return this.nextFullMonthSalary;
    if (this.unpaidSalaries.length === 0) return { amount: 0, period: null };
    const periodLen = this.unpaidSalaries.length;
    const lastUnpaid = {...this.unpaidSalaries[periodLen - 1]};
    const endDay = Math.min(lastUnpaid.days, new Date().getDate());

    return {
      amount: (this.unpaidSalaries
        .reduce((totalSalary, month) => (totalSalary + +month.estSalary), 0) - this.nextRepaymentAmount).toFixed(2),
      period: periodLen > 1 ?
        `${this.unpaidSalaries[0].month} to ${this.unpaidSalaries[periodLen - 1].month}`
        : this.unpaidSalaries[0].month,
      start: `${this.unpaidSalaries[0].month}-01`,
      end: `${lastUnpaid.month}-${endDay.toString(10).padStart(2, '0')}`
    }
  }

  get nextFullMonthSalary() {
    let unpaidSalaries = this.unpaidSalaries;

    if (unpaidSalaries.length === 0) return { amount: 0, period: null };

    if (unpaidSalaries[this.unpaidSalaries.length - 1].days > new Date().getDate()) {
      unpaidSalaries = this.unpaidSalaries.slice(0, this.unpaidSalaries.length - 1);
    }

    if (unpaidSalaries.length === 0) return { amount: 0, period: null };

    const periodLen = unpaidSalaries.length;
    const lastUnpaid = {...unpaidSalaries[periodLen - 1]};
    const endDay = lastUnpaid.days;

    return {
      amount: (unpaidSalaries
        .reduce((totalSalary, month) => (totalSalary + +month.estSalary), 0) - this.nextRepaymentAmount).toFixed(2),
      period: periodLen > 1 ?
        `${unpaidSalaries[0].month} to ${unpaidSalaries[periodLen - 1].month}` : unpaidSalaries[0].month,
      start: `${unpaidSalaries[0].month}-01`,
      end: `${lastUnpaid.month}-${endDay.toString(10).padStart(2, '0')}`
    }
  }

  get unpaidSalaries() {
    const lastSalary = this._salary[this._salary.length - 1];

    let lastPaidDate;
    if (lastSalary) {
      const dateArray = lastSalary.periodEnd.split('-');
      lastPaidDate = new Date(dateArray[0], dateArray[1]);
    } else {
      const date = new Date();
      lastPaidDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2,'0')}-01`;
    }

    const owedMonths = this.pendingMonths(lastPaidDate);

    owedMonths.map((date) => {
      const monthArr = date.month.split('-');
      date.workedDays = date.days - (this.absences.get(date.month) || 0);
      if (+monthArr[0] === new Date().getUTCFullYear() && Number(monthArr[1]) === new Date().getUTCMonth() + 1) {
        date.workedDays -= (date.days - new Date().getUTCDate());
      }
      date.estSalary = ((this.base / date.days) * date.workedDays).toFixed(2);
    });

    return owedMonths;
  }

  get totalRepayment() {
    return this._totalRepayment;
  }

  set totalRepayment(salaries) {
    this._totalRepayment = salaries.reduce((totalPaidAmount, salary) => (totalPaidAmount + +salary.loanPaidAmount), 0);
  }

  get outstandingLoanAmount() {
    return this._outstandingLoan;
  }

  set outstandingLoanAmount(deductibles) {
    const loans = deductibles.filter((deductible) => deductible.type === Salary.LOAN);
    this._loanPaymentDate = loans[loans.length - 1] ? loans[loans.length - 1].dueDate : null;

    this.totalLoan = loans.reduce((totalLoan, loan) => (totalLoan + +loan.amount), 0);
    this._outstandingLoan = (this.totalLoan - this.totalRepayment);
  }

  pendingMonths(date) {
    const dateStart = moment.utc(date);
    const dateEnd = moment.utc(new Date(new Date().getTime() - 86400000));

    if (moment.duration(dateEnd.diff(dateStart)).asDays() < 1) return [];

    const interim = dateStart.clone();
    const timeValues = [];

    while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
      const month = interim.format('YYYY-MM');
      timeValues.push({ days: moment(month, "YYYY-MM").daysInMonth(), month });
      interim.add(1, 'month');
    }

    return timeValues;
  }
}

module.exports = Salary;
