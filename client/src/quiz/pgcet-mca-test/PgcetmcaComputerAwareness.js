const pgcetmcaComputerAwareness = [
  {
    id: 31,
    question: `Which of the following statement(s) is/are correct?
      (i) Cache memory is an extremely fast and small memory between CPU and main memory.
      (ii) Registers are faster than cache memory.`,
    options: ["A. Only (i) is correct", "B. Both (i) and (ii) are correct", "C. Only (ii) is correct", "D. Both are incorrect"],
    answer: "B"
  },
  {
    id: 32,
    question: "Arrange the given list of memories in decreasing order of speed.",
    options: ["A. Primary memory", "B. Cache, Registers, Secondary memory, Primary memory", "C. Registers, Cache, Primary memory, Secondary memory, Cache, Registers, Secondary memory", "D. Secondary memory, Primary memory, Cache, Registers"],
    answer: "C"
  },
  {
    id: 33,
    question: "Which of the following are examples of high-level programming languages?",
    options: ["A. Only (b) is correct — Assembly", "B. Only (a) and (c) are correct — Python, Java", "C. Only (d) is correct — Machine code", "D. All of the above"],
    answer: "B"
  },
  {
    id: 34,
    question: `Match the following with respect to CPU registers.
      List-I (Registers): (a) AC  (b) PC  (c) SP  (d) IR
      List-II (Usage): (i) Points to top of the stack  (ii) Holds intermediate arithmetic results  (iii) Holds the instruction currently being decoded  (iv) Holds address of the next instruction`,
    options: ["A. a-iii, b-i, c-ii, d-iv", "B. a-iv, b-ii, c-iii, d-i", "C. a-i, b-ii, c-iv, d-iii", "D. a-ii, b-iv, c-i, d-iii"],
    answer: "D"
  },
  {
    id: 35,
    question: "Arrange the following operators as per their priority (highest first): (a) *,/  (b) &&  (c) +,-  (d) ==,!=",
    options: ["A. (a), (c), (d), (b)", "B. (b), (a), (c), (d)", "C. (d), (c), (b), (a)", "D. (a), (b), (c), (d)"],
    answer: "A"
  },
  {
    id: 36,
    question: "The ________ data model represents data as a tree-like structure with parent-child relationships.",
    options: ["A. Hierarchical Data Model", "B. Relational Data Model", "C. Network Data Model", "D. Object Data Model"],
    answer: "A"
  },
  {
    id: 37,
    question: "________ language is used to insert, update, delete and retrieve data from a database.",
    options: ["A. Transaction Control Language (TCL)", "B. Data Definition Language (DDL)", "C. Data Control Language (DCL)", "D. Data Manipulation Language (DML)"],
    answer: "D"
  },
  {
    id: 38,
    question: "The control unit of a computer goes through an instruction cycle divided into which phases?",
    options: ["A. Only (a) is correct", "B. (a), (b) and (c) are correct", "C. Only (a) and (b) are correct", "D. (a), (b), (c) and (d) are correct"],
    answer: "B"
  },
  {
    id: 39,
    question: "Full form of LAMP is _______ with respect to web applications.",
    options: ["A. Local, Apache, Mainstream, Program", "B. Linux, Adobe, MySQL and Python", "C. Linux, Apache, MySQL and PHP", "D. Linux, Apache, Mainframe and Perl"],
    answer: "C"
  },
  {
    id: 40,
    question: `Which of the following are valid octal numbers?
      (i) 1707  (ii) 8842  (iii) 6520  (iv) 3921`,
    options: ["A. (i), (iii) and (iv)", "B. (i), (ii) and (iv)", "C. (ii) and (iv)", "D. (i) and (iii)"],
    answer: "D"
  },
  {
    id: 41,
    question: "The decimal number 37₁₀ is represented in binary as _________",
    options: ["A. 101101 ", "B. 100110", "C.100101 ", "D. 110101"],
    answer: "C"
  },
  {
    id: 42,
    question: "1's and 2's complement of -18₍₁₀₎ in binary (8-bit) are ______ and ________.",
    options: ["A. 00010010, 00010011", "B. 11101101, 11101110", "C. 11101110, 11101101", "D. 00010011, 00010010"],
    answer: "B"
  },
  {
    id: 43,
    question: `Match the Characters in List-I with their correct ASCII property in List-II.
      List-I: (a) 'Z'  (b) 'z'  (c) '9'  (d) '#'
      List-II: (i) ASCII 90 (Decimal)  (ii) ASCII 122 (Decimal)  (iii) ASCII 57 (Decimal)  (iv) ASCII 35 (Decimal)`,
    options: ["A. a-i, b-ii, c-iii, d-iv", "B. a-ii, b-i, c-iv, d-iii", "C. a-iii, b-iv, c-i, d-ii", "D. a-iv, b-iii, c-ii, d-i"],
    answer: "A"
  },
  {
    id: 44,
    question: `A floating point number typically consists of
      (i) Sign bit  (ii) Mantissa  (iii) Exponent  (iv) Checksum`,
    options: ["A. (i), (iii) and (iv)", "B. (i), (ii) and (iv)", "C. (ii), (iii) and (iv)", "D. (i), (ii) and (iii)"],
    answer: "D"
  },
  {
    id: 45,
    question: `Arrange the steps to find one's complement of a binary number.
      (i) Write the binary number  (ii) Invert every bit (0 to 1 and 1 to 0)  (iii) Obtain the final result`,
    options: ["A. (i) → (iii) → (ii)", "B. (ii) → (i) → (iii)", "C. (iii) → (i) → (ii)", "D. (i) → (ii) → (iii)"],
    answer: "D"
  },
  {
    id: 46,
    question: "The result of 110₂ × 11₂ is _______.",
    options: ["A. 10010₂", "B. 10001₂", "C. 11000₂", "D. 10100₂"],
    answer: "A"
  },
  {
    id: 47,
    question: "Which scheduling algorithm always selects the process with the smallest expected burst time?",
    options: ["A. Round Robin", "B. Shortest Job First (SJF)", "C. FCFS", "D. Priority Scheduling"],
    answer: "B"
  },
  {
    id: 48,
    question: `Which of the following are the characteristics of Batch Operating Systems?
      (i) No user interaction during execution  (ii) Immediate response required  (iii) Jobs are grouped and processed together  (iv) Used mainly for real-time applications`,
    options: ["A. (ii) and (iv) only", "B. (i) and (iii) only", "C. (i), (ii) and (iii) only", "D. (i), (iii) and (iv) only"],
    answer: "B"
  },
  {
    id: 49,
    question: `Arrange the steps of a process's state transition in correct order.
      (i) Ready  (ii) New  (iii) Terminated  (iv) Running`,
    options: ["A. (ii) → (i) → (iv) → (iii)", "B. (i) → (ii) → (iii) → (iv)", "C. (iv) → (i) → (ii) → (iii)", "D. (ii) → (iv) → (i) → (iii)"],
    answer: "A"
  },
  {
    id: 50,
    question: `Match the operating systems in List-I with their correct characteristics in List-II.
      List-I: (a) Batch OS  (b) Real Time OS  (c) Time Sharing OS  (d) Network OS
      List-II: (i) Multiuser share CPU with quick response  (ii) No user interaction  (iii) Immediate deterministic response required  (iv) Manages resources across connected computers`,
    options: ["A. a-iv, b-ii, c-i, d-iii", "B. a-i, b-ii, c-iii, d-iv", "C. a-iii, b-i, c-ii, d-iv", "D. a-ii, b-iii, c-i, d-iv"],
    answer: "D"
  },
  {
    id: 51,
    question: "Bank clerks who process customer transactions through a fixed set of screens are categorised into ________ with respect to database applications.",
    options: ["A. Sophisticated end users", "B. Casual end users", "C. Parametric end users", "D. Standalone users"],
    answer: "C"
  },
  {
    id: 52,
    question: "What is the meaning of 32 × 8 organization with respect to a memory chip?",
    options: ["A. 32 words of 8 bits each", "B. 8 words of 32 bits each", "C. 32 bits × 8 bits", "D. 32 words of 8 bytes each"],
    answer: "A"
  },
  {
    id: 53,
    question: `Consider the following instruction:
      MOV R1, R2
      What does the above instruction mean?`,
    options: ["A. Add R1 and R2, store in R1", "B. Copy the contents of R1 into R2", "C. Copy the contents of R2 into R1", "D. Move data from memory to R1 and R2"],
    answer: "C"
  },
  {
    id: 54,
    question: `Which among the following about a router is correct?
      (i) A router forwards data packets between computer networks.
      (ii) A router operates only within a single local network and cannot connect different networks`,
    options: ["A. Both (i) and (ii) are incorrect", "B. Only (ii) is correct", "C. Both (i) and (ii) are correct", "D. Only (i) is correct"],
    answer: "D"
  },
  {
    id: 55,
    question: "Which of the following best describes an IP address?",
    options: ["A. Only (i) is correct", "B. A password used to log into a computer", "C. The physical location of a server", "D. A type of virus that spreads through networks"],
    answer: "A"
  }

];
 
export default pgcetmcaComputerAwareness;