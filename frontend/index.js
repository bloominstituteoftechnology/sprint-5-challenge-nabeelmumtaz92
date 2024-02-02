async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

/// Assuming axios is globally available

// Function to fetch data from an endpoint
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Main function to load and display data
async function loadData() {
  const learnersData = await fetchData('http://localhost:3003/api/learners');
  const mentorsData = await fetchData('http://localhost:3003/api/mentors');

  // Map mentors' IDs to their names
  const mentorMap = mentorsData.reduce((acc, mentor) => {
    acc[mentor.id] = mentor.firstName + " " + mentor.lastName;
    return acc;
  }, {});

  // Transform learners to include mentor names instead of IDs
  const transformedLearners = learnersData.map(learner => ({
    ...learner,
    mentors: learner.mentors.map(id => mentorMap[id])
  }));

  const cardsContainer = document.querySelector('.cards');
  transformedLearners.forEach(learner => {
    const card = createLearnerCard(learner);
    cardsContainer.appendChild(card);
  });
}

function createLearnerCard(learner) {
  const card = document.createElement('div');
  card.className = 'card';

  const name = document.createElement('h3');
  name.textContent = learner.fullName; // Initially, don't show ID
  card.appendChild(name);

  const email = document.createElement('div');
  email.textContent = learner.email;
  card.appendChild(email);

  const mentorsHeader = document.createElement('h4');
mentorsHeader.className = 'mentors-header';

const arrow = document.createElement('span'); // Create a span for the arrow
arrow.textContent = '►'; // Use a character entity alternative
mentorsHeader.appendChild(arrow);

const mentorsText = document.createElement('span'); // Create a span for the text "Mentors"
mentorsText.textContent = ' Mentors';
mentorsHeader.appendChild(mentorsText);

card.appendChild(mentorsHeader);

const mentorsList = document.createElement('ul');
mentorsList.style.display = 'none';
learner.mentors.forEach(mentorName => {
  const mentorItem = document.createElement('li');
  mentorItem.textContent = mentorName;
  mentorsList.appendChild(mentorItem);
});
card.appendChild(mentorsList);

mentorsHeader.addEventListener('click', function(event) {
  event.stopPropagation();
  mentorsList.style.display = mentorsList.style.display === 'block' ? 'none' : 'block';
  arrow.textContent = mentorsList.style.display === 'block' ? '▼' : '►'; // Update the arrow based on the list's visibility
});

  card.addEventListener('click', function(event) {
    event.stopPropagation();
    const isSelected = card.classList.toggle('selected');
    if (isSelected) {
      name.textContent = `${learner.fullName}, ID ${learner.id}`;
    } else {
      name.textContent = learner.fullName; // Hide ID if deselected, though current logic keeps it selected
    }

    // Ensure only one card is selected at a time
    document.querySelectorAll('.card.selected').forEach(selectedCard => {
      if (selectedCard !== card) {
        selectedCard.classList.remove('selected');
        const h3 = selectedCard.querySelector('h3');
        h3.textContent = selectedCard.querySelector('h3').textContent.replace(/, ID \d+/, '');
        selectedCard.querySelector('ul').style.display = 'none';
        selectedCard.querySelector('.mentors-header').innerHTML = '&#9658; Mentors';
      }
    });
  });

  return card;
}

// Ensure everything is loaded before running the script
document.addEventListener('DOMContentLoaded', loadData);

  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
