export const IMMIGRATION_CHECKLIST = [
  {
    category: 'Arrival Essentials',
    emoji: '✈️',
    items: [
      { id: 'sin', label: 'Apply for SIN (Social Insurance Number)', detail: 'Service Canada office or online. Needed for work and taxes.', done: false },
      { id: 'health', label: 'Register for Provincial Health Card', detail: 'Ontario: OHIP. 3-month wait period applies for newcomers.', done: false },
      { id: 'bank', label: 'Open Canadian Bank Account', detail: 'TD, RBC, Scotiabank all have newcomer packages. No credit history needed.', done: false },
      { id: 'phone', label: 'Get a Canadian Phone Number', detail: 'Freedom Mobile, Koodo, or Fido for budget-friendly plans.', done: false },
    ]
  },
  {
    category: 'Documents & ID',
    emoji: '📄',
    items: [
      { id: 'pr_card', label: 'Receive PR Card', detail: 'Mailed to your Canadian address. Takes 4–8 weeks after landing.', done: false },
      { id: 'drivers', label: 'Convert/Get Drivers License', detail: 'Ontario: G1 test if new. Some countries get direct exchange.', done: false },
      { id: 'address', label: 'Update Address with IRCC', detail: 'Required within 180 days of any address change.', done: false },
    ]
  },
  {
    category: 'Financial Setup',
    emoji: '💳',
    items: [
      { id: 'tfsa', label: 'Open TFSA Account', detail: '$7,000 room in 2024. Tax-free growth and withdrawals.', done: false },
      { id: 'rrsp', label: 'Open RRSP Account', detail: 'Contributions reduce taxable income. 18% of prior year income.', done: false },
      { id: 'credit', label: 'Apply for Starter Credit Card', detail: 'Secured card or newcomer card from your bank. Build credit ASAP.', done: false },
      { id: 'cra', label: 'Register for CRA My Account', detail: 'Track tax refunds, TFSA room, RRSP limits online.', done: false },
    ]
  },
  {
    category: 'PR Obligations',
    emoji: '🛂',
    items: [
      { id: 'residency', label: 'Track PR Residency Obligation', detail: '730 days in Canada per 5-year PR period. Track carefully.', done: false },
      { id: 'travel', label: 'Get Travel Document (if needed)', detail: 'PRTD needed to re-enter Canada if PR card expired.', done: false },
      { id: 'citizenship', label: 'Citizenship Eligibility Tracking', detail: '3 of 5 years physical presence. Day counter tool recommended.', done: false },
    ]
  },
  {
    category: 'Settlement',
    emoji: '🏠',
    items: [
      { id: 'housing', label: 'Find Permanent Housing', detail: 'Check Zumper, Padmapper, Kijiji. Budget 30-35% of income for rent.', done: false },
      { id: 'noc', label: 'Credential Recognition (if needed)', detail: 'Regulated professions need WES or provincial body evaluation.', done: false },
      { id: 'taxes', label: 'File First Canadian Tax Return', detail: 'Due April 30. Even if no income — builds benefits eligibility.', done: false },
    ]
  }
];
