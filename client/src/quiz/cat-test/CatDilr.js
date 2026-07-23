const catDilr = [
  // ── DI Set 1 — Store sales table (id 25-27) ──
  {
    id: 25,
    type: "mcq",
    setId: "di1",
    statement:
      "The table shows the number of units sold by four stores (P, Q, R, S) across four quarters of 2025.",
    table: {
      columns: ["Store", "Q1", "Q2", "Q3", "Q4"],
      rows: [
        ["P", "120", "140", "110", "160"],
        ["Q", "95", "100", "130", "125"],
        ["R", "150", "145", "155", "140"],
        ["S", "80", "90", "95", "100"]
      ]
    },
    question: "Which store had the highest total sales across all four quarters?",
    options: ["A. P", "B. Q", "C. R", "D. S"],
    answer: "C"
  },
  {
    id: 26,
    type: "tita",
    setId: "di1",
    question: "What is the total number of units sold by store P across all four quarters? (Enter a number only.)",
    answer: "530"
  },
  {
    id: 27,
    type: "mcq",
    setId: "di1",
    question: "Which store showed a continuous increase in sales from Q1 to Q4 without any quarter-on-quarter decline?",
    options: ["A. P", "B. Q", "C. R", "D. S"],
    answer: "D"
  },

  // ── Logical Reasoning standalone (id 28-32) ──
  {
    id: 28,
    type: "mcq",
    question:
      "Five friends — A, B, C, D, E — sit in a row facing north. B sits second from the left. D sits immediately right of B. A sits at one of the extreme ends. C sits immediately left of A. Who sits at the other extreme end?",
    options: ["A. D", "B. E", "C. C", "D. B"],
    answer: "B"
  },
  {
    id: 29,
    type: "mcq",
    question:
      "In a certain code, if 'MANGO' is coded as 'OCPIQ' (each letter shifted forward by 2 places), what is the code for 'LEMON'?",
    options: ["A. NGOQP", "B. NGOQR", "C. NGORP", "D. NGOPQ"],
    answer: "A"
  },
  {
    id: 30,
    type: "tita",
    question:
      "In a group of 120 people, 70 like tea, 55 like coffee, and 25 like both. How many people like neither tea nor coffee? (Enter a number only.)",
    answer: "20"
  },
  {
    id: 31,
    type: "mcq",
    question:
      "Statements: All chairs are tables. No table is a bench.\nConclusions:\nI. No chair is a bench.\nII. Some tables are chairs.",
    options: [
      "A. Only conclusion I follows",
      "B. Only conclusion II follows",
      "C. Both conclusions follow",
      "D. Neither conclusion follows"
    ],
    answer: "C"
  },
  {
    id: 32,
    type: "mcq",
    question:
      "A cube is painted red on all faces and cut into 27 equal smaller cubes. How many small cubes have exactly two faces painted?",
    options: ["A. 8", "B. 12", "C. 6", "D. 4"],
    answer: "B"
  },

  // ── DI Set 2 — Revenue & profit margin table (id 33-36) ──
  {
    id: 33,
    type: "mcq",
    setId: "di2",
    statement:
      "The table shows the annual revenue and profit margin of Company X from 2019 to 2023.",
    table: {
      columns: ["Year", "Revenue (₹ Cr)", "Profit Margin (%)"],
      rows: [
        ["2019", "200", "10"],
        ["2020", "180", "8"],
        ["2021", "240", "12"],
        ["2022", "264", "15"],
        ["2023", "300", "14"]
      ]
    },
    question: "In which year was the company's profit (in absolute terms) the highest?",
    options: ["A. 2021", "B. 2022", "C. 2023", "D. 2020"],
    answer: "C"
  },
  {
    id: 34,
    type: "tita",
    setId: "di2",
    question: "What was the company's profit (in ₹ crore) in 2021? (Enter the number only, e.g. 28.8)",
    answer: "28.8"
  },
  {
    id: 35,
    type: "mcq",
    setId: "di2",
    question: "In which year did revenue decline compared to the previous year?",
    options: ["A. 2020", "B. 2021", "C. 2022", "D. 2023"],
    answer: "A"
  },
  {
    id: 36,
    type: "tita",
    setId: "di2",
    question: "What is the total revenue (in ₹ crore) generated across all five years combined? (Enter a number only.)",
    answer: "1184"
  },

  // ── Linked LR puzzle — day/city assignment (id 37-40) ──
  {
    id: 37,
    type: "mcq",
    setId: "lr1",
    statement:
      "Five friends — J, K, L, M, N — each visit a different city (Delhi, Mumbai, Chennai, Kolkata, Pune) on a different day from Monday to Friday.\n\n1. L visits Pune on Monday.\n2. J visits Mumbai on Wednesday.\n3. M visits Delhi on Thursday.\n4. K visits Chennai on Friday.\n5. N visits Kolkata on Tuesday.",
    question: "Who visits Delhi?",
    options: ["A. J", "B. M", "C. K", "D. N"],
    answer: "B"
  },
  {
    id: 38,
    type: "mcq",
    setId: "lr1",
    question: "On which day does K visit Chennai?",
    options: ["A. Tuesday", "B. Wednesday", "C. Thursday", "D. Friday"],
    answer: "D"
  },
  {
    id: 39,
    type: "mcq",
    setId: "lr1",
    question: "Which city does N visit?",
    options: ["A. Delhi", "B. Kolkata", "C. Chennai", "D. Pune"],
    answer: "B"
  },
  {
    id: 40,
    type: "tita",
    setId: "lr1",
    question:
      "If Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, and Friday = 5, what is the sum of the day-numbers on which K and L make their visits? (Enter a number only.)",
    answer: "6"
  },

  // ── Standalone LR/DI (id 41-46) ──
  {
    id: 41,
    type: "mcq",
    question:
      "Pointing to a photograph, Raj said, 'She is the daughter of my grandfather's only son.' How is the girl in the photograph related to Raj?",
    options: ["A. Sister", "B. Cousin", "C. Daughter", "D. Niece"],
    answer: "A"
  },
  {
    id: 42,
    type: "mcq",
    question:
      "Aditi walks 5 km towards North, then turns right and walks 3 km, then turns right again and walks 5 km. How far is she from her starting point, and in which direction?",
    options: ["A. 3 km, East", "B. 3 km, West", "C. 5 km, North", "D. 8 km, East"],
    answer: "A"
  },
  {
    id: 43,
    type: "tita",
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ? (Enter a number only.)",
    answer: "42"
  },
  {
    id: 44,
    type: "mcq",
    question:
      "In a certain code, 'TRAIN' is written as 'UQBHO'. Using the same logic, what is the code for 'PLANE'?",
    options: ["A. QKBMF", "B. QKBNF", "C. QLBMF", "D. QKCMF"],
    answer: "A"
  },
  {
    id: 45,
    type: "tita",
    question:
      "In a survey of 100 students, 40 play Cricket, 35 play Football, 30 play Hockey, 10 play both Cricket and Football, 8 play both Football and Hockey, 6 play both Cricket and Hockey, and 4 play all three sports. How many students play none of the three sports? (Enter a number only.)",
    answer: "15"
  },
  {
    id: 46,
    type: "mcq",
    question:
      "Statement: 'The library will remain closed on all public holidays this year, including any holiday announced with less than 48 hours' notice.'\nWhich of the following can be inferred with certainty from the statement?",
    options: [
      "A. The library was open on all public holidays last year",
      "B. If a holiday is announced with only 24 hours' notice, the library will still be closed that day",
      "C. The library staff prefer holidays to be announced in advance",
      "D. Public holidays are always announced at least 48 hours in advance"
    ],
    answer: "B"
  }
];

export default catDilr;