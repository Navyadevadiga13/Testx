import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
  FiSave,
  FiMaximize
} from "react-icons/fi";
import getApiBaseUrl from "../utils/api";

// --- READING DATA ---
const IELTS_DATA_READING = {
  title: "Academic Reading Test 1",
  passages: [
    {
      id: "p1",
      title: "Passage 1: The Innovation of Grocery Stores",
      text: `(A) At the beginning of the 20th century, grocery stores in the United States were full-service. A customer would ask a clerk behind the counter for specific items and the clerk would package the items, which were limited to dry goods. If they want to save some time, they have to ask a delivery boy or by themselves to send the note of what they want to buy to the grocery story first and then go to pay for the goods later. These grocery stores usually carried only one brand of each good. There were early chain stores, such as the A&P Stores, but these were all entirely full-service and very time-consuming.

(B) In 1885, a Virginia boy named Clarence Saunders began working part-time as a clerk in a grocery store when he was 14 years old, and quit school when the shopkeeper offered him full time work with room and board. Later he worked in an Alabama coke plant and in a Tennessee sawmill before he returned to the grocery business. By 1900, when he was nineteen years old, he was earning $30 a month as a salesman for a wholesale grocer. During his years working in the grocery stores, he found that it was very inconvenient and inefficient for people to buy things because more than a century ago, long before there were computers, shopping was done quite differently than it is today. Entering a store, the customer would approach the counter (or wait for a clerk to become available) and place an order, either verbally or, as was often the case for boys running errands, in the form of a note or list. While the customer waited, the clerk would move behind the counter and throughout the store, select the items on the list--some form shelves so high that long-handled grasping device had to be used--and bring them back to the counter to be tallied and bagged or boxed. The process might be expedited by the customer calling or sending in the order beforehand, or by the order being handled by a delivery boy on a bike, but otherwise it did not vary greatly. Saunders, a flamboyant and innovative man, noticed that this method resulted in wasted time and expense, so he came up with an unheard-of solution that would revolutionize the entire grocery industry: he developed a way for shoppers to serve themselves.

(C) So in 1902 he moved to Memphis where he developed his concept to form a grocery wholesale cooperative and a full-service grocery store. For his new "cafeteria grocery", Saunders divided his grocery into three distinct areas: 1) A front "lobby" forming an entrance and exit and checkouts at the front. 2) A sales department, which was specially designed to allow customers to roam the aisles and select their own groceries. Removing unnecessary clerks, creating elaborate aisle displays, and rearranging the store to force customers to view all of the merchandise and over the shelving and cabinets units of sales department were "galleries" where supervisors were allowed to keep an eye on the customers while not disturbing them. 3) And another section of his store is the room only allowed for the clerks which was called the "stockroom" or "storage room" where large refrigerators were situated to keep fresh products from being perishable. The new format allowed multiple customers to shop at the same time, and led to the previously unknown phenomenon of impulse shopping. Though this format of grocery market was drastically different from its competitors, the style became the standard for the modern grocery store and later supermarket.

(D) On September 6, 1916, Saunders launched the self-service revolution in the USA by opening the first self-service Piggly Wiggly store, at 79 Jefferson Street in Memphis, Tennessee, with its characteristic turnstile at the entrance. Customers paid cash and selected their own goods from the shelves. It was unlike any other grocery store of that time. Inside a Piggly Wiggly, shoppers were not at the mercy of shop clerks. They were free to roam the store, check out the merchandise and get what they needed with their own two hands and feet. Prices on items at Piggly Wiggly were clearly marked. No one pressured customers to buy milk or pickles. And the biggest benefit at the Piggly Wiggly was that shoppers saved money. Self-service was a positive all around. "It's good for both the consumer and retailer because it cuts costs," noted George T. Haley, a professor at the University of New Haven and director of the Center for International Industry Competitiveness. "If you looked at the way grocery stores were run previous to Piggly Wiggly and Alpha Beta, what you find is that there was a tremendous amount of labor involved, and labor is a major expense." Piggly Wiggly cut the fat.

(E) Piggly Wiggly and the self-service concept took off. Saunders opened nine stores in the Memphis area within the first year of business. Consumers embraced the efficiency, the simplicity and most of all the lower food prices. Saunders soon patented his self-service concept, and began franchising Piggly Wiggly stores. Thanks to the benefits of self-service and franchising, Piggly Wiggly ballooned to nearly 1,300 stores by 1923. Piggly Wiggly sold $100 million — worth $1.3 billion today — in groceries, making it the third-biggest grocery retailer in the nation. The company's stock was even listed on the New York Stock Exchange, doubling from late 1922 to March 1923. Saunders had his hands all over Piggly Wiggly. He was instrumental in the design and layout of his stores. He even invented the turnstile.

(F) However Saunders was forced into bankruptcy in 1923 after a dramatic spat with the New York Stock Exchange and he went on to create the "Clarence Saunders sole-owner-of-my-name" chain, which went into bankruptcy.

(G) Until the time of his death in October 1953, Saunders was developing plans for another automatic store system called the Foodelectric. But the store, which was to be located two blocks from the first Piggly Wiggly store, never opened. But his name was well-remembered along with the name Piggly Wiggly.`,
      questions: [
        {
          id: "q1_5",
          instruction: "Questions 1-5: The reading Passage has seven paragraphs A-G. Which paragraph contains the following information?",
          type: "matching_paragraph",
          options: ["A", "B", "C", "D", "E", "F", "G"],
          items: [
            { id: 1, text: ") How Clarence Saunders' new idea had been carried out.", answer: "C" },
            { id: 2, text: ") Introducing the modes and patterns of groceries before his age.", answer: "A" },
            { id: 3, text: ") Clarence Saunders declared bankruptcy a few years later.", answer: "F" },
            { id: 4, text: ") Descriptions of Clarence Saunders' new conception.", answer: "C" },
            { id: 5, text: ") The booming development of his business.", answer: "E" }
          ]
        },
        {
          id: "q6_10",
          instruction: "Questions 6-10: Answer the questions below. Write ONLY ONE WORD OR A NUMBER.",
          type: "fill_blank",
          items: [
            { id: 6, text: ") When Clarence Saunders was an adolescent, he took a job as a ______ in a grocery store.", answer: "clerk" },
            { id: 7, text: ") In the new innovation of grocery store, most of the clerks' work before was done by ______.", answer: "shoppers" },
            { id: 8, text: ") In Saunders' new grocery store, the section where customers finish the payment was called ______.", answer: "lobby" },
            { id: 9, text: ") Another area in his store which behind the public area was called the ______ where only internal staff could access.", answer: "stockroom" },
            { id: 10, text: ") At ______ where customers were under surveillance.", answer: "galleries" }
          ]
        },
        {
          id: "q11_13",
          instruction: "Questions 11-13: Choose the correct letter, A, B, C or D.",
          type: "mcq",
          items: [
            {
              id: 11,
              text: ") Why did Clarence Saunders want to propel the innovation of grocery stores at his age?",
              options: ["A. Because he was an enthusiastic and creative man.", "B. Because his boss wanted to reform the grocery industry.", "C. Because he wanted to develop its efficiency and make great profit.", "D. Because he worried about competition."],
              answer: "C"
            },
            {
              id: 12,
              text: ") What happened to Clarence Saunders' first store of Piggly Wiggly?",
              options: ["A. Customers complained.", "B. It enjoyed a great business.", "C. It expanded to more than a thousand stores.", "D. Saunders was required to patent it."],
              answer: "B"
            },
            {
              id: 13,
              text: ") What was left to Clarence Saunders after his death in 1953?",
              options: ["A. A fully automatic store system.", "B. The name Piggly Wiggly was very popular.", "C. His name was connected with Piggly Wiggly.", "D. His name was painted with the store name."],
              answer: "C"
            }
          ]
        }
      ]
    },
    {
      id: "p2",
      title: "Passage 2: Mapping",
      text: `(A) Today, the mapmaker's vision is no longer confined to what the human eye can see. The perspective of mapmaking has shifted from the crow's nest of the sailing vessel, mountain top and airplane to 'new orbital heights. Radar, which bounces microwave radio signals off a given surface to create images of its contours and textures, can penetrate jungle foliage and has produced the first maps of the mountains of the planet Venus. And a combination of sonar and radar produces charts of the seafloor, putting much of Earth on the map for the first time. 'Suddenly it's a whole different world for us,' says Joel Morrison, chief of geography at the U.S. Bureau of the Census, 'Our future as mapmakers - even ten years from now - is uncertain.'

(B) The world's largest collection of maps resides in the basement of the Library of Congress in Washington, D.C. The collection, consisting of up to 4.6 million map sheets and 63,000 atlases, includes magnificent bound collections of elaborate maps - the pride of the golden age of Dutch cartography. In the reading room scholars, wearing thin cotton gloves to protect the fragile sheets, examine ancient maps with magnifying glasses. Across the room people sit at their computer screens, studying the latest maps. With their prodigious memories, computers are able to store data about people, places and environments - the stuff of maps - and almost instantly information is displayed on the screen in the desired geographic context, and at the click of a button, a print-out of the map appears.

(C) Measuring the spherical Earth ranks as the first major milestone in scientific cartography. This was first achieved by the Greek astronomer Eratosthenes, a scholar at the famous Alexandrian Library in Egypt in the third century BC. He calculated the Earth's circumference as 25,200 miles, which was remarkably accurate. The longitudinal circumference is known today to be 24,860 miles.

(D) Building on the ideas of his predecessors, the astronomer and geographer Ptolemy, working in the second century AD, spelled out a system for organising maps according to grids of latitude and longitude. Today, parallels of latitude are often spaced at intervals of 10 to 20 degrees and meridians at 15 degrees, and this is the basis for the width of modern time zones. Another legacy of ptolemy's is his advice to cartographers to create maps to scale. Distance on today's maps is expressed as a fraction or ratio of the real distance. But mapmakers in Ptolemy's time lacked the geographic knowledge to live up to ptolemy's scientific principles. Even now, when surveyors achieve accuracies down to inches and satellites can plot potential missile targets within feet, maps are not true pictures of reality.

(E) However, just as the compass improved navigation and created demand for useful charts, so the invention of the printing press in the 15th century put maps in the hands of more people, and took their production away from monks, who had tended to illustrate theology rather than geography. Ocean-going ships launched an age of discovery, enlarging both what could and needed to be mapped, and awakened an intellectual spirit and desire for knowledge of the world.

(F) Inspired by the rediscovered Ptolemy, whose writing had been preserved by Arabs after the sacking of the Alexandrian Library in AD 931, mapmakers in the 15th century gradually replaced theology with knowledge of faraway places, as reported by travelling merchants like Marco Polo.

(G) Gerhardus Mercator, the foremost shipmaker of the 16th century, developed a technique of arranging meridians and parallels in such a way that navigators could draw straight lines between two points and steer a constant compass course between them. This distortion formula, introduced on his world map of 1569, created the 'Greenland problem'. Even on some standard maps to this day, Greenland looks as large as South America - one of the many problems when one tries to portray a round world on a flat sheet of paper. But the Mercator projection was so practical that it is still popular with sailors.

(H) Scientific mapping of the land came into its own with the achievements of the Cassini family - father, son, grandson and great-grandson. In the late 17th century, the Italian-born founder, Jean-Dominique, invented a complex method of determining longitude based on observations of Jupiter's moons. Using this technique, surveyors were able to produce an accurate map of France. The family continued to map the French countryside and his greatgrandson finally published their famous Cassini map in 1793 during the French Revolution. While it may have lacked the artistic appeal of earlier maps, it was the model of a social and geographic map showing roads, rivers, canals, towns, abbeys, vineyards, lakes and even windmills. With this achievement, France became the first country to be completely mapped by scientific methods.`,
      questions: [
        {
          id: "q14_18",
          instruction: "Questions 14-18: Choose the correct letter A, B, C or D.",
          type: "mcq",
          items: [
            { id: 14, text: ") According to the first paragraph, mapmakers in the 21st century...", options: ["A. combine techniques to chart unknown territory.", "B. still rely on being able to see what they map.", "C. are now able to visit the darkest jungle.", "D. need input from experts in other fields."], answer: "A" },
            { id: 15, text: ") The Library of Congress offers an opportunity to...", options: ["A. borrow from their collection.", "B. learn how to restore maps.", "C. enjoy the atmosphere of the reading room.", "D. create computer maps."], answer: "D" },
            { id: 16, text: ") Ptolemy alerted his contemporaries to the importance of...", options: ["A. measuring the circumference.", "B. organising maps.", "C. working out distance.", "D. accuracy and precision."], answer: "B" },
            { id: 17, text: ") The invention of the printing press...", options: ["A. revitalised interest.", "B. enabled maps to be cheaper.", "C. changed the approach to mapmaking.", "D. ensured Ptolemy's work continued."], answer: "C" },
            { id: 18, text: ") The writer concludes by stating that...", options: ["A. mapmaking is too specialised.", "B. conditions are harsh.", "C. aims remain unchanged.", "D. possibilities are infinite."], answer: "C" }
          ]
        },
        {
          id: "q19_21",
          instruction: "Questions 19-21: Match each achievement with the correct mapmaker.",
          type: "matching_select",
          legend: ["A. Mercator", "B. Ptolemy", "C. Cassini family", "D. Eratosthenes"],
          options: ["A", "B", "C", "D"],
          items: [
            { id: 19, text: ") Came very close to accurately measuring the distance round the Earth.", answer: "D" },
            { id: 20, text: ") Produced maps showing man-made landmarks.", answer: "C" },
            { id: 21, text: ") Laid the foundation for our modern time zones.", answer: "B" }
          ]
        },
        {
          id: "q22_26",
          instruction: "Questions 22-26: Complete the summary (NO MORE THAN TWO WORDS).",
          type: "fill_blank",
          items: [
            { id: 22, text: ") The first great step in mapmaking took place in ______ in the 3rd century BC.", answer: "Egypt" },
            { id: 23, text: ") Maps were the responsibility of ______ rather than scientists.", answer: "monks" },
            { id: 24, text: ") The writings of ______ had been kept.", answer: "Ptolemy" },
            { id: 25, text: ") These days, ______ are vital to the creation of maps.", answer: "satellites" },
            { id: 26, text: ") Cheaper versions have been developed for use in ______.", answer: "cars" }
          ]
        }
      ]
    },
    {
      id: "p3",
      title: "Passage 3: Communication in Science",
      text: `(A) Science plays an increasingly significant role in people's lives, making the faithful communication of scientific developments more important than ever. Yet such communication is fraught with challenges that can easily distort discussions, leading to unnecessary confusion and misunderstandings.

(B) Some problems stem from the esoteric nature of current research and the associated difficulty of finding sufficiently faithful terminology. Abstraction and complexity are not signs that a given scientific direction is wrong... But many of the biggest challenges for science reporting arise because in areas of evolving research, scientists themselves often only partly understand the full implications of any particular advance or development.

(C) Ambiguous word choices are the source of some misunderstandings. Scientists often employ colloquial terminology, which they then assign a specific meaning that is impossible to fathom without proper training. The term "relativity," for example, is intrinsically misleading. Many interpret the theory to mean that everything is relative and there are no absolutes. Yet although the theory does show that observations makes depend on his coordinates... Einstein's theory of relativity is really about finding an invariant description of physical phenomena.

(D) "The uncertainty principle" is another frequently abused term. It is sometimes interpreted as a limitation on observers and their ability to make measurements. But it is not about intrinsic limitations on any one particular measurement; it is about the inability to precisely measure particular pairs of quantities simultaneously? The first interpretation is perhaps more engaging from a philosophical or political perspective. It's just not what the science is about.

(F) Even the word "theory" can be a problem. Unlike most people, who use the word to describe a passing conjecture that they often regard as suspect, physicists have very specific ideas in mind when they talk about theories... Theories aren't necessarily shown to be correct or complete immediately...

(G) "Global warming" is another example of problematic terminology... The name sometimes subverts the debate, since it lets people argue that last winter was worse, so how could there be global warming? Clearly "global climate change" would have been a better name...

(H) A better understanding of the mathematical significance of results and less reliance on a simple story would help to clarify many scientific discussions. For several months, Harvard was tortured by empty debates over the relative intrinsic scientific abilities of men and women. One of the more amusing aspects... was that those who believed in the differences and those who didn't used the same evidence about gender-specific special ability. How could that be? The answer is that the data shows no substantial effects. Social factors might account for these tiny differences...

(I) This doesn't mean never questioning an interpretation... Second, we might need different standards for evaluating science with urgent policy implications than research with purely theoretical value...

(J) But most important, people have to recognize that science can be complex. If we accept only simple stories, the description will necessarily be distorted...`,
      questions: [
        {
          id: "q27_31",
          instruction: "Questions 27-31: Choose the correct letter A, B, C or D.",
          type: "mcq",
          items: [
            { id: 27, text: ") Why is faithful science communication important?", options: ["A. Science plays significant role.", "B. Science is fraught with challenges.", "C. Complexity leads to confusion.", "D. Inventions are important."], answer: "A" },
            { id: 28, text: ") What is the reason for challenges in science reporting?", options: ["A. Phenomena are too complex.", "B. Scientists only partly understand evolution.", "C. Scientists don't comprehend meanings.", "D. Scientists partly understand implications."], answer: "D" },
            { id: 29, text: ") The term 'theory of relativity' is used to demonstrate...", options: ["A. invariant physical phenomenon.", "B. common people misleading by word choice.", "C. designed to be misleading.", "D. everything is relative."], answer: "B" },
            { id: 30, text: ") Which is a good example of appropriate word choice?", options: ["A. Uncertainty principle", "B. Global warming", "C. Ozone layer", "D. Freon"], answer: "C" },
            { id: 31, text: ") Surprising finding of Harvard debates?", options: ["A. Equal abilities.", "B. Proof applied was no big difference.", "C. Data shows no substantial figures.", "D. Social factors connection."], answer: "C" }
          ]
        },
        {
          id: "q32_35",
          instruction: "Questions 32-35: True, False, or Not Given.",
          type: "mcq",
          items: [
            { id: 32, text: ") 'Global warming' scientifically refers to greater fluctuations in temperature and rainfall rather than universal rise.", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: "TRUE" },
            { id: 33, text: ") More media coverage of 'global warming' would help public to recognize the phenomenon.", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: "NOT GIVEN" },
            { id: 34, text: ") Harvard debates should focus more on female scientist and male scientists.", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: "NOT GIVEN" },
            { id: 35, text: ") Public understanding of indirect scientific evidence would lead to confusion.", options: ["TRUE", "FALSE", "NOT GIVEN"], answer: "FALSE" }
          ]
        },
        {
          id: "q36_40",
          instruction: "Questions 36-40: Complete the summary (NO MORE THAN TWO WORDS).",
          type: "fill_blank",
          items: [
            { id: 36, text: ") Ambiguous ______ are the source of some misunderstandings.", answer: "word choices" },
            { id: 37, text: ") Common people do not understand meaning via the ______ scientists employed.", answer: "colloquial terminology" },
            { id: 38, text: ") Measurements any ______ makes cannot be confined...", answer: "observer" },
            { id: 39, text: ") Describe in a constant ______.", answer: "invariant description" },
            { id: 40, text: ") A good example can be the theory of ______.", answer: "general relativity" }
          ]
        }
      ]
    }
  ]
};

// Flatten all items per passage for the nav panel
function getFlatItems(passage) {
  const items = [];
  passage.questions.forEach(group => {
    group.items.forEach(item => items.push({ ...item, groupType: group.type, groupOptions: group.options, groupLegend: group.legend, groupInstruction: group.instruction, groupItems: group.items }));
  });
  return items;
}

// Get passage question range label e.g. "1–13"
function getPassageRange(passage) {
  const allIds = passage.questions.flatMap(g => g.items.map(i => i.id));
  return `${Math.min(...allIds)}–${Math.max(...allIds)}`;
}

export default function IeltsReading() {
  const navigate = useNavigate();
  const [activePassage, setActivePassage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // active question id for scroll-to focus
  const [focusedQId, setFocusedQId] = useState(null);
  const questionRefs = useRef({});

  const API_URL = getApiBaseUrl();

  const currentPassage = IELTS_DATA_READING.passages[activePassage];
  const flatItems = getFlatItems(currentPassage);
useEffect(() => {
  const header = document.querySelector(".header");

  if (header) {
    header.style.display = "none";
  }

  return () => {
    if (header) {
      header.style.display = "flex";
    }
  };
}, []);
  // Set first question as focused when passage changes
  useEffect(() => {
    if (flatItems.length > 0) {
      setFocusedQId(flatItems[0].id);
    }
  }, [activePassage]);

  // Scroll to focused question
  useEffect(() => {
    if (focusedQId !== null && questionRefs.current[focusedQId]) {
      questionRefs.current[focusedQId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedQId]);

  const handleInput = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const saveTestResult = async (finalScore, totalQuestions, fullBreakdown) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/tests/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "IELTS Reading",
          result: {
            score: finalScore,
            total: totalQuestions,
            percentage: Math.round((finalScore / totalQuestions) * 100),
            breakdown: fullBreakdown
          }
        })
      });
      const data = await response.json();
      console.log("IELTS Reading saved:", data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const calculateScore = () => {
    let newScore = 0;
    let totalQuestions = 0;
    const breakdown = {};
    IELTS_DATA_READING.passages.forEach(p => {
      p.questions.forEach(group => {
        group.items.forEach(item => {
          totalQuestions++;
          const userAns = (answers[item.id] || "").trim().toLowerCase();
          const correctAns = (item.answer || "").trim().toLowerCase();
          let isCorrect = false;
          if (group.type === "fill_blank" || group.type === "matching_paragraph") {
            if (correctAns.includes("/")) {
              const possibleAnswers = correctAns.split("/");
              if (possibleAnswers.some(ans => userAns === ans.trim())) isCorrect = true;
            } else {
              if (userAns === correctAns) isCorrect = true;
            }
          } else {
            if (userAns.charAt(0) === correctAns.charAt(0)) isCorrect = true;
          }
          if (isCorrect) newScore++;
          breakdown[item.id] = { user: answers[item.id], correct: item.answer, isCorrect };
        });
      });
    });
    setScore(newScore);
    setShowResult(true);
    window.scrollTo(0, 0);
    saveTestResult(newScore, totalQuestions, breakdown);
  };

  // Check if a question is answered
  const isAnswered = (id) => answers[id] !== undefined && answers[id] !== "";

  // Get result for a question
  const getResult = (item, groupType) => {
    if (!showResult) return null;
    const userAns = (answers[item.id] || "").trim().toLowerCase();
    const correctAns = (item.answer || "").trim().toLowerCase();
    if (groupType === "mcq") return userAns.charAt(0) === correctAns.charAt(0);
    return userAns === correctAns;
  };
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  } else {
    await document.exitFullscreen();
    setIsFullscreen(false);
  }
};
  return (
    <div className="ielts-container">
  <style jsx>{`
    * {
      box-sizing: border-box;
    }

  .ielts-container {
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  padding: 10px;
}

    /* HEADER */
    // .page-header {
    //   max-width: 1500px;
    //   margin: 0 auto 1rem;
    //   width: 100%;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   border-bottom: 1px solid #d1fae5;
    //   padding-bottom: 0.75rem;
    //   flex-shrink: 0;
    // }

    /* INSTRUCTIONS BANNER */
    .instructions-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      max-width: 1500px;
      margin: 0 auto 1rem;
      width: 100%;
      flex-shrink: 0;
    }

    .instructions-title {
      color: #15803d;
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 0.6rem;
    }

    .instructions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .instruction-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      color: #166534;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .instruction-item .bullet {
      color: #16a34a;
      flex-shrink: 0;
    }

    .instructions-right {
      background: #dcfce7;
      border-left: 3px solid #16a34a;
      padding: 0.75rem 1rem;
      border-radius: 0 8px 8px 0;
      font-size: 0.85rem;
      color: #166534;
    }

    .warning-title {
      font-weight: 700;
      color: #15803d;
      margin-bottom: 0.3rem;
      font-size: 0.85rem;
    }

    /* MAIN SPLIT */
   .split-layout {
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  height: calc(100vh - 20px); /* IMPORTANT */
  overflow: hidden;           /* IMPORTANT */
}

    /* PASSAGE PANEL */
   .passage-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

    .panel-header {
      background: #f0fdf4;
      border-bottom: 1px solid #d1fae5;
      padding: 0.85rem 1.25rem;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-title {
      color: #15803d;
      font-weight: 700;
      font-size: 1rem;
    }

    .badge {
      font-size: 0.7rem;
      color: #15803d;
      background: #dcfce7;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .passage-text {
      flex: 1;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 1.25rem 1.5rem;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 0.97rem;
      line-height: 1.85;
      color: #14532d;
      text-align: justify;
      white-space: pre-line;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: #16a34a #dcfce7;
    }

    .passage-nav {
      background: #f0fdf4;
      border-top: 1px solid #d1fae5;
      padding: 0.65rem 1.25rem;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    /* QUESTIONS PANEL */
   .questions-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

    .questions-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
      scroll-behavior: smooth;
    }

    /* QUESTION NAV DOCK */
    .q-nav-dock {
      background: #f0fdf4;
      border-top: 1px solid #d1fae5;
      padding: 0.6rem 1rem;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .q-nav-parts {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .q-nav-part-label {
      font-size: 0.7rem;
      color: #15803d;
      font-weight: 700;
      white-space: nowrap;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .q-nav-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      flex: 1;
    }

    .q-nav-btn {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: 1px solid #bbf7d0;
      background: #ffffff;
      color: #15803d;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      flex-shrink: 0;
    }

    .q-nav-btn:hover {
      background: #dcfce7;
    }

    .q-nav-btn.answered {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }

    .q-nav-btn.focused {
      background: #16a34a;
      border-color: #16a34a;
      color: white;
      box-shadow: 0 0 8px rgba(22, 163, 74, 0.3);
    }

    .q-nav-btn.correct-result {
      background: #bbf7d0;
      border-color: #16a34a;
      color: #166534;
    }

    .q-nav-btn.wrong-result {
      background: #fee2e2;
      border-color: #ef4444;
      color: #ef4444;
    }

    .q-nav-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .q-nav-legend {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      font-size: 0.7rem;
      color: #166534;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      display: inline-block;
      margin-right: 3px;
    }

    /* QUESTION ITEMS */
    .question-group {
      margin-bottom: 2rem;
    }

    .group-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  border-bottom: 1px solid #d1fae5;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

    .group-type-tag {
      background: #dcfce7;
      color: #15803d;
      padding: 2px 10px;
      border-radius: 5px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      flex-shrink: 0;
    }
.group-instruction {
  font-size: 1rem;
  font-weight: 600;
  color: #14532d;
  line-height: 1.6;
  text-align: left;
  font-family: inherit;

  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;

  padding: 12px 16px;
  width: 100%;
}
    .legend-box {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: #f0fdf4;
      border-radius: 10px;
      border: 1px solid #d1fae5;
      font-size: 0.82rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
    }

    .question-card {
      background: #ffffff;
      border: 1px solid #d1fae5;
      border-radius: 12px;
      padding: 1rem 1.1rem;
      margin-bottom: 0.75rem;
      transition: all 0.2s;
      scroll-margin-top: 20px;
    }

    .question-card.focused-card {
      border-color: #16a34a;
      background: #f0fdf4;
      box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.15);
    }

    .question-card:hover {
      background: #f9fffb;
    }

    .q-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
      gap: 0.75rem;
    }

    .q-left {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .q-num {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      background: #dcfce7;
      color: #15803d;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .q-text {
      color: #14532d;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    /* INPUTS */
    .input-wrap {
      padding-left: 2rem;
    }

    .text-input {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      color: #14532d;
      border-radius: 8px;
      padding: 0.65rem 0.9rem;
      width: 100%;
      outline: none;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }

    .text-input:focus {
      border-color: #16a34a;
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
    }

    .text-input::placeholder {
      color: #6b7280;
    }

    .letter-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 0.5rem;
    }

    .letter-btn {
      min-width: 36px;
      height: 36px;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid #bbf7d0;
      background: #ffffff;
      color: #15803d;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .letter-btn:hover {
      background: #dcfce7;
    }

    .letter-btn.sel {
      background: #16a34a;
      color: white;
      border-color: #16a34a;
    }

    .radio-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    .radio-opt {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.55rem 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s;
      font-size: 0.87rem;
    }

    .radio-opt:hover {
      background: #f0fdf4;
    }

    .radio-opt.sel {
      background: #dcfce7;
      border-color: #16a34a;
    }

    .radio-circle {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .radio-circle.sel {
      border-color: #16a34a;
    }

    .radio-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #16a34a;
    }

    .radio-opt-text {
      color: #14532d;
    }

    .radio-opt.sel .radio-opt-text {
      color: #166534;
      font-weight: 600;
    }

    .wrong-hint {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #dc2626;
      background: #fee2e2;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    /* BUTTONS */
    .btn-primary {
      background: #16a34a;
      color: white;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.15s, box-shadow 0.15s;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
    }

    .btn-ghost {
      background: #ffffff;
      color: #15803d;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-ghost:hover:not(:disabled) {
      background: #dcfce7;
    }

    .btn-ghost:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    /* RESULT MODAL */
    .result-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(6px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .result-modal {
      background: white;
      border: 1px solid #bbf7d0;
      border-radius: 20px;
      padding: 2.5rem 3rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      min-width: 300px;
    }

    /* SCROLLBARS */
    .passage-text::-webkit-scrollbar {
      width: 10px;
    }

    .passage-text::-webkit-scrollbar-track {
      background: #dcfce7;
      border-radius: 10px;
    }

    .passage-text::-webkit-scrollbar-thumb {
      background: #16a34a;
      border-radius: 10px;
    }

    .questions-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .questions-scroll::-webkit-scrollbar-track {
      background: #dcfce7;
      border-radius: 4px;
    }

    .questions-scroll::-webkit-scrollbar-thumb {
      background: #16a34a;
      border-radius: 4px;
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .split-layout {
        grid-template-columns: 1fr;
        height: auto;
        overflow: visible;
      }

     .ielts-container {
  min-height: 100vh;
  background: #ffffff;
  padding: 10px;
  padding-top: 10px;
}

      .passage-text {
        max-height: 55vh;
      }

      .questions-scroll {
        max-height: 70vh;
      }
    }

   @media (max-width: 768px) {
  .ielts-container {
    padding: 10px;
  }
}
      .instructions-grid {
        grid-template-columns: 1fr;
      }

      .q-nav-btn {
        width: 26px;
        height: 26px;
        font-size: 0.65rem;
      }
    }
  `}</style>
      {/* RESULT OVERLAY */}
      {showResult && (
        <div className="result-overlay">
          <div className="result-modal">
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>Test Complete!</h2>
            <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "#19fd91", lineHeight: 1.1 }}>
              {score} <span style={{ fontSize: "1.4rem", color: "#888" }}>/ 40</span>
            </div>
            <p style={{ color: "#888", marginTop: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Your performance has been saved
            </p>
        <button
  className="btn-primary"
  style={{ margin: "0 auto" }}
  onClick={() => navigate("/profile")}
>
  Review Answers
</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="page-header">
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#666", cursor: "pointer" }} onClick={() => navigate("/tests/ielts")}>IELTS Mock Test</span>
          <span style={{ color: "#444" }}>/</span>
          <span style={{ color: "#19fd91" }}>Reading</span>
        </h1>
      </div>

      {/* INSTRUCTIONS
      <div className="instructions-banner">
        <div className="instructions-title">Reading Test Instructions</div>
        <div className="instructions-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div className="instruction-item"><span className="bullet">•</span><span>40 questions across three passages. Answer all questions from the passage text only.</span></div>
            <div className="instruction-item"><span className="bullet">•</span><span>Use the number panel at the bottom to jump to any question quickly.</span></div>
          </div>
          <div className="instructions-right">
            <div className="warning-title">Important:</div>
            <div>Answer all questions based only on the information given in the passages.</div>
          </div>
        </div>
      </div> */}

      {/* SPLIT LAYOUT */}
      <div className="split-layout">

        {/* LEFT: PASSAGE */}
        <div className="passage-panel">
          <div className="panel-header">
            <span className="panel-title">{currentPassage.title}</span>
            <span className="badge">Questions {getPassageRange(currentPassage)}</span>
          </div>
          <div className="passage-text">
            {currentPassage.text}
          </div>
          <div className="passage-nav">
            <button
              className="btn-ghost"
              onClick={() => setActivePassage(p => Math.max(0, p - 1))}
              disabled={activePassage === 0}
            >
              <FiArrowLeft /> Previous
            </button>
            {IELTS_DATA_READING.passages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePassage(idx)}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid",
                  borderColor: activePassage === idx ? "#19fd91" : "rgba(255,255,255,0.1)",
                  background: activePassage === idx ? "rgba(25,253,145,0.15)" : "transparent",
                  color: activePassage === idx ? "#19fd91" : "#666",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer"
                }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="btn-ghost"
              onClick={() => setActivePassage(p => Math.min(IELTS_DATA_READING.passages.length - 1, p + 1))}
              disabled={activePassage === IELTS_DATA_READING.passages.length - 1}
            >
              Next <FiArrowRight />
            </button>
          </div>
        </div>

        {/* RIGHT: QUESTIONS */}
        <div className="questions-panel">
 <div className="panel-header">
  <span className="panel-title">Questions</span>

  <button
    className="btn-ghost"
    onClick={toggleFullscreen}
  >
    <FiMaximize />
    Full Screen
  </button>
            {!showResult && (
              <span className="badge">
                {flatItems.filter(i => isAnswered(i.id)).length}/{flatItems.length} answered
              </span>
            )}
          </div>

          <div className="questions-scroll">
            {currentPassage.questions.map((group, gIdx) => (
              <div key={gIdx} className="question-group">
                <div className="group-header">
                  <span className="group-type-tag">{group.type.replace(/_/g, " ")}</span>
                  <span className="group-instruction">{group.instruction}</span>
                </div>

                {group.legend && (
                  <div className="legend-box">
                    {group.legend.map((l, i) => <span key={i} style={{ color: "#aaa" }}>{l}</span>)}
                  </div>
                )}

                {group.items.map(item => {
                  const isFocused = focusedQId === item.id;
                  const result = getResult(item, group.type);
                  return (
                    <div
                      key={item.id}
                      ref={el => questionRefs.current[item.id] = el}
                      className={`question-card${isFocused ? " focused-card" : ""}`}
                      onClick={() => setFocusedQId(item.id)}
                    >
                      <div className="q-top">
                        <div className="q-left">
                          <span className="q-num">{item.id}</span>
                          <span className="q-text">{item.text}</span>
                        </div>
                        {showResult && (
                          result
                            ? <FiCheckCircle style={{ color: "#10b981", flexShrink: 0 }} />
                            : <FiXCircle style={{ color: "#ef4444", flexShrink: 0 }} />
                        )}
                      </div>

                      <div className="input-wrap">
                        {(group.type === "matching_paragraph" || group.type === "matching_select") && (
                          <div className="letter-btns">
                            {(group.options || ["A","B","C","D","E","F","G"]).map(opt => (
                              <button
                                key={opt}
                                disabled={showResult}
                                onClick={e => { e.stopPropagation(); handleInput(item.id, opt); }}
                                className={`letter-btn${answers[item.id] === opt ? " sel" : ""}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {group.type === "fill_blank" && (
                          <input
                            className="text-input"
                            type="text"
                            value={answers[item.id] || ""}
                            onChange={e => handleInput(item.id, e.target.value)}
                            disabled={showResult}
                            placeholder="Type your answer..."
                            onClick={e => e.stopPropagation()}
                          />
                        )}

                        {group.type === "mcq" && (
                          <div className="radio-options">
                            {item.options.map(opt => {
                              const letter = opt.charAt(0);
                              const val = (opt === "TRUE" || opt === "FALSE" || opt === "NOT GIVEN") ? opt : letter;
                              const selected = answers[item.id] === val;
                              return (
                                <div
                                  key={opt}
                                  className={`radio-opt${selected ? " sel" : ""}`}
                                  onClick={e => { e.stopPropagation(); if (!showResult) handleInput(item.id, val); }}
                                >
                                  <div className={`radio-circle${selected ? " sel" : ""}`}>
                                    {selected && <div className="radio-dot" />}
                                  </div>
                                  <span className="radio-opt-text">{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {showResult && !result && (
                          <div className="wrong-hint">
                            Correct: <strong style={{ color: "white" }}>{item.answer}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* QUESTION NAV DOCK */}
          <div className="q-nav-dock">
            <div className="q-nav-parts">
              <span className="q-nav-part-label">
                Part {activePassage + 1} ({getPassageRange(currentPassage)})
              </span>
              <div className="q-nav-buttons">
                {flatItems.map(item => {
                  const answered = isAnswered(item.id);
                  const focused = focusedQId === item.id;
                  let cls = "q-nav-btn";
                  if (showResult) {
                    const res = getResult(item, item.groupType);
                    cls += res ? " correct-result" : " wrong-result";
                  } else if (focused) {
                    cls += " focused";
                  } else if (answered) {
                    cls += " answered";
                  }
                  return (
                    <button
                      key={item.id}
                      className={cls}
                      onClick={() => setFocusedQId(item.id)}
                      title={`Question ${item.id}`}
                    >
                      {item.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="q-nav-footer">
              <div className="q-nav-legend">
                {!showResult ? (
                  <>
                    <span><span className="legend-dot" style={{ background: "#19fd91" }}></span>Current</span>
                    <span><span className="legend-dot" style={{ background: "rgba(25,253,145,0.3)" }}></span>Answered</span>
                    <span><span className="legend-dot" style={{ background: "rgba(255,255,255,0.08)" }}></span>Unanswered</span>
                  </>
                ) : (
                  <>
                    <span><span className="legend-dot" style={{ background: "#10b981" }}></span>Correct</span>
                    <span><span className="legend-dot" style={{ background: "#ef4444" }}></span>Wrong</span>
                  </>
                )}
              </div>

              {!showResult && (
                activePassage === IELTS_DATA_READING.passages.length - 1 ? (
                  <button className="btn-primary" onClick={calculateScore}>
                    Submit Test <FiSave />
                  </button>
                ) : (
                  <button className="btn-ghost" onClick={() => setActivePassage(p => p + 1)}>
                    Next Passage <FiArrowRight />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}