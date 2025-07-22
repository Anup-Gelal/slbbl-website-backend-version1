import {
    cattle,
    scholarship,
    esewapayment,
    digitalpartnerkhalti,
    membersecurityfund,
    mobilefinance,
    remittance,
    cfs,
    ds,dcws,
    fcs,ms,ops,os,ps,sbfs,scs,
    ael,bgl,chl,fel,gl,ah,
    cp,rp1,rpg2,rpg3,rp2,rpg1,idd,
    agm,ao1,ao2,cdh,ceo,hgsd,hhrm,hit,hodaf,hrd,htd,o1,o2,o3,o4,
    staff,branch,
    s11,s12,vac1,arbindkumargupta,jeevanmanandar,purshottamkoirala,nabindawadi,agm208201,agm208202,agm208203,agm208204,
    tirtharajneupane
} from "../assets";

import { financialReportPdf,annualReportPdf,principalIndicators, staffTrainingReport,sebonDisclosure} from "@/financialreports";
import { closedNotice } from "@/notices";
import { g1,g2,g3,g4,g5 } from "@/Gallaries";

export const navLinks=[
    {
        id:"about",
        title:"About",
        subLinks:[
           {id:"bods",title:"Board Of Directors",path:"/board-of-directors"},
            {id: "management",title:"Management Team", path:"/management-team"},
          
        ],
    },
    {
        id:"products",
        title:"Products",
    },
    {
        id:"services",
        title:"Services",
    },
    {
        id:"rates",
        title:"Rates",
        subLinks:[
            {id:"base rates",title:"Base Rates",path:"/base-rates"},
            {id:"saving account interest rates",title:"Saving Account Interest Rates",path:"/saving-account-interest-rates"},
            {id:"Loan Interest rates",title:"Loan Interest Rates",path:"/loan-interest-rates"},
        ],
    },
    {
        id: "financials",
        title:"Financials",
        subLinks:[
          {id:"quarterly reports",title:"Quarterly Reports",path:"/quarterly-reports"},
          {id:"annual reports", title:"Annual Reports",path:"/annual-reports"},
          {id:"principal indicators",title:"Principal Indicators",path:"/principal-indicators"},
          {id:"sebon disclosures",title:"SEBON Disclosures",path:"/sebon-disclosures"},
          {id:"staff training reports",title:"Staff Training Reports",path:"/staff-training-reports"},
        ],
    },
    {
        id:"media",
        title:"Media",
        subLinks:[
          {id:"notices",title:"Notices",path:"/notices"},
          {id:"gallery",title:"Gallery",path:"/gallery"},
          {id:"successstories",title:"Success Stories",path:"/success-stories"},
        ],
    },
    {
        id:"branches",
        title:"Branches",
        subLinks:[
            {id:"koshi",title:"Koshi",path:"/koshi"},
            {id:"madhesh",title:"Madhesh",path:"/madhesh"},
            {id:"bagmati",title:"Bagmati",path:"/bagmati"},
            {id:"gandaki",title:"Gandaki",path:"/gandaki"},
            {id:"lumbini",title:"Lumbini",path:"/lumbini"},
            {id:"karnali",title:"Karnali",path:"/karnali"},
            {id:"sudurpashchim",title:"Sudurpashchim",path:"/sudurpashchim"},
        ]
    },
];

export const topLinks=[
    {
        id:"gunaso",
        title:"Gunaso",
    },
    {
        id:"officehours",
        title:"Office Hours",
    },
    {
        id:"careers",
        title:"Careers",
    },
    {
        id:"stockwatch",
        title:"Stock Watch",
    },
    {
        id:"contactus",
        title:"CONTACT US",
    },
    {
        id:"ciblogin",
        title:"CIB LOGIN",
    },
    {
      id:"login",
      title:"ADMIN LOGIN",
    }
]

export const services=[
    {
        title: "Scholarship",
        icon:scholarship,
    },
    {
        title:"Cattle Security Fund",
        icon:cattle,
    },
    {
        title:"Remittance",
        icon:remittance,
    },
    {
        title:"Member Security Fund",
        icon:membersecurityfund,
    },
    {
        title:"E-sewa Payment",
        icon:esewapayment,
    },
    {
        title:"Mobile Finance Technology",
        icon:mobilefinance,
    },
    {
        title:"Digital Partner-Khalti",
        icon:digitalpartnerkhalti,
    },

]

export const products =[
    {
        title:"Centre Fund Saving",
        icon:cfs,
        description: "A savings plan designed to help you grow your emergency fund over time.",
    },
    {
        title:"Disaster Saving",
        icon:ds,
        description: "A special savings account for emergency preparedness in case of natural disasters."
    },
    {
        title:"Discipline Center Welfare Saving",
        icon:dcws,
        description: "A savings plan for individuals committed to financial discipline and wellness.",
    },
    {
        title:"Festival Child Saving",
        icon:fcs,
        description: "A savings account designed to help parents save for their children's future during festivals.",
    },
   
    {
        title:"Monthly Saving",
        icon:ms,
        description: "A monthly contribution-based savings plan to meet long-term financial goals.",
    },
    {
        title:"Optional Personal Saving",
        icon:ops,
        description: "A flexible savings account with no fixed terms, allowing personal access.",
    },
    {
        title:"Optional Saving",
        icon:os,
        description: "A simple savings plan that offers flexibility in withdrawals.",
    },
    {
        title:"Pewa Saving",
        icon:ps,
        description: "A saving account designed specifically for pension and welfare needs.",
    },
    {
        title:"Swarojgar Bright Future Saving",
        icon:sbfs,
        description: "A savings scheme focused on promoting entrepreneurship and bright futures.",
    },
    {
        title:"Swarojgar Child Saving",
        icon:scs,
        description: "A savings plan to secure the future of your child through investments and growth.",
    },
    {
        title:"Alternative Energy Loan",
        icon: ael,
        description:"The main purpose of this loan is to improve the health of the client and reduce regular expenses. SLBBL will provide loans to install a biogas plant and solar energy systems up to NRs. 60,000. This loan is available to clients who have successfully completed the first loan cycle. The tenure of this loan is between 12 to 18 months with an interest rate of 15% on a diminishing balance basis.",
        
    },
    {
        title:"Business Growth Loan",
        icon: bgl,
        description:"The Business Growth Loan is provided to clients who have completed their first loan cycle with a good credit track record. The main purpose of this loan is to upgrade the client’s existing business. The loan ceiling is up to NRs. 700,000. The duration of this loan will be between 12 to 60 months, depending on the client’s income cycle. The interest rate is 15% on a declining balance basis.",
    },
    {
        title:"Center Home Loan",
        icon: chl,
        description:"The Center Home Loan offers financial support to individuals looking to purchase, construct, or renovate their homes. With flexible repayment options, it aims to make home ownership more accessible and affordable.",
    },
    {
        title:"Foreign Employment Loan",
        icon: fel,
        description:"The Foreign Employment Loan is designed to help individuals pursuing job opportunities abroad with the necessary financial backing. It covers expenses like travel, documentation, and training, making international employment more attainable.",
    },
    {
        title:"General Loan",
        icon: gl,
        description:"This loan is disbursed for all types of productive purposes. All members are eligible for this loan. The loan ceiling is Nrs. 1,000 to 300,000. The repayment period for this loan is between 12 to 36 months, and the interest rate is 15% on a declining balance basis.",
    },


]

 
 const calculateAverage = (ratesArray) => {
    const total = ratesArray.reduce((acc, rate) => acc + rate, 0);
    return (total / ratesArray.length).toFixed(2);
  };
  

  

export const baserates = [
    { month: 'Magh 2081', rate: 12.70 },
    { month: 'Kartik 2081', rate: 12.73 },
    { month: 'Poush 2081', rate: 11.62 },
    { month: 'Mangshir 2081', rate: 13.03 },
    { month: 'Average Base Rate from Kartik 2081 to Poush 2081', rate: calculateAverage([12.73, 11.62, 12.70]) },
    { month: 'Kartik 2081', rate: 12.73 },
    { month: 'Average Base Rate from Sharwan 2081 to Ashwin 2081', rate: calculateAverage([13.61, 13.55, 13.40]) },
    { month: 'Ashwin 2081', rate: 13.55 },
    { month: 'Sharwan 2081', rate: 13.87 },
    { month: 'Bhadra 2081', rate: 13.40 },
    { month: 'Average for F.Y. 2080.081', rate: 14.64 },
    { month: 'Average Base Rate from Baishak 2081 to Ashad 2081', rate: calculateAverage([13.83, 13.26, 11.93]) },
    { month: 'Ashad 2081', rate: 11.93 },
    { month: 'Baishak 2081', rate: 13.83 },
    { month: 'Jestha 2081', rate: 14.02 },
    { month: 'Chaitra 2080', rate: 14.22 },
    { month: 'Magh 2080', rate: 14.05 },
    { month: 'Average Base Rate from Kartik 2080 to Poush 2080', rate: calculateAverage([15.14, 15.55, 15.51]) },
    { month: 'Poush 2080', rate: 15.55 },
    { month: 'Mangshir 2080', rate: 15.83 },
    { month: 'Kartik 2080', rate: 15.14 },
    { month: 'Average Base Rate from Sharwan 2080 to Ashwin 2080', rate: calculateAverage([15.74, 14.32, 17.20]) },
    { month: 'Sharwan 2080', rate: 15.71 },
    { month: 'Bhadra 2080', rate: 17.20 },
    { month: 'Ashwin 2080', rate: 14.32 },
    { month: 'Average for F.Y. 2079.080', rate: 15.08 },
    { month: 'Average Base Rate from Baishak 2080 to Ashad 2080', rate: calculateAverage([15.14, 14.85, 15.04]) },
    { month: 'Jestha 2080', rate: 15.53 },
    { month: 'Baishak 2080', rate: 14.85 },
    { month: 'Magh 2079', rate: 15.70 },
    { month: 'Chaitra 2079', rate: 15.19 },
    { month: 'Falgun 2079', rate: 16.18 },
    { month: 'Magh 2079', rate: 15.70 },
    { month: 'Average Base Rate from Kartik 2079 to Poush 2079', rate: calculateAverage([14.65, 15.66, 14.25]) },
    { month: 'Poush 2079', rate: 15.66 },
    { month: 'Mansir 2079', rate: 14.05 },
    { month: 'Kartik 2079', rate: 14.25 },
  ];

export const savingAccountInterestRates = [
    { id: 1, name: "CENTRE FUND SAVING", minSaving: 5, interestRate: "7.5%", remarks: "" },
    { id: 2, name: "MONTHLY SAVING", minSaving: 200, interestRate: "7.5%", remarks: "" },
    { id: 3, name: "OPTIONAL SAVING", minSaving: 100, interestRate: "7.5%", remarks: "" },
    { id: 4, name: "DISASTER SAVING", minSaving: null, interestRate: "7.5%", remarks: "" },
    { id: 5, name: "SWAROJGAR BRIGHT FUTURE SAVING", minSaving: null, interestRate: "9 Years - 1.5, 14 Years - 2 Times", remarks: "New Account Is Not Allowed To Open. Previously Opened Account Runs Continuously." },
    { id: 6, name: "OPTIONAL PERSONAL SAVING", minSaving: null, interestRate: null, remarks: "New Account Is Not Allowed To Open. Previously Opened Account Runs Continuously." },
    { id: 7, name: "SWAROJGAR CHILD SAVING", minSaving: 200, interestRate: "7.5%", remarks: "" },
    { id: 8, name: "SWAROJGAR SAMAYOJAN SAVING", minSaving: null, interestRate: "7.5%", remarks: "" },
    { id: 9, name: "DISCIPLINE CENTER WELFARE SAVING", minSaving: null, interestRate: null, remarks: "" },
    { id: 10, name: "FESTIVAL CHILD SAVING", minSaving: null, interestRate: "7.5%", remarks: "" },
    { id: 11, name: "PEWA SAVING", minSaving: 100, interestRate: "7.5%", remarks: "" },
    { id: 12, name: "SWAROJGAR SUNAULO BACHAT YOJANA", minSaving: 500, interestRate: "9%", remarks: "" },
  ];

  export const loanProductsInterestRates = [
    { id: 1, product: "GENERAL LOAN / BUSINESS LOAN", rate: "15%", serviceCharge: "1% For 30,000 and 1.5% for Above 30,000", remarks: "" },
    { id: 2, product: "BUSINESS GROWTH LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 3, product: "CENTER HOME LOAN", rate: "10%", serviceCharge: "", remarks: "" },
    { id: 4, product: "ALTERNATIVE ENERGY LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 5, product: "DISASTER LOAN", rate: "14%", serviceCharge: "1%", remarks: "" },
    { id: 6, product: "EMERGENCY LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 7, product: "MICRO ENTERPRISE LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 8, product: "FOREIGN EMPLOYMENT LOAN", rate: "15%", serviceCharge: "1%", remarks: "" },
    { id: 9, product: "SWAROJGAR LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 10, product: "COVID-19 EASY LOAN", rate: "15%", serviceCharge: "1.5%", remarks: "" },
    { id: 11, product: "Business Loan", rate: "15%", serviceCharge: "1.5%", remarks: "" }
  ];
  
  
export const bods=[
    {
        title:"Mr. Gyanendra Prasad Pande",
        icon:cp,
        iconBg:"E6DEDD",
        desc:"CHAIRPERSON, Representative from PROMOTER Share Holders",
    },
    {
        title:"Mr. Uday Raj Khatiwada",
        icon:rp1,
        iconBg:"E6DEDD",
        desc:"Representative from PROMOTER Share Holders",
    },
    {
        title:"Mr. Tri Bikram Pandey",
        icon:rp2,
        iconBg:"E6DEDD",
        desc:"Representative from PROMOTER Share Holders",
    },
    {
        title:"Mr.Krishna Banjade",
        icon:rpg1,
        iconBg:"E6DEDD",
        desc:"Representative from General Share Holders",
    },
    {
        title:"Mr.Samar Dhakal",
        icon:rpg2,
        iconBg:"E6DEDD",
        desc:"Representative from General Share Holders",
    },
    {
        title:"Mr.Tej Datta Khakural",
        icon:rpg3,
        iconBg:"E6DEDD",
        desc:"Representative from General Share Holders",
    },
    {
        title:"Hira Devi Bist",
        icon:idd,
        iconBg:"E6DEDD",
        desc:"Independent Director",
    },

]

export const managements=[
    {
        title:"Manoj Krishna Uprety",
        icon:ceo,
        iconBg:"E6DEDD",
        desc:"Chief Executive Officer",

    },
    {
        title:"Rajendra Prasad Neupane",
        icon:agm,
        iconBg:"E6DEDD",
        desc:"Assistant General Manager",
    },
    {
        title:"Gopal Raj Bista",
        icon:ah,
        iconBg:"E6DEDD",
        desc:"Administration Head",
    },
    {
        title:"Madhu Sudan Adhikari",
        icon:cdh,
        iconBg:"E6DEDD",
        desc:"Credit Department Head",
    },
    {
        title:"Madhu Sudan Pant",
        icon:hrd,
        iconBg:"E6DEDD",
        desc:"Head of Risk Management Department",
    },
    {
        title:"Saroj Poudel",
        icon:hgsd,
        iconBg:"E6DEDD",
        desc:"Head of General Services Department",
    },
    {
        title:"Niroj Prasad Poudel",
        icon:hodaf,
        iconBg:"E6DEDD",
        desc:"HOD-Accounts & Finance",
    },
    {
        title:"Shree Ram Rokka",
        icon:hhrm,
        iconBg:"E6DEDD",
        desc:"Head of Human Resources Department",
    },
    {
        title:"Bijaya Narayan Thakur",
        icon:htd,
        iconBg:"E6DEDD",
        desc:"Head of Training Department",
    },
     {
        title:"Arbind Kumar Gupta",
        icon:arbindkumargupta,
        iconBg:"E6DEDD",
        desc:"Head of Planning Department",
    },
    {
        title:"Krishna Prasad Duwadi",
        icon:hit,
        iconBg:"E6DEDD",
        desc:"Head of Information and Technology Department",
    },
    {
        title:"Ram Prakash Shah",
        icon:o1,
        iconBg:"E6DEDD",
        desc:"Programme Department-Officer",
    },
    {
        title:"Samundra Prasad Barakoti",
        icon:o2,
        iconBg:"E6DEDD",
        desc:"Programme Department-Officer",
    },
    {
        title:"Raju Thakuri",
        icon:o4,
        iconBg:"E6DEDD",
        desc:"Programme Department-Officer",
    },
    {
        title:"Bhimsen KC",
        icon:ao1,
        iconBg:"E6DEDD",
        desc:"Programme Department- Assistant Officer",
    },
    {
        title:"Sailesh Dhakal",
        icon:ao2,
        iconBg:"E6DEDD",
        desc:"Programme Department- Assistant Officer",
    },
     {
        title:"Nabin Duwadi",
        icon:nabindawadi,
        iconBg:"E6DEDD",
        desc:"Programme Department- Assistant Officer",
    },
     {
        title:"Jeevan Manandhar",
        icon:jeevanmanandar,
        iconBg:"E6DEDD",
        desc:"Programme Department- Assistant Officer",
    },
     {
        title:"Purushottam Koirala",
        icon:purshottamkoirala,
        iconBg:"E6DEDD",
        desc:"Programme Department- Supervisor",
    },
]

export const messages = [
    {
      description: "Namaste, Fifteen years ago in 8th Shrawan 2066 (23rd July 2009), Swarojgar Laghubitta Bittiya Sanstha Ltd was born to serve the low-income women through self-employment generation activities, with the Grameen Bank Model. The organization has been serving through various types of credit with credit plus activities like Deposit Mobilization, Insurance Product Offering, Remittance service Offering, Skill Development Trainings, Business Knowledge Development Trainings, and Business Counseling....",
      image: ceo,
    }
  ];
  
  export const koshiBranches = [
    {
      id: 1,
      name: "Branch Office Netachowk",
      address: "GRAMTHAM-7, MORANG, NETACHOWK",
      manager: "Binod Acharya",
      contact: "9802334230",
      email: "netachowk@slbbl.com.np",
    },
    {
      id: 2,
      name: "Branch Office Mangalbare",
      address: "KAMAL-6, JHAPA, MANGALBARE",
      manager: "Tej Narayan Shrestha",
      contact: "9802334231",
      email: "mangalbare@slbbl.com.np",
    },
    {
      id: 3,
      name: "Branch Office Shivaganj",
      address: "Shivasatakshi 5, Jhapa",
      manager: "Niraj Chaudhary",
      contact: "9802334235",
      email: "shivaganj@slbbl.com.np",
    },
    {
      id: 4,
      name: "Branch Office Rajgadh",
      address: "Barhadashi Rural Municipality -3, Jhapa",
      manager: "Ramesh Bastola",
      contact: "9802334236",
      email: "rajgadh@slbbl.com.np",
    },
    {
      id: 5,
      name: "Branch Office Sombare",
      address: "Pathari Shanishchare Municipality 8, Morang",
      manager: "Raj Kumar Kattel",
      contact: "9802334237",
      email: "sombare@slbbl.com.np",
    },
    {
      id: 6,
      name: "Branch Office Tankisinwari",
      address: "Budhiganga 2, Morang",
      manager: "Satya Narayan Mehata",
      contact: "9801977259",
      email: "tankisinbari@slbbl.com.np",
    },
    {
      id: 7,
      name: "Branch Office Sundhar Haraicha",
      address: "Sundhar Haraicha 4, Morang",
      manager: "Taranath Pokharel",
      contact: "9801977260",
      email: "sundarharaicha@slbbl.com.np",
    },
    {
      id: 8,
      name: "Branch Office Inaruwa",
      address: "Inaruwa 4, Sunsari",
      manager: "Babu Dev Adhikari",
      contact: "9801977261",
      email: "inaruwa@slbbl.com.np",
    },
    {
      id: 9,
      name: "Branch Office Gaighat",
      address: "Triyuga 13, Udayapur",
      manager: "Bishnu Prasad Dhital",
      contact: "9802334223",
      email: "gaighat@slbbl.com.np",
    },
  ];

  export const madheshBranches = [
    {
      id: 1,
      name: "Branch Office Beluwa",
      address: "Birgunj 31, Parsa",
      manager: "Raju Prasad Gupta",
      contact: ["9802334247", "9801977229"],
      email: "belwa@slbbl.com.np",
    },
    {
      id: 2,
      name: "Branch Office Laxminiya Dhanusa",
      address: "Laxminiya 7, Dhanusa",
      manager: "Raju Raut",
      contact: "9801977262",
      email: "laxminiyadhanusa@slbbl.com.np",
    },
    {
      id: 3,
      name: "Branch Office Sabaila",
      address: "Sabaila 8, Dhanusha",
      manager: "Laxmi Narayan Chaudhary",
      contact: "9802334220",
      email: "sabaila@slbbl.com.np",
    },
    {
      id: 4,
      name: "Branch Office Manaharwa",
      address: "Jitpur Simara 18, Bara",
      manager: "Purshotam Koirala",
      contact: "9801977230",
      email: "manaharuwa@slbbl.com.np",
    },
    {
      id: 5,
      name: "Branch Office Bhramapura",
      address: "Loharpatti 7, Mahottari",
      manager: "Nagendra Prasad Chaudhary",
      contact: "9801977263",
      email: "bhramarpura@slbbl.com.np",
    },
    {
      id: 6,
      name: "Branch Office Lagama",
      address: "Kamala 3, Dhanusha",
      manager: "Sanjay Kumar Yadav",
      contact: "9802334221",
      email: "lagama@slbbl.com.np",
    },
    {
      id: 7,
      name: "Branch Office Sakhuawa Dhamaura",
      address: "Brindawan 6, Rautahat",
      manager: "Gyanendra Chaudhary",
      contact: "9801977231",
      email: "sakhuawadhamaura@slbbl.com.np",
    },
    {
      id: 8,
      name: "Branch Office Gausala",
      address: "Gausala 4, Mahottari",
      manager: "Pritam Chaudhary",
      contact: "9801977264",
      email: "gausala@slbbl.com.np",
    },
    {
      id: 9,
      name: "Branch Office Bhaluwahi",
      address: "Siraha 11, Siraha",
      manager: "Rishi Kesh Sing",
      contact: "9802334222",
      email: "bhaluwahi@slbbl.com.np",
    },
    {
      id: 10,
      name: "Branch Office Laxminiya",
      address: "Phatuwa Bijayapur 8, Rautahat",
      manager: "Sarbind Kushwaha",
      contact: ["9801977232", "9802334248"],
      email: "laxminiya@slbbl.com.np",
    },
    {
      id: 11,
      name: "Branch Office Barahathawa",
      address: "Barahathawa 7, Sarlahi",
      manager: "Dev Nandan Kumar Raut",
      contact: "9801977265",
      email: "barahathawa@slbbl.com.np",
    },
    {
      id: 12,
      name: "Branch Office Gadi",
      address: "Paterawa Sugauli 2, Parsa",
      manager: "Ram Babu Shah",
      contact: "9801977233",
      email: "gadi@slbbl.com.np",
    },
    {
      id: 13,
      name: "Branch Office Jaleshowar",
      address: "Jaleshowar 2, Mahottari",
      manager: "Birendra Kumar Mahato",
      contact: "9801977274",
      email: "jaleshowar@slbbl.com.np",
    },
    {
      id: 14,
      name: "Branch Office Chandrapur",
      address: "Chandrapur 5, Rautahat",
      manager: "Tek Prasad Khatiwada",
      contact: "9801977236",
      email: "chandrapur@slbbl.com.np",
    },
    {
      id: 15,
      name: "Branch Office Lahan",
      address: "Lahan 8, Siraha",
      manager: "Ajit Yadav",
      contact: "9801977273",
      email: "lahan@slbbl.com.np",
    },
    {
      id: 16,
      name: "Branch Office Rampurwa",
      address: "Kohlbi 1, Bara",
      manager: "Anil Prasad Chauhan",
      contact: "9801977237",
      email: "rampurwa@slbbl.com.np",
    },
    {
      id: 17,
      name: "Branch Office Phulgama",
      address: "Nagarain 4, Dhanusha",
      manager: "Sanjip Kumar Sah",
      contact: "9802334204",
      email: "phulgama@slbbl.com.np",
    },
    {
      id: 18,
      name: "Branch Office Kalaiya",
      address: "Kalaiya 1, Bara",
      manager: "Lal Babu Mahato",
      contact: "9801977238",
      email: "kalaiya@slbbl.com.np",
    },
    {
      id: 19,
      name: "Branch Office Bateshwor",
      address: "Bateshwor 4, Dhanusha",
      manager: "Param Kumari Sah",
      contact: "9802334205",
      email: "bateshwar@slbbl.com.np",
    },
    {
      id: 20,
      name: "Branch Office Simara",
      address: "Jitpur 2, Bara",
      manager: "Rabindra Kushwaha",
      contact: "9801977239",
      email: "simara@slbbl.com.np",
    },
    {
      id: 21,
      name: "Branch Office Ramgopalpur",
      address: "Ramgopalpur 5, Mahottari",
      manager: "Bikash Kumar Shah",
      contact: "9802334206",
      email: "ramgopalpur@slbbl.com.np",
    },
    {
      id: 22,
      name: "Branch Office Bahuwari",
      address: "Parawanipur 8, Bara",
      manager: "Jay Prakash Thakur Barht",
      contact: "9801977240",
      email: "bahuwari@slbbl.com.np",
    },
    {
      id: 23,
      name: "Branch Office Kathauna",
      address: "Shambhunath 6, Saptari",
      manager: "Tej Narayan Das",
      contact: "9802334207",
      email: "kathauna@slbbl.com.np",
    },
    {
      id: 24,
      name: "Branch Office Lipanimal",
      address: "Parawanipur 1, Bara",
      manager: "Arun Kumar Sha",
      contact: "9801977241",
      email: "lipanimal@slbbl.com.np",
    },
    {
      id: 25,
      name: "Branch Office Janakpurdham",
      address: "Janakpur Dham 4, Dhanusha",
      manager: "Gautam Kumar Kusuwaha",
      contact: "9802334208",
      email: "janakpurdham@slbbl.com.np",
    },
    {
      id: 26,
      name: "Branch Office Amritgunj",
      address: "Simrongrah-7, Bara",
      manager: "Nandan Kumar Gupta",
      contact: "9801977244",
      email: "amritgunj@slbbl.com.np",
    },
    {
      id: 27,
      name: "Branch Office Dhananuji",
      address: "Dhananuji 2, Dhanusha",
      manager: "Chandan Jaiswal",
      contact: "9802334209",
      email: "dhanauji@slbbl.com.np",
    },
    {
      id: 28,
      name: "Branch Office Ganja Bhawanipur",
      address: "Mahagadimai-5, Bara",
      manager: "Jaya Kishor Mahato",
      contact: "9801977245",
      email: "ganjabhawanipur@slbbl.com.np",
    },
    {
      id: 29,
      name: "Branch Office Ekdara",
      address: "Ekdara 1, Mahottari",
      manager: "Mahesh Kumar Shah",
      contact: "9802334211",
      email: "ekdara@slbbl.com.np",
    },
    {
      id: 30,
      name: "Branch Office Sedhawa",
      address: "Jirabhawani 1, Parsa",
      manager: "Upendra Prasad Gupta",
      contact: "9801977246",
      email: "sedhawa@slbbl.com.np",
    },
    {
      id: 31,
      name: "Branch Office Hariwan",
      address: "Hariwan 4, Sarlahi",
      manager: "Prakash Kumar Thakur",
      contact: "9801977247",
      email: "hariwan@slbbl.com.np",
    },
    {
      id: 32,
      name: "Branch Office Gonsari",
      address: "Gonsari 1, Dhanusha",
      manager: "Amit Kumar Chaudhary",
      contact: "9802334212",
      email: "gonsari@slbbl.com.np",
    },
    {
      id: 33,
      name: "Branch Office Dharmapur",
      address: "Dharmapur 3, Parsa",
      manager: "Saroj Kumar Mahato",
      contact: "9801977248",
      email: "dharmapur@slbbl.com.np",
    },
    {
      id: 34,
      name: "Branch Office Dubauliya",
      address: "Dubauliya 1, Bara",
      manager: "Narendra Prasad Ghimire",
      contact: "9802334213",
      email: "dubauliya@slbbl.com.np",
    },
    {
      id: 35,
      name: "Branch Office Sonauli",
      address: "Sonauli 2, Rupandehi",
      manager: "Basant Kumar Yadav",
      contact: "9801977249",
      email: "sonauli@slbbl.com.np",
    }
  ];
  
  export const bagmatiBranches = [
    {
        name: "Branch Office Hetauda",
        address: "Hetauda 4, Makawanapur",
        manager: "Keshav Kadel",
        contact: ["9801977219", "057-526795"],
        email: "hetauda@slbbl.com.np"
    },
    {
        name: "Branch Office Tandi",
        address: "Ratnanagar 2, Chitwan",
        manager: "Om Nath Khatiwada",
        contact: ["9801977220", "056-563317"],
        email: "tandi@slbbl.com.np"
    },
    {
        name: "Branch Office Gitanagar",
        address: "Bharatpur 5, Chitwan",
        manager: "Indira Lamsal",
        contact: ["9801977221", "056-400259"],
        email: "gitanagar@slbbl.com.np"
    },
    {
        name: "Branch Office Panauti",
        address: "Panauti 6, Kavre",
        manager: "Dipu Karki",
        contact: ["9801977222", "011-441290"],
        email: "panauti@slbbl.com.np"
    },
    {
        name: "Branch Office Chanauli",
        address: "Bharatpur 20, Chitwan",
        manager: "Krishna Kanta Adhikari",
        contact: ["9801977223", "056-591948"],
        email: "chanauli@slbbl.com.np"
    },
    {
        name: "Branch Office Parsa",
        address: "Khairahani 8, Chitwan",
        manager: "Asmita Kumari Gautam",
        contact: ["9801977224", "056-583798"],
        email: "parsachitwan@slbbl.com.np"
    },
    {
        name: "Branch Office Kholesimal",
        address: "Kalika 6, Clubchowk, Chitwan",
        manager: "Punya Prasad Pokharel",
        contact: ["9801977225", "056-594003"],
        email: "kholesimal@slbbl.com.np"
    },
    {
        name: "Branch Office Manahari",
        address: "Manahari 7, Makawanpur",
        manager: "Nim Bdr Saru",
        contact: ["9801977226", "057-414082"],
        email: "manahari@slbbl.com.np"
    },
    {
        name: "Branch Office Bidur",
        address: "Bidur 2, Nuwakot",
        manager: "Sunoj Joshi",
        contact: ["9801977252"],
        email: "bidur@slbbl.com.np"
    },
    {
        name: "Branch Office Malekhu",
        address: "Benighat Rorang 3, Dhading",
        manager: "Sahadev Timalsina",
        contact: ["9801977253"],
        email: "malekhu@slbbl.com.np"
    },
    {
        name: "Branch Office Kalamashi",
        address: "Banepa 1, Kavre",
        manager: "Rojina Lama",
        contact: ["9802334216"],
        email: "kalamasi@slbbl.com.np"
    },
    {
        name: "Branch Office Mulkot",
        address: "Sunkoshi-5, Sindhuli, Mulkot",
        manager: "Ram Bahadur Thakuri",
        contact: ["9802334229"],
        email: "mulkot@slbbl.com.np"
    },
    {
        name: "Branch Office Bhotechaur",
        address: "Melamchi-2, Sindhupalchok, Bhotechaur",
        manager: "Utsav Mahat",
        contact: ["9802334227"],
        email: "bhotechaur@slbbl.com.np"
    },
    {
        name: "Branch Office Syuchatar",
        address: "Nagarjun-10, Kathmandu",
        manager: "Bijaya Kumar Devkota",
        contact: ["9802334233"],
        email: "syuchatar@slbbl.com.np"
    },
    {
        name: "Branch Office Banepa",
        address: "Banepa-5, Kavre",
        manager: "N/A",
        contact: ["9801977217", "011-661691"],
        email: "banepa@slbbl.com.np"
    },
    {
        name: "Branch Office Bharatpur",
        address: "Bharatpur 10, Chitwan",
        manager: "Jeevan Manandhar",
        contact: ["9801977218", "056-493989"],
        email: "bharatpur@slbbl.com.np"
    }
];


export const gandakiBranches = [
  {
      name: "Branch Office Narayani",
      address: "Madhyabindu 4, Nawalparasi East",
      manager: "Vidya Regmi",
      contact: ["9801977227", "078-401047"],
      email: "narayani@slbbl.com.np"
  },
  {
      name: "Branch Office Baisjagar",
      address: "Bhanu 9, Tanahu",
      manager: "Mithu Chhetri",
      contact: ["9801977228"],
      email: "baisjagar@slbbl.com.np"
  },
  {
      name: "Branch Office BeniManipur",
      address: "Binayi Triveni 4, Nawalpur",
      manager: "Dayaram Sharma",
      contact: ["9801977234"],
      email: "benimanipur@slbbl.com.np"
  },
  {
      name: "Branch Office Khoplang",
      address: "Palungtar 1, Gorkha",
      manager: "Gokul Regmi",
      contact: ["9801977235"],
      email: "khoplang@slbbl.com.np"
  },
  {
      name: "Branch Office Kawasoti",
      address: "Kawasoti 3, Nawalpur",
      manager: "Kausila Uperty",
      contact: ["9801977242"],
      email: "kawasoti@slbbl.com.np"
  },
  {
      name: "Branch Office Rajahar",
      address: "Debchuli 16, Nawalpur",
      manager: "Rahul Pathak",
      contact: ["9801977248"],
      email: "rajahar@slbbl.com.np"
  },
  {
      name: "Branch Office Beshisahar",
      address: "Besishar 11, Lamjung",
      manager: "Suresh Pantha",
      contact: ["9801977250"],
      email: "beshisahar@slbbl.com.np"
  },
  {
      name: "Branch Office Damauli",
      address: "Byas 1, Tanahu",
      manager: "Lilaraj Ghmire",
      contact: ["9801977251"],
      email: "damauli@slbbl.com.np"
  },
  {
      name: "Branch Office Tribeni",
      address: "Binaya Triveni 6, Nawalpur",
      manager: "Bishal Khadka",
      contact: ["9802334214"],
      email: "tribeni@slbbl.com.np"
  }
];


export const lumbiniBranches = [
    {
      name: "Sandhikharka",
      address: "Sandhikharka 2, Argakhachi",
      manager: "Chandra Dev Khanal",
      contact: "9801977257",
      email: "sandhikharka@slbbl.com.np"
    },
    {
      name: "Gadawa",
      address: "Gadawa 6, Dang",
      manager: "Mukunda Prasad Ghimire",
      contact: "9801977266",
      email: "gadawa@slbbl.com.np"
    },
    {
      name: "Shreepur",
      address: "Kohalpur 5, Banke",
      manager: "Bhuban Prasad Bhatt",
      contact: "9801977267",
      email: "shreepur@slbbl.com.np"
    },
    {
      name: "Mainapokhar",
      address: "Badaiyatal 6, Bardiya",
      manager: "Dan Bahadur Khadka",
      contact: "9801977268",
      email: "mainapokhar@slbbl.com.np"
    },
    {
      name: "Rajapur",
      address: "Rajapur 3, Bardiya",
      manager: "Himal Joshi",
      contact: "9801977269",
      email: "rajapur@slbbl.com.np"
    },
    {
      name: "Tilotama",
      address: "Tilotama 7, Rupandehi",
      manager: "Santosh Aryal",
      contact: "9801977270",
      email: "tilotama@slbbl.com.np"
    },
    {
      name: "Sainamaina",
      address: "Sainamaina 4, Rupandehi",
      manager: "Bhuvan Acharya",
      contact: "9801977271",
      email: "sainamaina@slbbl.com.np"
    },
    {
      name: "Badganga",
      address: "Badganga 3, Kapilbastu",
      manager: "Raju Chaudhary",
      contact: "9801977272",
      email: "badganga@slbbl.com.np"
    },
    {
      name: "Madhuwan",
      address: "Madhuwan 9, Bardiya",
      manager: "Hari Prasad Bhattarai",
      contact: "9802334215",
      email: "madhuwan@slbbl.com.np"
    },
    {
      name: "Barbardiya",
      address: "Barbardiya 8, Bardiya",
      manager: "Pusta Bahadur Pandey",
      contact: "9802334226",
      email: "barbardiya@slbbl.com.np"
    },
    {
      name: "Semari",
      address: "Bardaghat 14, Nawalparasi",
      manager: "Iran Rana Magar",
      contact: "9801977243",
      email: "semari@slbbl.com.np"
    },
    {
      name: "Sunwal",
      address: "Sunwal-3, Nawalparasi",
      manager: "Bishal Aryal",
      contact: "9801977249",
      email: "sunwal@slbbl.com.np"
    },
    {
      name: "Rampur",
      address: "Rampur 5, Palpa",
      manager: "Arjun Poudel",
      contact: "9801977254",
      email: "rampur@slbbl.com.np"
    },
    {
      name: "Resunga",
      address: "Resunga 7, Gulmi",
      manager: "Mukesh Prasad Padhayaya",
      contact: "9801977256",
      email: "resunga@slbbl.com.np"
    }
  ];

export const karnaliBranches = [
    {
      name: "Birendranagar",
      address: "Birendranagar-7, Surkhet",
      manager: "Nirpa Raj Jaisi",
      contact: "9802334232",
      email: "birendranagar@slbbl.com.np"
    },
    {
      name: "Chhinchu",
      address: "Bheriganga-4, Surkhet",
      manager: "Bed Prakash Pant",
      contact: "9802334234",
      email: "chhinchu@slbbl.com.np"
    }
  ];

  export const sudurpashchimBranches = [
    {
      name: "Bauniya",
      address: "Bardagoriya 1, Kailali",
      manager: "Narayan Dhungana",
      contact: "980-1977276",
      email: "bauniya@slbbl.com.np"
    },
    {
      name: "Chaumala",
      address: "Gauriganga 1, Kailali",
      manager: "Jayendra Prasad Khanal",
      contact: "9801977255",
      email: "chaumala@slbbl.com.np"
    },
    {
      name: "Jhalari",
      address: "Suklaphat 10, Kanchanpur",
      manager: "Mahadev Dhungana",
      contact: "9801977279",
      email: "jhalari@slbbl.com.np"
    },
    {
      name: "Punarwas",
      address: "Punarwas-3, Kanchanpur",
      manager: "Nabin Bahadur Thapa",
      contact: "9801977216",
      email: "punarwas@slbbl.com.np"
    },
    {
      name: "Godawari",
      address: "Godawari 3, Kailali",
      manager: "Harka Saud",
      contact: "9802334224",
      email: "godawari@slbbl.com.np"
    },
    {
      name: "Sisaiya",
      address: "Ghodaghodi 11, Kailali",
      manager: "Kanchan Chaudhary",
      contact: "9802334238",
      email: "sisaiya@slbbl.com.np"
    }
  ];

export const swarojgarData = [
    { title: 'Total Staff',icon:staff, value: '471' },
    { title: 'Branches',icon:branch, value: '91' },
    { title: 'Total Clients',icon:staff, value: '125,884' },
    { title: 'Loan Clients',icon:staff, value: '48,983' },
    { title: 'Loan Outstanding',icon:staff, value: '8,225,774,339.00' },
    { title: 'Saving Collection',icon:staff, value: '3,733,553,067.08' },
  ];


export const successStories = [
    {
      title: "सपना, संघर्ष, साथ-सहयोग अनि सफलता ",
      description: "सपना, संघर्ष, साथ-सहयोग अनि सफलता : सुनौ अम्बिका गिरी",
      fullDescription: ` काभ्रेपलाञ्चोक जिल्ला, बनेपा नगरपालिका वडा नम्बर ५ मा बसोबास गर्दै आउनु भएकी श्रीमती अम्बिका गिरीले मिति २०७८/०९/०७ गते यस संस्था लिमिटेडका कर्मचारीमार्फत बनेपा शाखामा खाता खोली आवद्ध भई सेवा लिँदै आउनुभएको छ।
सुरुमा साना कर्जाबाट व्यवसाय थालनी गरी, हाल आफ्नै कस्मेटिक पसल तथा ब्यूटी पार्लर सञ्चालन गर्दै आउनुभएको छ। आत्मनिर्भर बन्दै गएको प्रमाणस्वरूप, हाल उहाँले रु ३,००,०००/- (अक्षरूपी तीन लाख रूपैयाँ) कर्जा लिई आफ्नो व्यवसाय विस्तार गर्नुभएको छ।

श्रीमान् वैदेशिक रोजगारमा भए तापनि ‘महिलाले पनि केही गर्न सक्छन्’ भन्ने उदाहरण स्वयं उहाँ बनेकी छिन्। व्यवसायबाट प्राप्त दैनिक आम्दानीबाट बालबच्चाको शिक्षादीक्षा, घरव्यवहार सञ्चालन तथा संस्थामा नियमित रूपमा रु १,०००/- देखि रु ५००/- सम्म बचत गर्दै आउनुभएको छ।

यस संस्थामा आबद्ध भएपछि, कर्जा आवश्यक परेको अवस्थामा गाउँघरमा साहु–महाजनसँग ऋण लिनुपर्ने अवस्थाको अन्त्य भएको छ। साथै, लिएको कर्जा एकमुष्ट तिर्नु नपर्ने, मासिक रूपमा सावाँ-ब्याज बुझाउन सकिने सुविधाले गर्दा, व्यवसाय सञ्चालन गर्न अझ सहज भएको छ।

साना कर्जाबाट सुरु गरेको व्यवसाय हाल नगरपालिकामा व्यवसाय दर्ता गरी, वार्षिक रूपमा नेपाल सरकारलाई राजस्व बुझाउँदै आउनुभएको छ। मासिक रूपमा व्यवसायको रु १०,०००/- सटर भाडा तिर्दै, खर्च कटौतीपछि मासिक रु ४०,०००/- नाफा गरिरहेको जानकारी उहाँले दिनुभएको छ।

अन्त्यमा, थोरै कर्जाको सही सदुपयोग गर्न सकेमा, सफल उद्यमी बन्न सकिन्छ भन्ने कुरा अम्बिका गिरीको जीवनस्तर र सफलताले प्रमाणित गर्छ।
      `,
      
      images: [
        s11, 
        s12,
      ]
    },
];

export const notices = [
  "📢 Important Notice: The office will remain closed on Thursday for the public holiday. Make sure to plan accordingly!",
  "🚀 Stay tuned for more updates about upcoming events and new announcements!",
  "📅 Remember to complete your monthly reports by the end of the week.",
  "⚠️ System maintenance is scheduled for Sunday from 10 PM to 12 AM. Please save your work!",
];

export const vacancies = [
  { vacancyDate: "2081.04.25", postedDate: "August 9, 2024", expiryDate:"August 25 2024", fileLink: vac1 },
  { vacancyDate: "2080.05.02", postedDate: "August 21, 2023",expiryDate:"August 25 2024", fileLink: "/path/to/file2.pdf" },
  { vacancyDate: "2079.04.31", postedDate: "August 21, 2022",expiryDate:"August 25 2024", fileLink: "/path/to/file3.pdf" },
  { vacancyDate: "2079.01.09", postedDate: "April 22, 2022",expiryDate:"August 25 2024", fileLink: "/path/to/file4.pdf" },
];

export const financialReports = [
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2081-082",
    fileLink: financialReportPdf,
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2081-082",
    fileLink: "/path/to/financial-report-2081-082-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2080-081",
    fileLink: "/path/to/financial-report-2080-081-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2080-081",
    fileLink: "/path/to/financial-report-2080-081-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2080-081",
    fileLink: "/path/to/financial-report-2080-081-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2080-081",
    fileLink: "/path/to/financial-report-2080-081-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2079-080",
    fileLink: "/path/to/financial-report-2079-080-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2079-080",
    fileLink: "/path/to/financial-report-2079-080-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2078-79",
    fileLink: "/path/to/financial-report-2078-79-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2078-79",
    fileLink: "/path/to/financial-report-2078-79-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2078-79",
    fileLink: "/path/to/financial-report-2078-79-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2078-79",
    fileLink: "/path/to/financial-report-2078-79-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2077-78",
    fileLink: "/path/to/financial-report-2077-78-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2077-78",
    fileLink: "/path/to/financial-report-2077-78-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2077-78",
    fileLink: "/path/to/financial-report-2077-78-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2077-78",
    fileLink: "/path/to/financial-report-2077-78-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2076-77",
    fileLink: "/path/to/financial-report-2076-77-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2076-77",
    fileLink: "/path/to/financial-report-2076-77-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2076-77",
    fileLink: "/path/to/financial-report-2076-77-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2076-77",
    fileLink: "/path/to/financial-report-2076-77-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2075-76",
    fileLink: "/path/to/financial-report-2075-76-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2075-76",
    fileLink: "/path/to/financial-report-2075-76-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2075-76",
    fileLink: "/path/to/financial-report-2075-76-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2075-76",
    fileLink: "/path/to/financial-report-2075-76-Q1.pdf",
  },
  {
    reportName: "Un-audited Financial Report 4th Quarter 2074-75",
    fileLink: "/path/to/financial-report-2074-75-Q4.pdf",
  },
  {
    reportName: "Un-audited Financial Report 3rd Quarter 2074-75",
    fileLink: "/path/to/financial-report-2074-75-Q3.pdf",
  },
  {
    reportName: "Un-audited Financial Report 2nd Quarter 2074-75",
    fileLink: "/path/to/financial-report-2074-75-Q2.pdf",
  },
  {
    reportName: "Un-audited Financial Report 1st Quarter 2074-75",
    fileLink: "/path/to/financial-report-2074-75-Q1.pdf",
  },
];

export const annualReports = [
  {
    reportName: "15th Annual Report FY 2079.080",
    fileLink: annualReportPdf,
  },
  {
    reportName: "14th Annual Report FY 2078.079",
    fileLink: "/path/to/annual-report-2078-079.pdf",
  },
  {
    reportName: "13th Annual Report FY 2077.078",
    fileLink: "/path/to/annual-report-2077-078.pdf",
  },
  {
    reportName: "12th Annual Progress Report FY 2076.077",
    fileLink: "/path/to/annual-report-2076-077.pdf",
  },
  {
    reportName: "11th Annual Progress Report FY 2075.076",
    fileLink: "/path/to/annual-report-2075-076.pdf",
  },
  {
    reportName: "10th Annual Report FY 2074.075",
    fileLink: "/path/to/annual-report-2074-075.pdf",
  },
  {
    reportName: "9th Annual Report FY 2073.074",
    fileLink: "/path/to/annual-report-2073-074.pdf",
  },
  {
    reportName: "8th Annual Report FY 2072.073",
    fileLink: "/path/to/annual-report-2072-073.pdf",
  },
];

export const principalIndicator=[
  {
    reportName:"Principal Indicators FY 2079.080",
    fileLink:principalIndicators,

  },

];



export const staffTrainingReports = [
  {
    reportName: "Staff Training Report Poush End 2081-2082",
    fileLink: staffTrainingReport
  },
  {
    reportName: "Staff Training Report Ashadh End(2080/2081)",
    fileLink: "/path/to/staff-training-report-ashadh-end-2080-2081.pdf"
  },
  {
    reportName: "Staff Training Report (Poush End 2080/2081)",
    fileLink: "/path/to/staff-training-report-poush-end-2080-2081.pdf"
  },
  {
    reportName: "All Staff External Training 2079/2080",
    fileLink: "/path/to/all-staff-external-training-2079-2080.pdf"
  },
  {
    reportName: "All Staff External Training 2079/2080",
    fileLink: "/path/to/all-staff-external-training-2079-2080.pdf"
  }
];

export const sebonDisclosures = [
  {
    disclosureName: "Corporate Governance related Annual Compliance Report – FY 2079.080",
    fileLink: sebonDisclosure
  },
  {
    disclosureName: "AGM MINUTE : 15TH ANNUAL GENERAL MEETING – 2080/11/26",
    fileLink: "http://example.com/report2.pdf"
  },
  {
    disclosureName: "Corporate Governance related Annual Compliance Report – FY 2078.079",
    fileLink: "http://example.com/report3.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 14TH ANNUAL GENERAL MEETING – 2079/12/11",
    fileLink: "http://example.com/report4.pdf"
  },
  {
    disclosureName: "Corporate Governance related Annual Compliance Report – FY 2077.078",
    fileLink: "http://example.com/report5.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 13TH ANNUAL GENERAL MEETING – 2078/07/27",
    fileLink: "http://example.com/report6.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 8TH ANNUAL GENERAL MEETING – 2073/07/13",
    fileLink: "http://example.com/report7.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 9TH ANNUAL GENERAL MEETING – 2074/07/11",
    fileLink: "http://example.com/report8.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 10TH ANNUAL GENERAL MEETING – 2075/06/20",
    fileLink: "http://example.com/report9.pdf"
  },
  {
    disclosureName: "SGM MINUTE: SPECIAL GENERAL MEETING – 2076/04/11",
    fileLink: "http://example.com/report10.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 11TH ANNUAL GENERAL MEETING – 2076/08/28",
    fileLink: "http://example.com/report11.pdf"
  },
  {
    disclosureName: "SGM MINUTE: SPECIAL GENERAL MEETING – 2077/04/10",
    fileLink: "http://example.com/report12.pdf"
  },
  {
    disclosureName: "AGM MINUTE : 12TH ANNUAL GENERAL MEETING – 2077/11/29",
    fileLink: "http://example.com/report13.pdf"
  }
];

export const notice = [
  {
    image: closedNotice,
    noticeName: "Issue Close Notice – Further Public Offering 2081.11.21",
    dateOfIssue: "March 5, 2025",
    details: closedNotice,
  }
];


export const galleries=[
  {
    title:"SLBBL AGM",
    Date:"2024-03-10",
    image:[
      g1,g2,g3,g4,g5
    ],
  },
  {
    title:"SLBBL AGM",
    Date:"2024-03-10",
    image:[
      g1,g2,g3,g4,g5
    ],
  },
   {
    title:"SLBBL AGM",
    Date:"2025-05-12",
    image:[
      agm208201,agm208202,agm208203,agm208204
    ],
  },

];

export const slideshowImages=[agm208201,agm208202,agm208203,agm208204];

export const ourBranches=[
  {
    id: 1,
    name: "Branch Office Netachowk",
    address: "GRAMTHAM-7, MORANG, NETACHOWK",
    manager: "Binod Acharya",
    contact: "9802334230",
    email: "netachowk@slbbl.com.np",
  },
  {
    id: 2,
    name: "Branch Office Mangalbare",
    address: "KAMAL-6, JHAPA, MANGALBARE",
    manager: "Tej Narayan Shrestha",
    contact: "9802334231",
    email: "mangalbare@slbbl.com.np",
  },
  {
    id: 3,
    name: "Branch Office Shivaganj",
    address: "Shivasatakshi 5, Jhapa",
    manager: "Niraj Chaudhary",
    contact: "9802334235",
    email: "shivaganj@slbbl.com.np",
  },
  {
    id: 4,
    name: "Branch Office Rajgadh",
    address: "Barhadashi Rural Municipality -3, Jhapa",
    manager: "Ramesh Bastola",
    contact: "9802334236",
    email: "rajgadh@slbbl.com.np",
  },
  {
    id: 5,
    name: "Branch Office Sombare",
    address: "Pathari Shanishchare Municipality 8, Morang",
    manager: "Raj Kumar Kattel",
    contact: "9802334237",
    email: "sombare@slbbl.com.np",
  },
  {
    id: 6,
    name: "Branch Office Tankisinwari",
    address: "Budhiganga 2, Morang",
    manager: "Satya Narayan Mehata",
    contact: "9801977259",
    email: "tankisinbari@slbbl.com.np",
  },
  {
    id: 7,
    name: "Branch Office Sundhar Haraicha",
    address: "Sundhar Haraicha 4, Morang",
    manager: "Taranath Pokharel",
    contact: "9801977260",
    email: "sundarharaicha@slbbl.com.np",
  },
  {
    id: 8,
    name: "Branch Office Inaruwa",
    address: "Inaruwa 4, Sunsari",
    manager: "Babu Dev Adhikari",
    contact: "9801977261",
    email: "inaruwa@slbbl.com.np",
  },
  {
    id: 9,
    name: "Branch Office Gaighat",
    address: "Triyuga 13, Udayapur",
    manager: "Bishnu Prasad Dhital",
    contact: "9802334223",
    email: "gaighat@slbbl.com.np",
  },
  {
      id: 10,
      name: "Branch Office Beluwa",
      address: "Birgunj 31, Parsa",
      manager: "Raju Prasad Gupta",
      contact: ["9802334247", "9801977229"],
      email: "belwa@slbbl.com.np",
    },
    {
      id: 11,
      name: "Branch Office Laxminiya Dhanusa",
      address: "Laxminiya 7, Dhanusa",
      manager: "Raju Raut",
      contact: "9801977262",
      email: "laxminiyadhanusa@slbbl.com.np",
    },
    {
      id: 12,
      name: "Branch Office Sabaila",
      address: "Sabaila 8, Dhanusha",
      manager: "Laxmi Narayan Chaudhary",
      contact: "9802334220",
      email: "sabaila@slbbl.com.np",
    },
    {
      id: 13,
      name: "Branch Office Manaharwa",
      address: "Jitpur Simara 18, Bara",
      manager: "Purshotam Koirala",
      contact: "9801977230",
      email: "manaharuwa@slbbl.com.np",
    },
    {
      id: 14,
      name: "Branch Office Bhramapura",
      address: "Loharpatti 7, Mahottari",
      manager: "Nagendra Prasad Chaudhary",
      contact: "9801977263",
      email: "bhramarpura@slbbl.com.np",
    },
    {
      id: 15,
      name: "Branch Office Lagama",
      address: "Kamala 3, Dhanusha",
      manager: "Sanjay Kumar Yadav",
      contact: "9802334221",
      email: "lagama@slbbl.com.np",
    },
    {
      id: 16,
      name: "Branch Office Sakhuawa Dhamaura",
      address: "Brindawan 6, Rautahat",
      manager: "Gyanendra Chaudhary",
      contact: "9801977231",
      email: "sakhuawadhamaura@slbbl.com.np",
    },
    {
      id:17,
      name: "Branch Office Gausala",
      address: "Gausala 4, Mahottari",
      manager: "Pritam Chaudhary",
      contact: "9801977264",
      email: "gausala@slbbl.com.np",
    },
    {
      id:18,
      name: "Branch Office Bhaluwahi",
      address: "Siraha 11, Siraha",
      manager: "Rishi Kesh Sing",
      contact: "9802334222",
      email: "bhaluwahi@slbbl.com.np",
    },
    {
      id: 19,
      name: "Branch Office Laxminiya",
      address: "Phatuwa Bijayapur 8, Rautahat",
      manager: "Sarbind Kushwaha",
      contact: ["9801977232", "9802334248"],
      email: "laxminiya@slbbl.com.np",
    },
    {
      id:20,
      name: "Branch Office Barahathawa",
      address: "Barahathawa 7, Sarlahi",
      manager: "Dev Nandan Kumar Raut",
      contact: "9801977265",
      email: "barahathawa@slbbl.com.np",
    },
    {
      id: 21,
      name: "Branch Office Gadi",
      address: "Paterawa Sugauli 2, Parsa",
      manager: "Ram Babu Shah",
      contact: "9801977233",
      email: "gadi@slbbl.com.np",
    },
    {
      id: 22,
      name: "Branch Office Jaleshowar",
      address: "Jaleshowar 2, Mahottari",
      manager: "Birendra Kumar Mahato",
      contact: "9801977274",
      email: "jaleshowar@slbbl.com.np",
    },
    {
      id: 23,
      name: "Branch Office Chandrapur",
      address: "Chandrapur 5, Rautahat",
      manager: "Tek Prasad Khatiwada",
      contact: "9801977236",
      email: "chandrapur@slbbl.com.np",
    },
    {
      id: 24,
      name: "Branch Office Lahan",
      address: "Lahan 8, Siraha",
      manager: "Ajit Yadav",
      contact: "9801977273",
      email: "lahan@slbbl.com.np",
    },
    {
      id: 25,
      name: "Branch Office Rampurwa",
      address: "Kohlbi 1, Bara",
      manager: "Anil Prasad Chauhan",
      contact: "9801977237",
      email: "rampurwa@slbbl.com.np",
    },
    {
      id: 26,
      name: "Branch Office Phulgama",
      address: "Nagarain 4, Dhanusha",
      manager: "Sanjip Kumar Sah",
      contact: "9802334204",
      email: "phulgama@slbbl.com.np",
    },
    {
      id: 27,
      name: "Branch Office Kalaiya",
      address: "Kalaiya 1, Bara",
      manager: "Lal Babu Mahato",
      contact: "9801977238",
      email: "kalaiya@slbbl.com.np",
    },
    {
      id: 28,
      name: "Branch Office Bateshwor",
      address: "Bateshwor 4, Dhanusha",
      manager: "Param Kumari Sah",
      contact: "9802334205",
      email: "bateshwar@slbbl.com.np",
    },
    {
      id: 29,
      name: "Branch Office Simara",
      address: "Jitpur 2, Bara",
      manager: "Rabindra Kushwaha",
      contact: "9801977239",
      email: "simara@slbbl.com.np",
    },
    {
      id: 30,
      name: "Branch Office Ramgopalpur",
      address: "Ramgopalpur 5, Mahottari",
      manager: "Bikash Kumar Shah",
      contact: "9802334206",
      email: "ramgopalpur@slbbl.com.np",
    },
    {
      id: 31,
      name: "Branch Office Bahuwari",
      address: "Parawanipur 8, Bara",
      manager: "Jay Prakash Thakur Barht",
      contact: "9801977240",
      email: "bahuwari@slbbl.com.np",
    },
    {
      id: 32,
      name: "Branch Office Kathauna",
      address: "Shambhunath 6, Saptari",
      manager: "Tej Narayan Das",
      contact: "9802334207",
      email: "kathauna@slbbl.com.np",
    },
    {
      id: 33,
      name: "Branch Office Lipanimal",
      address: "Parawanipur 1, Bara",
      manager: "Arun Kumar Sha",
      contact: "9801977241",
      email: "lipanimal@slbbl.com.np",
    },
    {
      id: 34,
      name: "Branch Office Janakpurdham",
      address: "Janakpur Dham 4, Dhanusha",
      manager: "Gautam Kumar Kusuwaha",
      contact: "9802334208",
      email: "janakpurdham@slbbl.com.np",
    },
    {
      id: 35,
      name: "Branch Office Amritgunj",
      address: "Simrongrah-7, Bara",
      manager: "Nandan Kumar Gupta",
      contact: "9801977244",
      email: "amritgunj@slbbl.com.np",
    },
    {
      id: 36,
      name: "Branch Office Dhananuji",
      address: "Dhananuji 2, Dhanusha",
      manager: "Chandan Jaiswal",
      contact: "9802334209",
      email: "dhanauji@slbbl.com.np",
    },
    {
      id: 37,
      name: "Branch Office Ganja Bhawanipur",
      address: "Mahagadimai-5, Bara",
      manager: "Jaya Kishor Mahato",
      contact: "9801977245",
      email: "ganjabhawanipur@slbbl.com.np",
    },
    {
      id: 38,
      name: "Branch Office Ekdara",
      address: "Ekdara 1, Mahottari",
      manager: "Mahesh Kumar Shah",
      contact: "9802334211",
      email: "ekdara@slbbl.com.np",
    },
    {
      id: 39,
      name: "Branch Office Sedhawa",
      address: "Jirabhawani 1, Parsa",
      manager: "Upendra Prasad Gupta",
      contact: "9801977246",
      email: "sedhawa@slbbl.com.np",
    },
    {
      id: 40,
      name: "Branch Office Hariwan",
      address: "Hariwan 4, Sarlahi",
      manager: "Prakash Kumar Thakur",
      contact: "9801977247",
      email: "hariwan@slbbl.com.np",
    },
    {
      id: 41,
      name: "Branch Office Gonsari",
      address: "Gonsari 1, Dhanusha",
      manager: "Amit Kumar Chaudhary",
      contact: "9802334212",
      email: "gonsari@slbbl.com.np",
    },
    {
      id: 42,
      name: "Branch Office Dharmapur",
      address: "Dharmapur 3, Parsa",
      manager: "Saroj Kumar Mahato",
      contact: "9801977248",
      email: "dharmapur@slbbl.com.np",
    },
    {
      id: 43,
      name: "Branch Office Dubauliya",
      address: "Dubauliya 1, Bara",
      manager: "Narendra Prasad Ghimire",
      contact: "9802334213",
      email: "dubauliya@slbbl.com.np",
    },
    {
      id:44,
      name: "Branch Office Sonauli",
      address: "Sonauli 2, Rupandehi",
      manager: "Basant Kumar Yadav",
      contact: "9801977249",
      email: "sonauli@slbbl.com.np",
    },
  
  {
    id:45,
    name: "Branch Office Hetauda",
    address: "Hetauda 4, Makawanapur",
    manager: "Keshav Kadel",
    contact: ["9801977219", "057-526795"],
    email: "hetauda@slbbl.com.np"
},
{
  id:46,
    name: "Branch Office Tandi",
    address: "Ratnanagar 2, Chitwan",
    manager: "Om Nath Khatiwada",
    contact: ["9801977220", "056-563317"],
    email: "tandi@slbbl.com.np"
},
{
  id:47,
    name: "Branch Office Gitanagar",
    address: "Bharatpur 5, Chitwan",
    manager: "Indira Lamsal",
    contact: ["9801977221", "056-400259"],
    email: "gitanagar@slbbl.com.np"
},
{
  id:48,
    name: "Branch Office Panauti",
    address: "Panauti 6, Kavre",
    manager: "Dipu Karki",
    contact: ["9801977222", "011-441290"],
    email: "panauti@slbbl.com.np"
},
{
  id:49,
    name: "Branch Office Chanauli",
    address: "Bharatpur 20, Chitwan",
    manager: "Krishna Kanta Adhikari",
    contact: ["9801977223", "056-591948"],
    email: "chanauli@slbbl.com.np"
},
{
  id:50,
    name: "Branch Office Parsa",
    address: "Khairahani 8, Chitwan",
    manager: "Asmita Kumari Gautam",
    contact: ["9801977224", "056-583798"],
    email: "parsachitwan@slbbl.com.np"
},
{id:51,
    name: "Branch Office Kholesimal",
    address: "Kalika 6, Clubchowk, Chitwan",
    manager: "Punya Prasad Pokharel",
    contact: ["9801977225", "056-594003"],
    email: "kholesimal@slbbl.com.np"
},
{
  id:52,
    name: "Branch Office Manahari",
    address: "Manahari 7, Makawanpur",
    manager: "Nim Bdr Saru",
    contact: ["9801977226", "057-414082"],
    email: "manahari@slbbl.com.np"
},
{
  id:53,
    name: "Branch Office Bidur",
    address: "Bidur 2, Nuwakot",
    manager: "Sunoj Joshi",
    contact: ["9801977252"],
    email: "bidur@slbbl.com.np"
},
{
  id:54,
    name: "Branch Office Malekhu",
    address: "Benighat Rorang 3, Dhading",
    manager: "Sahadev Timalsina",
    contact: ["9801977253"],
    email: "malekhu@slbbl.com.np"
},
{
  id:55,
    name: "Branch Office Kalamashi",
    address: "Banepa 1, Kavre",
    manager: "Rojina Lama",
    contact: ["9802334216"],
    email: "kalamasi@slbbl.com.np"
},
{
  id:56,
    name: "Branch Office Mulkot",
    address: "Sunkoshi-5, Sindhuli, Mulkot",
    manager: "Ram Bahadur Thakuri",
    contact: ["9802334229"],
    email: "mulkot@slbbl.com.np"
},
{
  id:57,
    name: "Branch Office Bhotechaur",
    address: "Melamchi-2, Sindhupalchok, Bhotechaur",
    manager: "Utsav Mahat",
    contact: ["9802334227"],
    email: "bhotechaur@slbbl.com.np"
},
{
  id:58,
    name: "Branch Office Syuchatar",
    address: "Nagarjun-10, Kathmandu",
    manager: "Bijaya Kumar Devkota",
    contact: ["9802334233"],
    email: "syuchatar@slbbl.com.np"
},
{
  id:59,
    name: "Branch Office Banepa",
    address: "Banepa-5, Kavre",
    manager: "N/A",
    contact: ["9801977217", "011-661691"],
    email: "banepa@slbbl.com.np"
},
{
  id:60,
    name: "Branch Office Bharatpur",
    address: "Bharatpur 10, Chitwan",
    manager: "Jeevan Manandhar",
    contact: ["9801977218", "056-493989"],
    email: "bharatpur@slbbl.com.np"
},
{
  id:61,
  name: "Branch Office Narayani",
  address: "Madhyabindu 4, Nawalparasi East",
  manager: "Vidya Regmi",
  contact: ["9801977227", "078-401047"],
  email: "narayani@slbbl.com.np"
},
{
  id:62,
  name: "Branch Office Baisjagar",
  address: "Bhanu 9, Tanahu",
  manager: "Mithu Chhetri",
  contact: ["9801977228"],
  email: "baisjagar@slbbl.com.np"
},
{
  id:63,
  name: "Branch Office BeniManipur",
  address: "Binayi Triveni 4, Nawalpur",
  manager: "Dayaram Sharma",
  contact: ["9801977234"],
  email: "benimanipur@slbbl.com.np"
},
{
  id:64,
  name: "Branch Office Khoplang",
  address: "Palungtar 1, Gorkha",
  manager: "Gokul Regmi",
  contact: ["9801977235"],
  email: "khoplang@slbbl.com.np"
},
{
  id:65,
  name: "Branch Office Kawasoti",
  address: "Kawasoti 3, Nawalpur",
  manager: "Kausila Uperty",
  contact: ["9801977242"],
  email: "kawasoti@slbbl.com.np"
},
{
  id:66,
  name: "Branch Office Rajahar",
  address: "Debchuli 16, Nawalpur",
  manager: "Rahul Pathak",
  contact: ["9801977248"],
  email: "rajahar@slbbl.com.np"
},
{
  id:67,
  name: "Branch Office Beshisahar",
  address: "Besishar 11, Lamjung",
  manager: "Suresh Pantha",
  contact: ["9801977250"],
  email: "beshisahar@slbbl.com.np"
},
{
  id:68,
  name: "Branch Office Damauli",
  address: "Byas 1, Tanahu",
  manager: "Lilaraj Ghmire",
  contact: ["9801977251"],
  email: "damauli@slbbl.com.np"
},
{
  id:69,
  name: "Branch Office Tribeni",
  address: "Binaya Triveni 6, Nawalpur",
  manager: "Bishal Khadka",
  contact: ["9802334214"],
  email: "tribeni@slbbl.com.np"
},
{
  id:70,
  name: "Sandhikharka",
  address: "Sandhikharka 2, Argakhachi",
  manager: "Chandra Dev Khanal",
  contact: "9801977257",
  email: "sandhikharka@slbbl.com.np"
},
{
  id:71,
  name: "Gadawa",
  address: "Gadawa 6, Dang",
  manager: "Mukunda Prasad Ghimire",
  contact: "9801977266",
  email: "gadawa@slbbl.com.np"
},
{
  id:72,
  name: "Shreepur",
  address: "Kohalpur 5, Banke",
  manager: "Bhuban Prasad Bhatt",
  contact: "9801977267",
  email: "shreepur@slbbl.com.np"
},
{
  id:73,
  name: "Mainapokhar",
  address: "Badaiyatal 6, Bardiya",
  manager: "Dan Bahadur Khadka",
  contact: "9801977268",
  email: "mainapokhar@slbbl.com.np"
},
{
  id:74,
  name: "Rajapur",
  address: "Rajapur 3, Bardiya",
  manager: "Himal Joshi",
  contact: "9801977269",
  email: "rajapur@slbbl.com.np"
},
{
  id:75,
  name: "Tilotama",
  address: "Tilotama 7, Rupandehi",
  manager: "Santosh Aryal",
  contact: "9801977270",
  email: "tilotama@slbbl.com.np"
},
{
  id:76,
  name: "Sainamaina",
  address: "Sainamaina 4, Rupandehi",
  manager: "Bhuvan Acharya",
  contact: "9801977271",
  email: "sainamaina@slbbl.com.np"
},
{
  id:77,
  name: "Badganga",
  address: "Badganga 3, Kapilbastu",
  manager: "Raju Chaudhary",
  contact: "9801977272",
  email: "badganga@slbbl.com.np"
},
{
  id:78,
  name: "Madhuwan",
  address: "Madhuwan 9, Bardiya",
  manager: "Hari Prasad Bhattarai",
  contact: "9802334215",
  email: "madhuwan@slbbl.com.np"
},
{
  id:79,
  name: "Barbardiya",
  address: "Barbardiya 8, Bardiya",
  manager: "Pusta Bahadur Pandey",
  contact: "9802334226",
  email: "barbardiya@slbbl.com.np"
},
{
  id:80,
  name: "Semari",
  address: "Bardaghat 14, Nawalparasi",
  manager: "Iran Rana Magar",
  contact: "9801977243",
  email: "semari@slbbl.com.np"
},
{
  id:81,
  name: "Sunwal",
  address: "Sunwal-3, Nawalparasi",
  manager: "Bishal Aryal",
  contact: "9801977249",
  email: "sunwal@slbbl.com.np"
},
{
  id:82,
  name: "Rampur",
  address: "Rampur 5, Palpa",
  manager: "Arjun Poudel",
  contact: "9801977254",
  email: "rampur@slbbl.com.np"
},
{
  id:83,
  name: "Resunga",
  address: "Resunga 7, Gulmi",
  manager: "Mukesh Prasad Padhayaya",
  contact: "9801977256",
  email: "resunga@slbbl.com.np"
},
{
  id:84,
  name: "Birendranagar",
  address: "Birendranagar-7, Surkhet",
  manager: "Nirpa Raj Jaisi",
  contact: "9802334232",
  email: "birendranagar@slbbl.com.np"
},
{
  id:85,
  name: "Chhinchu",
  address: "Bheriganga-4, Surkhet",
  manager: "Bed Prakash Pant",
  contact: "9802334234",
  email: "chhinchu@slbbl.com.np"
},
{
  id:86,
  name: "Bauniya",
  address: "Bardagoriya 1, Kailali",
  manager: "Narayan Dhungana",
  contact: "980-1977276",
  email: "bauniya@slbbl.com.np"
},
{
  id:87,
  name: "Chaumala",
  address: "Gauriganga 1, Kailali",
  manager: "Jayendra Prasad Khanal",
  contact: "9801977255",
  email: "chaumala@slbbl.com.np"
},
{
  id:88,
  name: "Jhalari",
  address: "Suklaphat 10, Kanchanpur",
  manager: "Mahadev Dhungana",
  contact: "9801977279",
  email: "jhalari@slbbl.com.np"
},
{
  id:89,
  name: "Punarwas",
  address: "Punarwas-3, Kanchanpur",
  manager: "Nabin Bahadur Thapa",
  contact: "9801977216",
  email: "punarwas@slbbl.com.np"
},
{
  id:90,
  name: "Godawari",
  address: "Godawari 3, Kailali",
  manager: "Harka Saud",
  contact: "9802334224",
  email: "godawari@slbbl.com.np"
},
{
  id:91,
  name: "Sisaiya",
  address: "Ghodaghodi 11, Kailali",
  manager: "Kanchan Chaudhary",
  contact: "9802334238",
  email: "sisaiya@slbbl.com.np"
}
];



export const headOfficeStaff = [
  {
    name: "Pratima Basnet",
    position: "Junior Assistant",
    department: "Credit Department",
    image: "",
    contact: "Pratima@slbbl.com.np",
    bio: "Pratima has 3 years of experience in credit and loan department..."
  },
  {
    name: "Puja Shrestha (Phaju)",
    position: "Junior Assistant",
    department: "Credit Department",
    image: "",
    contact: "Puja@slbbl.com.np",
    bio: "Puja has 3 months of experience in credit and loan department..."
  },
  {
    name: "Shovit Gautam",
    position: "Junior Officer",
    department: "Internal Audit Department",
    image: "",
    contact: "shovit@slbbl.com.np",
    bio: "Shovit oversees financial reporting and budgeting..."
  },
  {
    name: "Dipesh Shrestha",
    position: "Junior Assistant",
    department: "IT Department",
    image: "",
    contact: "dipesh@slbbl.com.np",
    bio: "Dipesh has 3 months of experience in IT..."
  },
  {
    name: "Dinesh Lamichhane",
    position: "Junior Assistant",
    department: "Account Department",
    image: "",
    contact: "Dinesh@slbbl.com.np",
    bio: "Dinesh has 3 months of experience in Accounting..."
  },
  {
    name: "Suman Acharya",
    position: "Senior Assistant",
    department: "DCGF",
    image: "",
    contact: "suman@slbbl.com.np",
    bio: "Suman has 5 years of experience in DCGF..."
  },
  {
    name: "Surendra Kuikel",
    position: "Senior Assistant",
    department: "HR Department",
    image: "",
    contact: "surendra@slbbl.com.np",
    bio: "Surendra has 5 years of experience in HR..."
  },
  {
    name: "Maikal Rawal",
    position: "Assistant",
    department: "Account Department",
    image: "",
    contact: "maikal@slbbl.com.np",
    bio: "maikel has  years of experience in account..."
  },
  {
    name: "Gokul Mahat",
    position: "Driver",
    department: "Driver",
    image: "",
    contact: "gokul@slbbl.com.np",
    bio: "gokul has  years of experience in driving..."
  },
  {
    name: "Bishnu Bahadur Gurung",
    position: "Assistant Messenger",
    department: "Messenger",
    image: "",
    contact: "bishnu@slbbl.com.np",
    bio: "bishnu has  years of experience in cooking..."
  },
  {
    name: "Arun Kumar Shrestha",
    position: "Assistant Messenger",
    department: "Messenger",
    image: "",
    contact: "arun@slbbl.com.np",
    bio: "SArun has  years of experience in cooking..."
  },
  {
    name: "Anup Gelal",
    position: "Assistant Officer",
    department: "IT Department",
    image: "",
    contact: "surendra@slbbl.com.np",
    bio: "Anup has  years of experience"
  },
  {
    name: "Laxman Kumar Mandal",
    position: "Junior Assistant",
    department: "IT Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: "laxman has years of experience"
  },
  {
    name: "Sandhya Thapa",
    position: "Management Trainee",
    department: "Admin Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: "has  years of experience in"
  },
  {
    name: "Suman Kumar Ghimire",
    position: "Senior Assistant",
    department: "Account Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has  years of experience in"
  },
  {
    name: "Tirtha Raj Neupane",
    position: "Senior Assistant",
    department: "IT Department",
    image: tirtharajneupane,
    contact: "@slbbl.com.np",
    bio: " has years of experience in"
  },
  {
    name: "Jay Prakash Kamat",
    position: "Senior Assistant",
    department: "IT Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has years of experience in"
  },
  {
    name: "Rajan Khatiwada",
    position: "Senior Assistant",
    department: "HR Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: "has years of experience in"
  },
  {
    name: "Bal Krishna Shrestha",
    position: "Senior Assistant",
    department: "Credit Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: "has years of experience in"
  },
  {
    name: "Rabina Pokhrel",
    position: "Senior Assistant",
    department: "Account Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: "has years of experience i."
  },
  {
    name: "Dinesh Mahato",
    position: "Trainee",
    department: "Trainee",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has years of experience in."
  },
  {
    name: "Namrata KC",
    position: "Trainee",
    department: "Trainee",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has years of experience in ."
  },
  {
    name: "Upasana Chaulagain",
    position: "Trainee",
    department: "Trainee",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has  years of experience in.."
  },
  {
    name: "Dipa Parajuli",
    position: "Trainee",
    department: "HR Department",
    image: "",
    contact: "@slbbl.com.np",
    bio: " has years of experience in "
  },
  
];

