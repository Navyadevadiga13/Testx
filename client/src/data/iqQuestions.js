// const iqQuestions = [
//     {
//         id: 1,
//         question: "Which number completes the series? 2, 5, 10, 17, ...",
//         options: ["24", "26", "25", "27"],
//         answer: "26", // +3, +5, +7, +9
//     },
//     {
//         id: 2,
//         question: "Which word does not belong with the others?",
//         options: ["Guitar", "Flute", "Violin", "Cello"],
//         answer: "Flute", // String instruments vs Wind
//     },
//     {
//         id: 3,
//         question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
//         options: ["True", "False", "Uncertain", "None of the above"],
//         answer: "True",
//     },
//     {
//         id: 4,
//         question: "Which number completes the analogy? 8 : 4 :: 10 : ?",
//         options: ["3", "5", "20", "2"],
//         answer: "5", // Half
//     },
//     {
//         id: 5,
//         question: "Complete the pattern: O, T, T, F, F, S, S, ...",
//         options: ["E", "N", "T", "O"],
//         answer: "E", // One, Two, Three... Eight
//     },
//     {
//         id: 6,
//         question: "Which of the following can be arranged into a 5-letter English word?",
//         options: ["H R G S T", "R I L S A", "T O O M T", "W Q R G S"],
//         answer: "R I L S A", // RAILS, LIARS, LAIRS...
//     },
//     {
//         id: 7,
//         question: "What comes next in the sequence? 1, 1, 2, 3, 5, 8, ...",
//         options: ["11", "12", "13", "14"],
//         answer: "13", // Fibonacci
//     },
//     {
//         id: 8,
//         question: "Finger is to Hand as Leaf is to ...",
//         options: ["Tree", "Branch", "Blossom", "Bark"],
//         answer: "Branch", // Part of structural whole sequence
//     },
//     {
//         id: 9,
//         question: "Choose the number that is 1/4 of 1/2 of 1/5 of 200.",
//         options: ["2", "4", "5", "10"],
//         answer: "5", // (200/5)/2)/4 = 40/2/4 = 20/4 = 5
//     },
//     {
//         id: 10,
//         question: "Which number should replace the question mark? 7, 10, 8, 11, 9, 12, ...",
//         options: ["7", "10", "12", "13"],
//         answer: "10", // +3, -2 pattern
//     },
//     {
//         id: 11,
//         question: "Book is to Reading as Fork is to ...",
//         options: ["Drawing", "Writing", "Stirring", "Eating"],
//         answer: "Eating",
//     },
//     {
//         id: 12,
//         question: "Find the odd one out.",
//         options: ["Triangle", "Square", "Sphere", "Rectangle"],
//         answer: "Sphere", // 3D vs 2D
//     },
//     {
//         id: 13,
//         question: "What is the next number? 100, 99, 96, 91, 84, ...",
//         options: ["73", "75", "77", "79"],
//         answer: "75", // -1, -3, -5, -7, -9
//     },
//     {
//         id: 14,
//         question: "CAT is to 3120 as DOG is to ...",
//         options: ["4157", "4150", "4152", "4125"],
//         answer: "4157", // C=3, A=1, T=20
//     },
//     {
//         id: 15,
//         question: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):",
//         options: ["City", "Animal", "Ocean", "River"],
//         answer: "Ocean", // PACIFIC
//     },
//     {
//         id: 16,
//         question: "Which number completes the grid? \n 2  4  8 \n 3  9 27 \n 4 16  ?",
//         options: ["32", "64", "48", "24"],
//         answer: "64", // Powers: 2^1, 2^2, 2^3... 4^3 = 64
//     },
//     {
//         id: 17,
//         question: "Ralph likes 25 but not 24; he likes 400 but not 300; he likes 144 but not 145. Which does he like?",
//         options: ["10", "50", "124", "1600"],
//         answer: "1600", // Square numbers
//     },
//     {
//         id: 18,
//         question: "A doctor gives you 3 pills and tells you to take one every half hour. How long will the pills last?",
//         options: ["1.5 hours", "1 hour", "2 hours", "3 hours"],
//         answer: "1 hour", // Take 1st (0:00), 2nd (0:30), 3rd (1:00)
//     },
//     {
//         id: 19,
//         question: "Which letter completes the sequence? A, C, F, J, O, ...",
//         options: ["T", "U", "S", "R"],
//         answer: "U", // +2, +3, +4, +5, +6 (O is 15th, 15+6=21=U) - Wait: A(1)+2=C(3)+3=F(6)+4=J(10)+5=O(15)+6=U(21)
//     },
//     {
//         id: 20,
//         question: "Mary's father has five daughters: 1. Nana, 2. Nene, 3. Nini, 4. Nono. What is the name of the fifth daughter?",
//         options: ["Nunu", "Nina", "Mary", "None of the above"],
//         answer: "Mary",
//     }
// ];

// export default iqQuestions;

// iqQuestions.js

import iq9Image from "../assets/IQ_9.png";
import iq10Image from "../assets/IQ_10.png";
import iq13Image from "../assets/IQ_13.png";
import iq23Image from "../assets/IQ_23.png";
import iq24Image from "../assets/IQ_24.PNG";
import iq25Image from "../assets/IQ_25.png";
import iq27Image from "../assets/IQ_27.png";

const iqQuestions = [
    // ===== VERBAL REASONING =====
    {
        id: 1,
        question: "Which word is a synonym for 'Innate'?",
        options: ["Acquired", "Congenital", "External", "Incidental"],
        answer: "Congenital",
    },
    {
       
    id: 2,
    question: "Which word does not belong in the group based on meaning?",
    options: ["Benevolent", "Altruistic", "Compassionate", "Parsimonious"],
    answer: "Parsimonious",

    },
   {
    id: 3,
    question: "Key is to Lock as Password is to ___",
    options: ["Computer", "Security", "Login", "Access"],
    answer: "Access",
},
    {
        id: 4,
        question: "Light is to Glare as Sound is to ___",
        options: ["Music", "Noise", "Voice", "Silence"],
        answer: "Noise",
    },
    {
        id: 5,
        question: "Which word is most similar to 'Meticulous'?",
        options: ["Sloppy", "Fastidious", "Hasty", "Generic"],
        answer: "Fastidious",
    },
{
    id: 6,
    question: "All pens are instruments. Some instruments are expensive. Which conclusion follows?",
    options: [
        "All pens are expensive",
        "Some pens may be expensive",
        "No pens are expensive",
        "None can be determined"
    ],
    answer: "Some pens may be expensive",
},
     // ===== NUMERICAL REASONING =====
{
    id: 7,
    question: "If the average of five consecutive even numbers is 28, what is the largest number?",
    options: ["30", "32", "34", "36"],
    answer: "32",
},
   
{
    id: 8,
    question: "Which number does not belong in the series: 3, 5, 11, 21, 43, 85?",
    options: ["11", "21", "43", "85"],
    answer: "85",
},
{
    id: 9,
    question: "What will be the value of the next term if the pattern continues: 2, 10, 30, 68, 130?",
    options: ["190", "210", "222", "224"],
    answer: "222",
},
{
    id: 10,
    question: "Identify the pattern and choose the next term: 4, 6, 9, 13, 18, 24, ?",
    options: ["30", "31", "32", "33"],
    answer: "31",
},
{
    id: 11,
    question: "If x² + 5x + 6 = 0, what are the possible values of x?",
    options: ["-2 or -3", "2 or 3", "-1 or -6", "1 or 6"],
    answer: "-2 or -3",
},
{
    id: 12,
    question: "What pattern best describes the sequence: 1, 4, 10, 22, 46?",
    options: ["Multiply by 2 and add 2", "Multiply by 2 and add increasing numbers", "Add squares", "Double and subtract 2"],
    answer: "Multiply by 2 and add 2",
},

{
    id: 13,
    question: "What is the sum of all multiples of 3 between 1 and 50?",
    options: ["375", "408", "420", "435"],
    answer: "408",

},
{
    id: 14,
    question: "If 3 → 27, 4 → 64, 5 → 125, then which rule is followed?",
    options: ["Square", "Cube", "Multiply by 9", "Add 24"],
    answer: "Cube",
},
{
    id: 15,
    question: "In the sequence 8, 24, 12, 36, 18, 54, what operation is repeated?",
    options: ["×3, ÷2 alternately", "+16, -12 alternately", "×2, ÷3 alternately", "+10, -6 alternately"],
    answer: "×3, ÷2 alternately",
},
{
    id: 16,
    question: "If the ratio of two numbers is 2:3 and their sum is 25, what is the larger number?",
    options: ["10", "12", "15", "18"],
    answer: "15",
},

  // ===== LOGICAL REASONING (STANDARD + DIFFICULT) =====
{
    id: 17,
    question: "Statements: All roses are flowers. Some flowers fade quickly. Which conclusion logically follows?",
    options: [
        "All roses fade quickly",
        "Some roses may fade quickly",
        "No roses fade quickly",
        "None of the above"
    ],
    answer: "Some roses may fade quickly",
},
{
    id: 18,
    question: "If in a certain code, 'PAPER' is written as 'QBQFS', how is 'TABLE' written?",
    options: ["UBCMF", "UBBLE", "TBCMF", "UABMF"],
    answer: "UBCMF",
},
{
    id: 19,
    question: "If P is left of Q but right of R, and S is right of Q, who is in the middle?",
    options: ["P", "Q", "R", "S"],
    answer: "P",
},
{
    id: 20,
    question: "If 6 + 4 = 210 and 5 + 3 = 28, then 7 + 2 = ?",
    options: ["45", "63", "72", "81"],
    answer: "63",
},
{
    id: 21,
    question: "Six people are sitting in a row. A is between B and C. D is at one end, and E is next to D. Who is in the middle?",
    options: ["A", "B", "C", "Cannot be determined"],
    answer: "Cannot be determined",
},

    // ===== SPATIAL / VISUAL =====
    {
        id: 22,
        question: "A clock shows 3:15. Rotated 90° clockwise, what does it show?",
        options: ["6:00", "6:15", "9:15", "12:15"],
        answer: "6:15",
    },
    {
        id: 23,
        question: "Complete the pattern",
        image: iq23Image,
        options: ["1", "2", "3", "4"],
        answer: "4",
    },
    {
        id: 24,
        question: "Complete the pattern",
        image: iq24Image,
        options: ["1", "2", "3", "4"],
        answer: "4",
    },
    {
        id: 25,
        question: "How many triangles are in this figure?",
        image: iq25Image,
        options: ["4", "6", "8", "10"],
        answer: "10",
    },
    {
        id: 26,
        question: "How many small cubes form a 3×3×3 cube?",
        image: iq27Image,
        options: ["18", "27", "36", "30"],
        answer: "27",
    },

    // ===== MIXED / APPLICATION =====
    {
        id: 27,
        question: "A cube painted on all sides is cut into 27 cubes. How many have exactly one face painted?",
        options: ["6", "8", "12", "18"],
        answer: "6",
    },
    {
        id: 28,
        question: "Mary is 16 and 4 times as old as her brother. When will she be twice his age?",
        options: ["20", "24", "28", "32"],
        answer: "24",
    },
    {
        id: 29,
        question: "If you have 30 coins, give away 2/3 and get 5 more, how many left?",
        options: ["10", "15", "20", "25"],
        answer: "15",
    },
    {
        id: 30,
        question: "Complete the series: Triangle → Square → Pentagon → ?",
        options: ["Hexagon", "Circle", "Rectangle", "Octagon"],
        answer: "Hexagon",
    },
];

export default iqQuestions;