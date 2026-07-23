const matDataAnalysis = [
  {
    id: 61,
    setId: "di1",
    statement: "The table shows the number of units sold by four stores (P, Q, R, S) across four quarters.",
    table: {
      columns: ["Store", "Q1", "Q2", "Q3", "Q4"],
      rows: [
        ["P", "120", "140", "110", "160"],
        ["Q", "95", "100", "130", "125"],
        ["R", "150", "145", "155", "140"],
        ["S", "80", "90", "85", "100"]
      ]
    },
    question: "Which store had the highest total sales across all four quarters?",
    options: ["A. P", "B. Q", "C. R", "D. S"],
    answer: "C"
  },
  {
    id: 62,
    setId: "di1",
    question: "What is the total number of units sold by store S across all four quarters?",
    options: ["A. 335", "B. 345", "C. 355", "D. 365"],
    answer: "C"
  },
  {
    id: 63,
    question:
      "Data Sufficiency: What is the value of x?\n(1) x + y = 10\n(2) x - y = 2\nDetermine if the statements together/individually are sufficient.",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are sufficient, but neither alone",
      "D. Each statement alone is sufficient"
    ],
    answer: "C"
  },
  {
    id: 64,
    question:
      "Data Sufficiency: Is n an even number?\n(1) n is divisible by 4\n(2) n is divisible by 6",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are needed",
      "D. Each statement alone is sufficient"
    ],
    answer: "D"
  },
  {
    id: 65,
    question:
      "A pie chart shows a company's expenses: Salaries 40%, Rent 20%, Marketing 15%, Utilities 10%, Other 15%. If total expenses are ₹50,00,000, what is the amount spent on Marketing?",
    options: ["A. ₹7,50,000", "B. ₹6,50,000", "C. ₹8,00,000", "D. ₹7,00,000"],
    answer: "A"
  },
  {
    id: 66,
    question:
      "In a survey of 200 people, 120 like tea, 90 like coffee, and 40 like both. How many like neither?",
    options: ["A. 20", "B. 30", "C. 40", "D. 50"],
    answer: "B"
  },
  {
    id: 67,
    question:
      "The average marks of a class of 40 students is 65. If the top 5 scorers averaged 90, what is the average of the remaining 35 students?",
    options: ["A. 61.4", "B. 62.1", "C. 60.7", "D. 63.5"],
    answer: "A"
  },
  {
    id: 68,
    question:
      "A bar chart shows quarterly profit growth. If Q1 profit was ₹10 lakh and it grew by 20% each quarter, what was the Q4 profit?",
    options: ["A. ₹17.28 lakh", "B. ₹20.00 lakh", "C. ₹16.00 lakh", "D. ₹18.40 lakh"],
    answer: "A"
  },
  {
    id: 69,
    setId: "di2",
    statement: "The table shows marks scored (out of 100) by four students in three subjects.",
    table: {
      columns: ["Student", "Maths", "Science", "English"],
      rows: [
        ["A", "78", "85", "90"],
        ["B", "92", "76", "88"],
        ["C", "65", "70", "75"],
        ["D", "88", "95", "80"]
      ]
    },
    question: "Which student scored the highest total marks across all three subjects?",
    options: ["A. A", "B. B", "C. C", "D. D"],
    answer: "D"
  },
  {
    id: 70,
    setId: "di2",
    question: "What is the average score of student B across the three subjects?",
    options: ["A. 82.33", "B. 84.67", "C. 85.33", "D. 86.00"],
    answer: "C"
  },
  {
    id: 71,
    setId: "di2",
    question: "By how many marks did D outscore C in total (across all three subjects)?",
    options: ["A. 43", "B. 48", "C. 53", "D. 58"],
    answer: "C"
  },
  {
    id: 72,
    setId: "di3",
    statement: "The table shows the monthly expenditure (in ₹'000) of a household across four months.",
    table: {
      columns: ["Category", "Jan", "Feb", "Mar", "Apr"],
      rows: [
        ["Groceries", "12", "14", "13", "15"],
        ["Rent", "20", "20", "20", "20"],
        ["Utilities", "5", "6", "5", "7"],
        ["Miscellaneous", "8", "7", "9", "6"]
      ]
    },
    question: "What is the total household expenditure in March (in ₹'000)?",
    options: ["A. 45", "B. 46", "C. 47", "D. 48"],
    answer: "C"
  },
  {
    id: 73,
    setId: "di3",
    question: "In which month was the total household expenditure the highest?",
    options: ["A. Jan", "B. Feb", "C. Mar", "D. Apr"],
    answer: "D"
  },
  {
    id: 74,
    setId: "di3",
    question: "What is the percentage increase in Utilities expenditure from March to April?",
    options: ["A. 20%", "B. 30%", "C. 40%", "D. 50%"],
    answer: "C"
  },
  {
    id: 75,
    question:
      "Data Sufficiency: What is the value of y?\n(1) 2y + 5 = 15\n(2) y is a positive integer",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are sufficient, but neither alone",
      "D. Each statement alone is sufficient"
    ],
    answer: "A"
  },
  {
    id: 76,
    question:
      "Data Sufficiency: Is x positive?\n(1) x squared equals 9\n(2) x cubed equals -27",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are sufficient, but neither alone",
      "D. Each statement alone is sufficient"
    ],
    answer: "B"
  },
  {
    id: 77,
    question:
      "Data Sufficiency: What is the area of a rectangle?\n(1) The length is 10 cm.\n(2) The perimeter is 36 cm.",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are sufficient, but neither alone",
      "D. Each statement alone is sufficient"
    ],
    answer: "C"
  },
  {
    id: 78,
    question:
      "Data Sufficiency: Is the number n divisible by 3?\n(1) The sum of the digits of n is 12\n(2) n is divisible by 9",
    options: [
      "A. Statement (1) alone is sufficient",
      "B. Statement (2) alone is sufficient",
      "C. Both statements together are needed",
      "D. Each statement alone is sufficient"
    ],
    answer: "D"
  },
  {
    id: 79,
    question:
      "A alone can complete a task in 12 days and B alone can complete it in 18 days. Working together, how many days will they take to complete the task?",
    options: ["A. 6 days", "B. 7.2 days", "C. 8 days", "D. 9 days"],
    answer: "B"
  },
  {
    id: 80,
    question:
      "The ratio of the ages of A and B is 3:5. If the sum of their ages is 64 years, what is A's age?",
    options: ["A. 20", "B. 22", "C. 24", "D. 26"],
    answer: "C"
  },
  {
    id: 81,
    question:
      "A shopkeeper marks up an item by 25% and then gives a discount of 10% on the marked price. What is his overall profit percentage?",
    options: ["A. 10%", "B. 12.5%", "C. 15%", "D. 17.5%"],
    answer: "B"
  },
  {
    id: 82,
    question:
      "A mixture of 60 liters has milk and water in the ratio 2:1. How many liters of water must be added to make the ratio 1:1?",
    options: ["A. 10", "B. 15", "C. 20", "D. 25"],
    answer: "C"
  },
  {
    id: 83,
    question: "A sum of ₹8,000 is invested at 10% simple interest per annum. What is the interest earned in 3 years?",
    options: ["A. ₹2,000", "B. ₹2,200", "C. ₹2,400", "D. ₹2,600"],
    answer: "C"
  },
  {
    id: 84,
    question:
      "In a survey of 300 students, 150 play cricket, 120 play football, and 50 play both. How many play neither sport?",
    options: ["A. 60", "B. 70", "C. 80", "D. 90"],
    answer: "C"
  },
  {
    id: 85,
    question: "A car travels 240 km in 4 hours. What is its average speed in km/h?",
    options: ["A. 50", "B. 55", "C. 60", "D. 65"],
    answer: "C"
  },
  {
    id: 86,
    question:
      "The population of a town increases at a rate of 10% per annum. If the current population is 44,000, what will be the population after 2 years?",
    options: ["A. 51,240", "B. 52,240", "C. 53,240", "D. 54,240"],
    answer: "C"
  },
  {
    id: 87,
    question:
      "A pie chart shows the distribution of votes among four candidates: A 35%, B 25%, C 20%, D 20%. If the total votes cast were 40,000, how many votes did candidate B receive?",
    options: ["A. 8,000", "B. 9,000", "C. 10,000", "D. 11,000"],
    answer: "C"
  },
  {
    id: 88,
    question:
      "The average of five numbers is 24. If one number is excluded, the average of the remaining four becomes 22. What is the excluded number?",
    options: ["A. 28", "B. 30", "C. 32", "D. 34"],
    answer: "C"
  },
  {
    id: 89,
    question:
      "Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?",
    options: ["A. 10 minutes", "B. 12 minutes", "C. 15 minutes", "D. 18 minutes"],
    answer: "B"
  },
  {
    id: 90,
    question:
      "A bar chart shows a company's revenue (in ₹ crore): 2021: 50, 2022: 55, 2023: 60.5, 2024: 66.55. What is the constant annual percentage growth rate?",
    options: ["A. 8%", "B. 10%", "C. 12%", "D. 15%"],
    answer: "B"
  }
];

export default matDataAnalysis;