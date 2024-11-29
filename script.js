function validate() {
     alert("Submitted");
}

function show() {
     const LogInForm = document.querySelector('.floatLogin');
     const Main = document.querySelector('.navbar');
     LogInForm.style.display = "block";
     // Main.style.filter = "opacity(0.5)";
}

function off() {
     const LogInForm = document.querySelector('.floatLogin');
     const Main = document.querySelector('.navbar');
     LogInForm.style.display = "none";
     // Main.style.filter = "opacity(1)";
}

// document.addEventListener('click', off);

document.addEventListener('DOMContentLoaded', function () {
     const text = document.getElementById('textChange');
     const words = ["1000+", "Most Searched", "Best"];
     let wordIndex = 0;
     let charIndex = 0;
     let isDeleting = false;

     function typeWriter(){
          const currentWord = words[wordIndex];

          if(!isDeleting && charIndex < currentWord.length)
          {
               text.textContent += currentWord.charAt(charIndex);
               charIndex++;
               setTimeout(typeWriter, 150);
          } 
          else if(isDeleting && charIndex > 0)
          {
               text.textContent = currentWord.substring(0, charIndex-1);
               charIndex--;
               setTimeout(typeWriter, 100);
          }
          else if(charIndex === currentWord.length)
          {
               setTimeout(function(){
                    isDeleting = true;
                    typeWriter();
               }, 1000)
          }
          else if(charIndex === 0)
          {
               isDeleting = false;
               wordIndex = (wordIndex + 1) % words.length;
               setTimeout(typeWriter, 500);
          }
     }

     typeWriter();


/* Display Colleges */

// Scraper API key
// const API_KEY = '36219bc68841d68e2438e5efc1bf884e';
const API_KEY = '0789e1eb5d86c31ddfc6184108bb6f92';
// Base URL for fetching the college data
const baseUrl = 'https://collegedunia.com/web-api/listing?data=';
const initialEncodedData = 'eyJ1cmwiOiJpbmRpYS1jb2xsZWdlcyIsInBhZ2UiOjE5LCJ2aWV3IjoidGFibGUiLCJoYXNfdGV4dF9yYW5raW5nIjpmYWxzZX0=';

// List of cities to filter
const targetCities = [
    'mumbai',
    'navi mumbai',
    'thane',
    'palghar',
    'kalyan',
    'shahapur',
    'vasai',
    'wada',
    'bhiwandi'
];

// Function to decode Base64 and encode JSON back to Base64
function modifyEncodedData(encodedData, pageNumber) {
    const decodedData = atob(encodedData);
    const jsonData = JSON.parse(decodedData);
    jsonData.page = pageNumber;
    const updatedData = JSON.stringify(jsonData);
    return btoa(updatedData);
}

let a = 1;
// Function to display college data in table view
function displayCollegeData(colleges) {
     let table = document.querySelector('.top10view table');
     
     // Create table if it doesn't exist
     if (!table) {
         table = document.createElement('table');
         const thead = document.createElement('thead');
         thead.innerHTML = `
             <tr>
                 <td>Rank</td>
                 <td>College</td>
                 <td>Fees</td>
                 <td>Rating</td>
             </tr>
         `;
         table.appendChild(thead);
         
         const tbody = document.createElement('tbody');
         tbody.id = 'college-data-body';
         table.appendChild(tbody);
         
         document.querySelector('.top10view').appendChild(table);
     }
     
     // Get the tbody element
     const tbody = table.querySelector('tbody');
     let cd = "https://images.collegedunia.com/";
     // Add new rows
     colleges.forEach(college => {
         const fees = college.fees.map(fee => 
             `${fee.name} (${fee.short_form}): ${fee.fee} INR`
         ).join('<br>');
     
         const ranking = college.rankingData && college.rankingData.length > 0 
         ? college.rankingData[0].rankingOfCollege 
         : 'N/A';
 
         const row = document.createElement('tr');
         row.innerHTML = `
             <td>${a}</td>
             <td><img src="${cd+college.logo}"></img>${college.college_name}</td>
             <td>${fees}</td>
             <td>${ranking}</td>
             <td>${college.rating}</td>
         `;
         tbody.appendChild(row);
         a++;
        });
 }


// Function to fetch and display college data from all pages
async function fetchAndDisplayCollegeData() {
    const pagesPerBatch = 3; // Number of pages to fetch in parallel
    let pageNumber = 1;
    let hasMorePages = true;
    const maxRetries = 3; // Maximum number of retries
    const retryDelay = 2000; // Delay between retries in milliseconds

    while (hasMorePages) {
        const fetchPromises = [];
        for (let i = 0; i < pagesPerBatch; i++) {
            const currentPageNumber = pageNumber + i;
            const updatedData = modifyEncodedData(initialEncodedData, currentPageNumber);
            const scraperApiUrl = `https://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(baseUrl + updatedData)}`;

            fetchPromises.push(
                fetch(scraperApiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.colleges && data.colleges.length > 0) {
                            // Filter colleges located in target cities
                            const matchingColleges = data.colleges.filter(college => targetCities.includes(college.college_city.toLowerCase()));
                            
                            // Display colleges in target cities immediately
                            if (matchingColleges.length > 0) {
                                displayCollegeData(matchingColleges);
                            }
                        } else {
                            hasMorePages = false;
                        }
                    })
                    .catch(error => {
                        console.error(`Error fetching data: ${error.message}`);
                    })
            );
        }

        try {
            await Promise.all(fetchPromises);
            pageNumber += pagesPerBatch;
        } catch (error) {
            console.error(`Error during batch fetch: ${error.message}`);
            // Handle retry logic here if needed
        }
    }
}

// Fetch data when the page loads
window.onload = fetchAndDisplayCollegeData();


/* Here is new Code without API*/
/*
let cd = "https://images.collegedunia.com/";
let collegesData = []; // Store fetched data here

// Function to display top 10 colleges sorted by rating
function displayTopColleges(data) {
    const tableBody = document.querySelector('.top10view tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    const top10Colleges = data.slice(0, 10); // Get only the top 10 colleges
    top10Colleges.forEach((college, index) => {
        const fees = college.fees.length > 0 ? college.fees[0].fee : 'N/A';
        const ranking = college.rankingData.length > 0 ? college.rankingData[0].rankingOfCollege : 'N/A';
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${cd + college.logo}"></img>${college.college_name}</td>
                <td>${college.fees[0]?.short_form || ''}<br>${fees} INR</td>
                <td>${college.rating}</td>
                <td>${ranking}<sup>th</sup></td>
            </tr>
        `;
    });
}

// Fetch the JSON data and display top 10 colleges
async function fetchCollegeData() {
    const folderPath = 'http://localhost/CollegesJsons/cors.php'; // Path to the folder
    const fileBaseName = 'colleges_in_target_cities'; // Base name of the files
    let fileIndex = 0; // Start with the first file

    while (true) {
        try {
            // Construct the file name
            const fileName = `${folderPath}/${fileBaseName} (${fileIndex}).json`;

            // Fetch the file
            const response = await fetch(fileName);
            if (!response.ok) {
                console.log(`File not found: ${fileName}`);
                break; // Stop when a file is not found
            }

            const data = await response.json();
            collegesData.push(...data); // Append data
            fileIndex++; // Increment the index to fetch the next file
        } catch (error) {
            console.error(`Error fetching file: ${fileName}`, error);
            break;
        }
    }

    // Sort by rating in descending order
    collegesData.sort((a, b) => b.rating - a.rating);

    // Display the top 10 colleges
    displayTopColleges(collegesData);
}

// Check local storage on page load
function initializePage() {
    const storedData = localStorage.getItem('collegesData');

    if (storedData) {
        // Use data from local storage if available
        collegesData = JSON.parse(storedData);
        displayTopColleges(collegesData);
    } else {
        // Fetch data if not already stored
        fetchCollegeData();
    }
}*/

});

